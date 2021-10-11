export const getFontSizeToFit = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  fontFace: string,
  fontSize: number
): number => {
  ctx.font = `${fontSize}px ${fontFace}`;
  const textWidth = ctx.measureText(text).width;

  if (fontSize <= 10) {
    return fontSize;
  }
  if (textWidth > maxWidth) {
    return getFontSizeToFit(ctx, text, maxWidth, fontFace, fontSize - 1);
  }

  return fontSize;
};
