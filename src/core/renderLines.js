import { drawLine } from "../utils/textUtils";

/**
 * Draws a computed layout onto the canvas. This is the only step that calls `fillText`.
 *
 * @param {object} layout - Output of `layoutParagraphs`.
 * @param {CanvasRenderingContext2D} ctx - Context to draw on.
 */
export function renderLines(layout, ctx) {
  for (const paragraph of layout.paragraphs) {
    for (const line of paragraph.lines) {
      drawLine(line, ctx, layout.xStart, layout.height, layout.width, layout.heightSpace)
    }
  }
}
