/// <reference lib="dom" />

/**
 * Draws paragraphs of text on a canvas with various formatting options.
 *
 * Throws `Error('Invalid <option>')` when `text`, `ctx` or an option is invalid.
 *
 * @param text - The text to draw. Paragraphs are separated by `\n`.
 * @param ctx - The canvas 2D rendering context. Must be a `CanvasRenderingContext2D`.
 * @param options - Optional formatting options.
 *
 * @example
 * const ctx = canvas.getContext('2d')!;
 * canvasTextParagraphs('Hello world', ctx, { align: 'justify', width: 400 });
 */
declare function canvasTextParagraphs(
  text: string,
  ctx: CanvasRenderingContext2D,
  options?: canvasTextParagraphs.Options
): void;

declare namespace canvasTextParagraphs {
  /** Horizontal alignment of the text inside the text box. */
  type Align = 'left' | 'center' | 'right' | 'justify';

  /** Vertical alignment of the text block inside the text box. */
  type VerticalAlign = 'top' | 'middle' | 'bottom';

  /** Canvas `textBaseline` used while drawing. */
  type BaseLine = 'top' | 'hanging' | 'middle' | 'alphabetic' | 'ideographic' | 'bottom';

  /** `'none'`: no indent, `'firstLine'`: indent the first line, `'hanging'`: indent every line except the first. */
  type IndentType = 'none' | 'firstLine' | 'hanging';

  interface IndentOptions {
    /** @default 'none' */
    type?: IndentType;
    /** Number of spaces to indent by (measured as that many space characters in the current font). @default 0 */
    by?: number;
  }

  interface Options {
    /**
     * Width of the text box. `'auto'` = the rest of the canvas from `xStart`.
     * @default 'auto'
     */
    width?: number | 'auto';
    /**
     * Height of the text box. `'auto'` = the rest of the canvas from `yStart`.
     * Lines that fall below `yStart + height` are not drawn.
     * @default 'auto'
     */
    height?: number | 'auto';
    /** Left edge of the text box. @default 0 */
    xStart?: number;
    /** Top edge of the text box. @default 0 */
    yStart?: number;
    /** @default 'left' */
    align?: Align;
    /** @default 'top' */
    verticalAlign?: VerticalAlign;
    /** @default 'top' */
    baseLine?: BaseLine;
    /** Space before each paragraph, in pixels. @default 0 */
    spaceBeforeParagraph?: number;
    /** Space after each paragraph, in pixels. @default 0 */
    spaceAfterParagraph?: number;
    /** Line spacing factor, or `'auto'` for automatic spacing. @default 'auto' */
    lineSpacing?: number | 'auto';
    /** Merged with the defaults, so a partial object keeps the other defaults. */
    indent?: IndentOptions;
  }
}

/** Global exposed by the UMD build when loaded through a `<script>` tag. */
export as namespace canvasTextParagraphs;

export = canvasTextParagraphs;
