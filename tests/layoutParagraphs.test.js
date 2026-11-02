import { describe, it, expect } from 'vitest'
import { normalizeOptions } from '../src/core/normalizeOptions'
import { layoutParagraphs } from '../src/core/layoutParagraphs'
import { renderLines } from '../src/core/renderLines'
import { createMockContext, LINE_HEIGHT } from './helpers/mockCanvas'

describe('layoutParagraphs', () => {
  it('computes layout without calling fillText', () => {
    const ctx = createMockContext()
    ctx.fillText = () => { throw new Error('fillText must not be called') }
    const layout = layoutParagraphs('aaaa bbbb cccc', ctx, normalizeOptions({ width: 100 }))

    expect(layout.paragraphs).toHaveLength(1)
    expect(layout.paragraphs[0].lines).toEqual([
      { text: 'aaaa bbbb', x: 0, y: 0, align: 'left' },
      { text: 'cccc', x: 0, y: LINE_HEIGHT, align: 'left' },
    ])
    expect(layout.heightSpace).toBe(0)
  })

  it('computes heightSpace for vertical align', () => {
    const ctx = createMockContext()
    const layout = layoutParagraphs('a', ctx, normalizeOptions({ verticalAlign: 'bottom' }))
    expect(layout.heightSpace).toBe(100 - LINE_HEIGHT)
  })
})

describe('renderLines', () => {
  it('draws a layout via fillText', () => {
    const ctx = createMockContext()
    const layout = layoutParagraphs('a\nb', ctx, normalizeOptions())
    renderLines(layout, ctx)
    expect(ctx.calls).toEqual([
      { text: 'a', x: 0, y: 0 },
      { text: 'b', x: 0, y: LINE_HEIGHT },
    ])
  })
})

describe('normalizeOptions', () => {
  it('returns defaults when called without options', () => {
    expect(normalizeOptions()).toMatchObject({ align: 'left', width: 'auto', indent: { type: 'none', by: 0 } })
  })

  it('deep-merges indent with defaults', () => {
    expect(normalizeOptions({ indent: { type: 'firstLine' } }).indent).toEqual({ type: 'firstLine', by: 0 })
    expect(normalizeOptions({ indent: { by: 20 } }).indent).toEqual({ type: 'none', by: 20 })
  })

  it('still rejects a non-number indent.by', () => {
    expect(() => normalizeOptions({ indent: { type: 'firstLine', by: '2' } })).toThrow('Invalid indent.by')
    expect(() => normalizeOptions({ indent: { by: null } })).toThrow('Invalid indent.by')
  })

  it('does not mutate the default indent between calls', () => {
    normalizeOptions({ indent: { type: 'hanging', by: 5 } })
    expect(normalizeOptions().indent).toEqual({ type: 'none', by: 0 })
  })

  it('throws on invalid options', () => {
    expect(() => normalizeOptions({ align: 'x' })).toThrow('Invalid Align')
  })
})
