import { validateNumber, checkArrayValue, isCanvasContext, validateString } from "../utils/validators";

import { wrapText, drawLine } from "../utils/textUtils";

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
 * @param {object} [options.indent={}] - Configuration for text indentation.
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

  const defaultOptions = {
    height: 'auto',
    width: 'auto',
    baseLine: 'top',
    xStart: 0,
    yStart: 0,
    align: 'left',
    verticalAlign: 'top',
    spaceBeforeParagraph: 0,
    spaceAfterParagraph: 0,
    lineSpacing: 'auto',
    indent: {
      type: 'none',
      by: 0
    },
  }
  const mergedOptions = { ...defaultOptions, ...options }
  const validBaseLine = [
    "top",
    "hanging",
    "middle",
    "alphabetic",
    "ideographic",
    "bottom",
  ],
    validAlign = ['left', 'center', 'right', 'justify'],
    validIndentType = ['none', 'firstLine', 'hanging'],
    validVerticalAlign = ['top', 'middle', 'bottom']

  checkArrayValue(validBaseLine, mergedOptions.baseLine, 'Invalid Baseline')
  checkArrayValue(validAlign, mergedOptions.align, 'Invalid Align')
  checkArrayValue(validIndentType, mergedOptions.indent.type, 'Invalid indent.type')
  checkArrayValue(validVerticalAlign, mergedOptions.verticalAlign, 'Invalid verticalAlign')

  validateNumber(mergedOptions.spaceBeforeParagraph, 'Invalid spaceBeforeParagraph')
  validateNumber(mergedOptions.spaceAfterParagraph, 'Invalid spaceAfterParagraph')
  validateNumber(mergedOptions.xStart, 'Invalid xStart')
  validateNumber(mergedOptions.yStart, 'Invalid yStart')

  try {
    validateNumber(mergedOptions.width, 'Invalid width')
  } catch (error) {
    if (mergedOptions.width !== 'auto') {
      throw new Error('Invalid width')
    }
  }

  try {
    validateNumber(mergedOptions.height, 'Invalid height')
  } catch (error) {
    if (mergedOptions.height !== 'auto') {
      throw new Error('Invalid height')
    }
  }
  validateNumber(mergedOptions.indent.by, 'Invalid indent.by')

  try {
    validateNumber(mergedOptions.lineSpacing, 'Invalid lineSpacing')
  } catch (error) {
    if (mergedOptions.lineSpacing !== 'auto') {
      throw new Error('Invalid lineSpacing')
    }
  }

  let width = ctx.canvas.width,
    height = ctx.canvas.height
  if (mergedOptions.width !== 'auto') {
    width = mergedOptions.width
  }
  if (mergedOptions.height !== 'auto') {
    height = mergedOptions.height
  }

  const paragraphs = text.split('\n')

  // ctx processing
  ctx.textBaseline = mergedOptions.baseLine

  const alphSample = "aAgG"
  const sampleMetrics = ctx.measureText(alphSample)
  let lineHeight = (sampleMetrics.actualBoundingBoxAscent + sampleMetrics.actualBoundingBoxDescent) + 1
  if (mergedOptions.lineSpacing !== 'auto') {
    lineHeight *= mergedOptions.lineSpacing
  }

  const dataParagraphs = {
    paragraphs: [],
    xStart: mergedOptions.xStart,
    yStart: mergedOptions.yStart,
    width,
    height,
    vAlign: mergedOptions.verticalAlign,
  }

  let y = dataParagraphs.yStart ?? 0
  let indentWidth = 0;

  switch (mergedOptions.indent.type) {
    case 'hanging':
      indentWidth = ctx.measureText(' '.repeat(mergedOptions.indent.by)).width;
      break;
    case 'firstLine':
      indentWidth = ctx.measureText(' '.repeat(mergedOptions.indent.by)).width;
      break;
    case 'none':
    default:
      indentWidth = 0;
      break;
  }

  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i]
    const paragraphTrimmed = paragraph.trim()
    const data = {
      lines: [],
      yStart: 0,
      yEnd: 0,
    }
    y += mergedOptions.spaceBeforeParagraph
    data.yStart = y
    const lines = wrapText(paragraphTrimmed, ctx, dataParagraphs.xStart, dataParagraphs.width, mergedOptions.indent.type, indentWidth)

    for (let j = 0; j < lines.length; j++) {
      const line = lines[j];
      let lineX = 0
      if (j > 0 && mergedOptions.indent.type === 'hanging') {
        lineX += indentWidth;
      } else if (j === 0 && mergedOptions.indent.type === 'firstLine') {
        lineX += indentWidth
      }
      let align = mergedOptions.align
      if (j === lines.length - 1 && align === 'justify') {
        align = 'left'
      }

      data.lines.push({
        text: line,
        x: lineX,
        y,
        align,
      })
      y += lineHeight
    }

    y += mergedOptions.spaceAfterParagraph
    data.yEnd = y
    dataParagraphs.paragraphs.push(data)
  }
  //latest yEnd of lates paragraph
  let paragraphsHeight = dataParagraphs.paragraphs[dataParagraphs.paragraphs.length - 1].yEnd,
    heightSpace = 0

  if (mergedOptions.verticalAlign === 'middle') {
    heightSpace = (dataParagraphs.height - paragraphsHeight) / 2
  } else if (mergedOptions.verticalAlign === 'bottom') {
    heightSpace = (dataParagraphs.height - paragraphsHeight)
  }

  // Draw
  for (const paragraph of dataParagraphs.paragraphs) {
    for (const line of paragraph.lines) {
      drawLine(line, ctx, dataParagraphs.xStart, dataParagraphs.height, dataParagraphs.width, heightSpace)
    }
  }

}