export const CHAR_WIDTH = 10
export const ASCENT = 8
export const DESCENT = 2
// lineHeight computed by the library for lineSpacing 'auto': ascent + descent + 1
export const LINE_HEIGHT = ASCENT + DESCENT + 1

/**
 * Deterministic CanvasRenderingContext2D mock.
 * - measureText width = text.length * CHAR_WIDTH
 * - actualBoundingBoxAscent/Descent are constants
 * - fillText records every call in `calls`
 */
export function createMockContext({ width = 200, height = 100 } = {}) {
  const ctx = new CanvasRenderingContext2D()
  ctx.canvas = { width, height }
  ctx.textBaseline = 'alphabetic'
  ctx.calls = []
  ctx.measureText = (text) => ({
    width: text.length * CHAR_WIDTH,
    actualBoundingBoxAscent: ASCENT,
    actualBoundingBoxDescent: DESCENT,
  })
  ctx.fillText = (text, x, y) => {
    ctx.calls.push({ text, x, y })
  }
  return ctx
}
