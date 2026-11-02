import { describe, it, expect } from 'vitest'
import canvasTextParagraphs from '../src/core/canvasTextParagraphs'
import { createMockContext, LINE_HEIGHT } from './helpers/mockCanvas'

// Mock metrics: 10px per char, lineHeight 11 (see helpers/mockCanvas.js).
// Tests lock CURRENT behavior. Cases tagged [KNOWN ISSUE] document behavior
// listed in CLAUDE.md "known issues"; update them when the behavior is fixed.

const run = (text, options, canvas) => {
  const ctx = createMockContext(canvas)
  canvasTextParagraphs(text, ctx, options)
  return ctx
}

describe('horizontal align', () => {
  it('left: draws at xStart', () => {
    const ctx = run('hello world')
    expect(ctx.calls).toEqual([{ text: 'hello world', x: 0, y: 0 }])
  })

  it('center', () => {
    const ctx = run('aaaa', { width: 100, align: 'center' })
    expect(ctx.calls).toEqual([{ text: 'aaaa', x: 30, y: 0 }])
  })

  it('right', () => {
    const ctx = run('aaaa', { width: 100, align: 'right' })
    expect(ctx.calls).toEqual([{ text: 'aaaa', x: 60, y: 0 }])
  })

  it('justify: spreads words on non-last lines, last line is left', () => {
    const ctx = run('aaaa bbbb cccc', { width: 100, align: 'justify' })
    expect(ctx.calls).toEqual([
      { text: 'aaaa', x: 0, y: 0 },
      { text: 'bbbb', x: 60, y: 0 },
      { text: 'cccc', x: 0, y: LINE_HEIGHT },
    ])
  })
})

describe('word wrap', () => {
  it('wraps words onto new lines at width', () => {
    const ctx = run('aaaa bbbb cccc', { width: 100 })
    expect(ctx.calls).toEqual([
      { text: 'aaaa bbbb', x: 0, y: 0 },
      { text: 'cccc', x: 0, y: LINE_HEIGHT },
    ])
  })

  it('[KNOWN ISSUE] a word wider than width is not split (overflows)', () => {
    const ctx = run('aaaaaaaaaaaaaaa', { width: 50 })
    expect(ctx.calls).toEqual([{ text: 'aaaaaaaaaaaaaaa', x: 0, y: 0 }])
  })
})

describe('indent', () => {
  it('firstLine: indents only the first line', () => {
    const ctx = run('aaaa bbbb cccc', { width: 100, indent: { type: 'firstLine', by: 2 } })
    expect(ctx.calls).toEqual([
      { text: 'aaaa', x: 20, y: 0 },
      { text: 'bbbb cccc', x: 0, y: LINE_HEIGHT },
    ])
  })

  it('hanging: indents every line except the first', () => {
    const ctx = run('aaaa bbbb cccc', { width: 100, indent: { type: 'hanging', by: 2 } })
    expect(ctx.calls).toEqual([
      { text: 'aaaa bbbb', x: 0, y: 0 },
      { text: 'cccc', x: 20, y: LINE_HEIGHT },
    ])
  })

  it('none: no indentation', () => {
    const ctx = run('aaaa', { indent: { type: 'none', by: 5 } })
    expect(ctx.calls).toEqual([{ text: 'aaaa', x: 0, y: 0 }])
  })
})

describe('paragraph spacing', () => {
  it('spaceBeforeParagraph / spaceAfterParagraph', () => {
    const ctx = run('a\nb', { spaceBeforeParagraph: 5, spaceAfterParagraph: 3 })
    expect(ctx.calls).toEqual([
      { text: 'a', x: 0, y: 5 },
      { text: 'b', x: 0, y: 24 },
    ])
  })

  it('splits paragraphs on newline', () => {
    const ctx = run('a\nb')
    expect(ctx.calls).toEqual([
      { text: 'a', x: 0, y: 0 },
      { text: 'b', x: 0, y: LINE_HEIGHT },
    ])
  })
})

