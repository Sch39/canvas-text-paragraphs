export function wrapText(text, ctx, maxWidth, indentType, indentWidth) {
  const words = text.split(' ')
  let lines = [],
    currentLine = '';

  for (const word of words) {
    let testLine = currentLine + word + ' ',
      // measure without the trailing space so a line that fits exactly is not wrapped
      testWidth = ctx.measureText(testLine.trimEnd()).width;
    if (indentType === 'firstLine' && lines.length === 0) {
      testWidth += indentWidth
    } else if (indentType === 'hanging' && lines.length !== 0) {
      testWidth += indentWidth
    }

    if (testWidth > maxWidth && currentLine.length > 0) {
      lines.push(currentLine.trim());
      currentLine = word + ' '
    } else {
      currentLine = testLine
    }
  }
  //latest line
  lines.push(currentLine.trim())

  return lines;
}

/**
 * Draws one laid-out line inside the text box.
 * Box = [xStart, xStart + width] x [yStart, yStart + height]; line.y is absolute.
 */
export function drawLine(lineObj, ctx, box, heightSpace) {
  const { xStart, yStart, width, height } = box
  const metrics = ctx.measureText(lineObj.text);
  const align = lineObj.align
  let x = xStart,
    yText = lineObj.y,
    xText = lineObj.x
  if (yText + heightSpace <= yStart + height) {
    if (align === 'left') {
      x += xText
    } else if (align === 'center') {
      const widthSpace = (width - metrics.width) / 2
      x += Math.max(xText, widthSpace)
    } else if (align === 'right') {
      const widthSpace = width - metrics.width
      x += Math.max(xText, widthSpace)
    } else if (align === 'justify') {
      const words = lineObj.text.split(' ')
      const spaceWidth = ((width - xText) - metrics.width + ctx.measureText(' ').width * (words.length - 1)) / (words.length - 1)
      let currentX = x + xText

      words.forEach((word, index) => {
        ctx.fillText(word, currentX, yText + heightSpace)
        if (index < words.length - 1) {
          currentX += ctx.measureText(word).width + spaceWidth;
        }
      });
      // out from function
      return;
    }
    // Draw text for left, center, and right alignment
    ctx.fillText(lineObj.text, x, yText + heightSpace);
  }

}
