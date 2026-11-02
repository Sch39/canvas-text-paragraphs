import { wrapText } from "../utils/textUtils";

/**
 * Computes the layout of paragraphs without drawing anything.
 * Only reads from `ctx` (`canvas` size and `measureText`); never calls `fillText`.
 * `ctx.textBaseline` must already be set by the caller, since it affects `measureText`.
 *
 * @param {string} text - Text to lay out (paragraphs separated by `\n`).
 * @param {CanvasRenderingContext2D} ctx - Context used for measuring.
 * @param {object} mergedOptions - Output of `normalizeOptions`.
 * @returns {{paragraphs: Array, xStart: number, yStart: number, width: number (box width), height: number (box height), vAlign: string, heightSpace: number}}
 */
export function layoutParagraphs(text, ctx, mergedOptions) {
  // Text box = [xStart, xStart + width] x [yStart, yStart + height].
  // 'auto' means the rest of the canvas from xStart / yStart.
  const width = mergedOptions.width === 'auto' ? ctx.canvas.width - mergedOptions.xStart : mergedOptions.width,
    height = mergedOptions.height === 'auto' ? ctx.canvas.height - mergedOptions.yStart : mergedOptions.height

  const paragraphs = text.split('\n')

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
    heightSpace: 0,
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
    const lines = wrapText(paragraphTrimmed, ctx, dataParagraphs.width, mergedOptions.indent.type, indentWidth)

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
  // content height = latest yEnd of latest paragraph, relative to the box top
  let paragraphsHeight = dataParagraphs.paragraphs[dataParagraphs.paragraphs.length - 1].yEnd - dataParagraphs.yStart,
    heightSpace = 0

  if (mergedOptions.verticalAlign === 'middle') {
    heightSpace = (dataParagraphs.height - paragraphsHeight) / 2
  } else if (mergedOptions.verticalAlign === 'bottom') {
    heightSpace = (dataParagraphs.height - paragraphsHeight)
  }
  dataParagraphs.heightSpace = heightSpace

  return dataParagraphs
}
