import { isCanvasContext, validateString } from "../utils/validators";

import { normalizeOptions } from "./normalizeOptions";
import { layoutParagraphs } from "./layoutParagraphs";
import { renderLines } from "./renderLines";

/**
 * Draws paragraphs of text on a canvas with various formatting options.
 * 
 * @param {string} text - The text to be drawn on the canvas. Must be a valid string.
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context. Must be an instance of CanvasRenderingContext2D.
 * @param {object} [options={}] - Optional configuration object for formatting the text.
 * @param {number|string} [options.height='auto'] - The height of the text area. Can be a number or 'auto'.
 * @param {number|string} [options.width='auto'] - The width of the text area. Can be a number or 'auto'.
 * @param {string} [options.baseLine='top'] - The baseline alignment of the text. Valid values are 'top', 'hanging', 'middle', 'alphabetic', 'ideographic', 'bottom'.
 * @param {number} [options.xStart=0] - The x-coordinate where the text starts.
 * @param {number} [options.yStart=0] - The y-coordinate where the text starts.
 * @param {string} [options.align='left'] - The horizontal alignment of the text. Valid values are 'left', 'center', 'right', 'justify'.
 * @param {string} [options.verticalAlign='top'] - The vertical alignment of the text. Valid values are 'top', 'middle', 'bottom'.
 * @param {number} [options.spaceBeforeParagraph=0] - The space before each paragraph in pixels.
 * @param {number} [options.spaceAfterParagraph=0] - The space after each paragraph in pixels.
 * @param {number|string} [options.lineSpacing='auto'] - The spacing between lines of text. Can be a number or 'auto'.
 * @param {object} [options.indent={}] - Configuration for text indentation. Merged with the defaults, so a partial object (e.g. only `type`) keeps the other defaults.
 * @param {string} [options.indent.type='none'] - The type of indentation. Valid values are 'none', 'firstLine', 'hanging'.
 * @param {number} [options.indent.by=0] - The number of spaces to indent.
 * 
 * @example
 * const canvas = document.getElementById('myCanvas');
 * const ctx = canvas.getContext('2d');
 * const text = "This is a sample text to draw on the canvas.";
 * const options = {
 *   width: 400,
 *   height: 300,
 *   baseLine: 'alphabetic',
 *   xStart: 20,
 *   yStart: 20,
 *   align: 'justify',
 *   verticalAlign: 'middle',
 *   spaceBeforeParagraph: 15,
 *   spaceAfterParagraph: 15,
 *   lineSpacing: 1.5,
 *   indent: {
 *     type: 'firstLine',
 *     by: 4
 *   }
 * };
 * canvasTextParagraphs(text, ctx, options);
 */

export default function canvasTextParagraphs(text, ctx, options = {}) {
  validateString(text, 'Invalid text')
  isCanvasContext(ctx)

  const mergedOptions = normalizeOptions(options)

  // ctx processing
  ctx.textBaseline = mergedOptions.baseLine

  const layout = layoutParagraphs(text, ctx, mergedOptions)
  renderLines(layout, ctx)
}