describe('lineSpacing', () => {
  it('numeric lineSpacing multiplies line height', () => {
    const ctx = run('a\nb', { lineSpacing: 2 })
    expect(ctx.calls).toEqual([
      { text: 'a', x: 0, y: 0 },
      { text: 'b', x: 0, y: LINE_HEIGHT * 2 },
    ])
  })
})

describe('vertical align', () => {
  it('middle', () => {
    const ctx = run('a', { verticalAlign: 'middle' })
    expect(ctx.calls).toEqual([{ text: 'a', x: 0, y: (100 - LINE_HEIGHT) / 2 }])
  })

  it('bottom', () => {
    const ctx = run('a', { verticalAlign: 'bottom' })
    expect(ctx.calls).toEqual([{ text: 'a', x: 0, y: 100 - LINE_HEIGHT }])
  })
})

describe('position, baseline and clipping', () => {
  it('xStart / yStart offset the text', () => {
    const ctx = run('aaaa', { xStart: 5, yStart: 7 })
    expect(ctx.calls).toEqual([{ text: 'aaaa', x: 5, y: 7 }])
  })

  it('sets ctx.textBaseline and does not restore it', () => {
    const ctx = run('a', { baseLine: 'middle' })
    expect(ctx.textBaseline).toBe('middle')
  })

  it('does not draw lines that fall below height', () => {
    const ctx = run('a\nb\nc', { height: 20 })
    expect(ctx.calls.map((c) => c.text)).toEqual(['a', 'b'])
  })
})

describe('validation errors', () => {
  const ctx = () => createMockContext()
  const call = (options) => () => canvasTextParagraphs('text', ctx(), options)

  it('rejects non-string text', () => {
    expect(() => canvasTextParagraphs(123, ctx())).toThrow('Invalid text')
  })

  it('rejects non-canvas ctx', () => {
    expect(() => canvasTextParagraphs('text', {})).toThrow('Invalid ctx')
  })

  it.each([
    [{ baseLine: 'x' }, 'Invalid Baseline'],
    [{ align: 'x' }, 'Invalid Align'],
    [{ verticalAlign: 'x' }, 'Invalid verticalAlign'],
    [{ indent: { type: 'x', by: 1 } }, 'Invalid indent.type'],
    [{ indent: { type: 'firstLine', by: 'a' } }, 'Invalid indent.by'],
    [{ spaceBeforeParagraph: '1' }, 'Invalid spaceBeforeParagraph'],
    [{ spaceAfterParagraph: '1' }, 'Invalid spaceAfterParagraph'],
    [{ xStart: '1' }, 'Invalid xStart'],
    [{ yStart: '1' }, 'Invalid yStart'],
    [{ width: 'abc' }, 'Invalid width'],
    [{ height: 'abc' }, 'Invalid height'],
    [{ lineSpacing: 'abc' }, 'Invalid lineSpacing'],
  ])('rejects %j', (options, message) => {
    expect(call(options)).toThrow(message)
  })

  it("accepts 'auto' for width, height and lineSpacing", () => {
    expect(call({ width: 'auto', height: 'auto', lineSpacing: 'auto' })).not.toThrow()
  })

  it('indent without `by` uses default by = 0 (deep merge)', () => {
    expect(call({ indent: { type: 'firstLine' } })).not.toThrow()
  })
})

describe('indent deep merge (regression CTP-7)', () => {
  it('firstLine without `by` renders like by = 0', () => {
    const a = run('aaaa bbbb', { indent: { type: 'firstLine' } })
    const b = run('aaaa bbbb', { indent: { type: 'firstLine', by: 0 } })
    expect(a.calls).toEqual(b.calls)
    expect(a.calls).toEqual([{ text: 'aaaa bbbb', x: 0, y: 0 }])
  })

  it('indent with only `by` behaves as type none', () => {
    const ctx = run('aaaa bbbb cccc', { width: 100, indent: { by: 20 } })
    expect(ctx.calls).toEqual(run('aaaa bbbb cccc', { width: 100 }).calls)
  })
})
