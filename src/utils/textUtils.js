export function wrapText(text, ctx, xStart, maxWidth, indentType, indentWidth) {
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
    testWidth += xStart

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

export function drawLine(lineObj, ctx, xStart, maxHeight, maxWidth, heightSpace) {
  const metrics = ctx.measureText(lineObj.text);
  const align = lineObj.align
  let x = xStart,
    yText = lineObj.y,
    xText = lineObj.x
  if (yText + heightSpace <= maxHeight) {
    if (align === 'left') {
      x += xText
    } else if (align === 'center') {
      const widthSpace = (maxWidth - x - metrics.width) / 2
      if (xText > widthSpace) {
        x += xText;
      } else {
        x += widthSpace
      }
    } else if (align === 'right') {
      const widthSpace = maxWidth - metrics.width
      if (widthSpace > x + xText) {
        x = widthSpace;
      } else {
        x += xText
      }
    } else if (align === 'justify') {
      const words = lineObj.text.split(' ')
      const spaceWidth = ((maxWidth - x - xText) - metrics.width + ctx.measureText(' ').width * (words.length - 1)) / (words.length - 1)
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