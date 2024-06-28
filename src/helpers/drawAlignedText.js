export default function drawAlignedText(ctx, text, x, y, width, align) {
  const metrics = ctx.measureText(text);
  // let x = 0;

  if (align === 'center') {
    x += (width - metrics.width) / 2;
  } else if (align === 'right') {
    x += width - metrics.width;
  } else if (align === 'justify') {
    const words = text.trim().split(' ');
    if (words.length === 1) {
      x = 0; // Only one word, so treat as left-aligned
    } else {
      const spaceWidth = (width - metrics.width + ctx.measureText(' ').width * (words.length - 1)) / (words.length - 1);
      let currentX = x;
      for (let i = 0; i < words.length; i++) {
        ctx.fillText(words[i], currentX, y);
        currentX += ctx.measureText(words[i]).width + spaceWidth;
      }
      return; // Justified text has been drawn, so return
    }
  }
  // Draw text for left, center, and right alignment
  ctx.fillText(text, x, y);
}