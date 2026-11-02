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

  it('applies baseLine while drawing', () => {
    const ctx = run('a', { baseLine: 'middle' })
    expect(ctx.stateAtDraw.map((s) => s.textBaseline)).toEqual(['middle'])
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

describe('word wrap trailing space (regression CTP-8)', () => {
  // 'aaaa bbbb' measures 90px (9 chars x 10px)
  it('keeps a line that fits exactly the max width', () => {
    const ctx = run('aaaa bbbb', { width: 90 })
    expect(ctx.calls).toEqual([{ text: 'aaaa bbbb', x: 0, y: 0 }])
  })

  it('still wraps when the line is 1px too wide', () => {
    const ctx = run('aaaa bbbb', { width: 89 })
    expect(ctx.calls).toEqual([
      { text: 'aaaa', x: 0, y: 0 },
      { text: 'bbbb', x: 0, y: LINE_HEIGHT },
    ])
  })

  it('width is the box width, independent of xStart (v2)', () => {
    expect(run('aaaa bbbb', { width: 90, xStart: 10 }).calls).toEqual([{ text: 'aaaa bbbb', x: 10, y: 0 }])
    expect(run('aaaa bbbb', { width: 89, xStart: 10 }).calls).toHaveLength(2)
  })

  it('firstLine indent counts: 90px + 20px indent fits exactly at width 110', () => {
    const indent = { type: 'firstLine', by: 2 }
    expect(run('aaaa bbbb', { width: 110, indent }).calls).toEqual([{ text: 'aaaa bbbb', x: 20, y: 0 }])
    expect(run('aaaa bbbb', { width: 109, indent }).calls).toHaveLength(2)
  })

  it('hanging indent counts on following lines: second line 80px + 10px indent fits exactly at width 90', () => {
    const indent = { type: 'hanging', by: 1 }
    expect(run('aaaa bbbb cc dd ee', { width: 90, indent }).calls).toEqual([
      { text: 'aaaa bbbb', x: 0, y: 0 },
      { text: 'cc dd ee', x: 10, y: LINE_HEIGHT },
    ])
    expect(run('aaaa bbbb cc dd ee', { width: 89, indent }).calls.length).toBeGreaterThan(2)
  })
})

describe('canvas state isolation (regression CTP-9)', () => {
  it("restores the caller's textBaseline and textAlign", () => {
    const ctx = createMockContext()
    ctx.textBaseline = 'bottom'
    ctx.textAlign = 'center'
    canvasTextParagraphs('aaaa bbbb', ctx, { baseLine: 'middle', width: 50 })
    expect(ctx.textBaseline).toBe('bottom')
    expect(ctx.textAlign).toBe('center')
    expect(ctx.saveCount).toBe(1)
    expect(ctx.restoreCount).toBe(1)
  })

  it("renders the same when the caller used textAlign = 'center'", () => {
    const base = createMockContext()
    const centered = createMockContext()
    centered.textAlign = 'center'
    canvasTextParagraphs('aaaa bbbb cccc', base, { width: 100, align: 'right' })
    canvasTextParagraphs('aaaa bbbb cccc', centered, { width: 100, align: 'right' })
    expect(centered.calls).toEqual(base.calls)
  })

  it('draws and measures with textAlign = left', () => {
    const ctx = createMockContext()
    ctx.textAlign = 'right'
    canvasTextParagraphs('aaaa bbbb', ctx, { width: 50 })
    expect(ctx.stateAtDraw.every((s) => s.textAlign === 'left')).toBe(true)
    expect(ctx.stateAtMeasure.every((s) => s.textAlign === 'left')).toBe(true)
  })

  it('restores state even when an error is thrown while drawing', () => {
    const ctx = createMockContext()
    ctx.textBaseline = 'bottom'
    ctx.textAlign = 'center'
    ctx.fillText = () => { throw new Error('boom') }
    expect(() => canvasTextParagraphs('a', ctx, { baseLine: 'middle' })).toThrow('boom')
    expect(ctx.textBaseline).toBe('bottom')
    expect(ctx.textAlign).toBe('center')
    expect(ctx.restoreCount).toBe(1)
  })

  it('does not touch ctx state when validation fails', () => {
    const ctx = createMockContext()
    expect(() => canvasTextParagraphs('a', ctx, { align: 'x' })).toThrow('Invalid Align')
    expect(ctx.saveCount).toBe(0)
    expect(ctx.textBaseline).toBe('alphabetic')
  })
})


describe('text box semantics (CTP-10, v2.0.0)', () => {
  // box = [20, 120] x [10, 60]; one line 'aaaa' = 40px wide, LINE_HEIGHT 11
  const box = { xStart: 20, yStart: 10, width: 100, height: 50 }
  const X = { left: 20, center: 50, right: 80, justify: 20 }
  const Y = { top: 10, middle: 10 + (50 - LINE_HEIGHT) / 2, bottom: 10 + 50 - LINE_HEIGHT }

  const aligns = ['left', 'center', 'right', 'justify']
  const vAligns = ['top', 'middle', 'bottom']
  const combos = aligns.flatMap((a) => vAligns.map((v) => [a, v]))

  it.each(combos)('align %s x verticalAlign %s lands inside the box', (align, verticalAlign) => {
    const ctx = run('aaaa', { ...box, align, verticalAlign })
    expect(ctx.calls).toEqual([{ text: 'aaaa', x: X[align], y: Y[verticalAlign] }])
  })

  it('justify: last char of a full line ends at the right edge of the box', () => {
    const ctx = run('aaaa bbbb cccc', { ...box, align: 'justify' })
    expect(ctx.calls).toEqual([
      { text: 'aaaa', x: 20, y: 10 },
      { text: 'bbbb', x: 80, y: 10 },
      { text: 'cccc', x: 20, y: 10 + LINE_HEIGHT },
    ])
    expect(80 + 40).toBe(box.xStart + box.width)
  })

  it('right align with indent stays inside the box', () => {
    const ctx = run('aaaa', { ...box, align: 'right', indent: { type: 'firstLine', by: 2 } })
    expect(ctx.calls).toEqual([{ text: 'aaaa', x: 80, y: 10 }])
  })

  it("'auto' width/height is the rest of the canvas from xStart/yStart", () => {
    // canvas 200x100 -> box width 150 (right align), height 80 (bottom align)
    const ctx = run('aaaa', { xStart: 50, yStart: 20, align: 'right', verticalAlign: 'bottom' })
    expect(ctx.calls).toEqual([{ text: 'aaaa', x: 50 + 150 - 40, y: 20 + 80 - LINE_HEIGHT }])
  })

  it('does not draw lines below yStart + height', () => {
    // lines at y 10, 21, 32; bottom edge 30 (a line is drawn when its top <= edge)
    const ctx = run('a\nb\nc', { xStart: 0, yStart: 10, height: 20 })
    expect(ctx.calls.map((c) => c.text)).toEqual(['a', 'b'])
  })

  it('wraps at the box width regardless of xStart', () => {
    const ctx = run('aaaa bbbb cccc', { ...box, width: 90 })
    expect(ctx.calls).toEqual([
      { text: 'aaaa bbbb', x: 20, y: 10 },
      { text: 'cccc', x: 20, y: 10 + LINE_HEIGHT },
    ])
  })
})
