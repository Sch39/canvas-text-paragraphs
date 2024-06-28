import drawAlignedText from "../helpers/drawAlignedText";

function validateNumber(input, errorMessage) {
  if (typeof input !== 'number') {
    throw new Error(errorMessage)
  }
}
function validateString(input, errorMessage) {
  if (typeof input !== 'string') {
    throw new Error(errorMessage)
  }
}

function isCanvasContext(ctx) {
  if (!(ctx instanceof CanvasRenderingContext2D)) {
    throw new Error('Invalid ctx')
  }
}

function checkArrayValue(arr, inputValue, errorMessage) {
  if (!arr.includes(inputValue)) {
    throw new Error(errorMessage)
  }
}

function wrapText(text, ctx, maxWidth, indentType, indentWidth) {
  const words = text.split(' ')
  let lines = [],
    currentLine = '';

  for (const word of words) {
    let testLine = currentLine + word + ' ',
      testWidth = ctx.measureText(testLine).width;
    if (indentType === 'firstLine' && lines.length === 0) {
      testWidth += indentWidth
    } else if (indentType === 'hanging' && lines.length !== 0) {
      testWidth += indentWidth
    }

    if (testWidth > maxWidth && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = word + ' '
    } else {
      currentLine = testLine
    }
    //latest line
  }
  lines.push(currentLine)

  return lines;
}

function drawParagraphs(dataParagraphs, ctx) {
  for (const paragraph of dataParagraphs.paragraphs) {
    let x = dataParagraphs.xStart
    for (const line of paragraph.lines) {
      drawAlignedText(ctx, line.text, x + line.x, line.y, dataParagraphs.width - x, line.align)
    }
  }
  console.log(dataParagraphs);
}

export default function canvasTextParagraphs(text, ctx, width, options = {}) {
  validateString(text, 'Invalid text')
  isCanvasContext(ctx)
  validateNumber(width, 'Invalid width')

  const defaultOptions = {
    height: 'auto',
    baseLine: 'top',
    xStart: 0,
    yStart: 0,
    align: 'left',
    verticalAlign: 'top',
    spaceBeforeParagraph: 10,
    spaceAfterParagraph: 10,
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
    validateNumber(mergedOptions.height, 'Invalid height')
  } catch (error) {
    if (mergedOptions.height !== 'auto') {
      throw new Error('Invalid height')
    }
  }
  // try {
  validateNumber(mergedOptions.indent.by, 'Invalid indent.by')
  // } catch (error) {
  //   if (mergedOptions.indent.by !== null) {
  //     throw new Error('Invalid indent.by')
  //   }
  // }
  try {
    validateNumber(mergedOptions.lineSpacing, 'Invalid lineSpacing')
  } catch (error) {
    if (mergedOptions.lineSpacing !== 'auto') {
      throw new Error('Invalid lineSpacing')
    }
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
  // if user input xStart
  width -= mergedOptions.xStart

  const dataParagraphs = {
    paragraphs: [],
    xStart: mergedOptions.xStart,
    yStart: mergedOptions.yStart,
    width,
    height: mergedOptions.height,
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
    // const words = paragraphTrimmed.split(' ')
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

  drawParagraphs(dataParagraphs, ctx)
}