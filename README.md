# Canvas Text Paragraphs
Canvas Text Paragraphs is a JavaScript library designed to facilitate the rendering of formatted paragraphs on an HTML5 canvas element. It provides functionality to manage text alignment, indentation, line spacing, and vertical positioning within the canvas.

## Installation
You can install Canvas Text Paragraphs via npm:
```
npm install @sch39/canvas-text-paragraphs
```
or from unpkg
```
<script src="https://unpkg.com/@sch39/canvas-text-paragraphs@latest/dist/index.umd.js"></script>
```
The script exposes the global function `canvasTextParagraphs`.

## Usage
### Importing the Library
```
import canvasTextParagraphs from '@sch39/canvas-text-paragraphs'
```
### Example
```
import canvasTextParagraphs from '@sch39/canvas-text-paragraphs';

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const text = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Nulla facilisi. Integer id elit varius, commodo tortor eget,
lacinia ligula. Ut interdum nisi non dui pretium faucibus.
`;

canvasTextParagraphs(text, ctx, {
  align: 'center',
  verticalAlign: 'middle',
  spaceBeforeParagraph: 20,
  spaceAfterParagraph: 20,
  indent: {
    type: 'firstLine',
    by: 40,
  },
});


```

### TypeScript
Type definitions are bundled (`index.d.ts`), no `@types` package needed:
```ts
import canvasTextParagraphs from '@sch39/canvas-text-paragraphs'
import type { Options } from '@sch39/canvas-text-paragraphs'

const ctx = (document.getElementById('myCanvas') as HTMLCanvasElement).getContext('2d')!

const options: Options = {
  width: 400,
  align: 'justify',
  indent: { type: 'firstLine', by: 4 },
}

canvasTextParagraphs('Hello world', ctx, options)
```

## Demo
Link: [Click here](https://codepen.io/editor/sch39/pen/01a19811-e040-763d-8fdb-abfe9b42480c)

Live Demo: [Click here](https://codepen.io/sch39/pen/abrgPEM)

## Function Parameter
* **text** (string): The text content to be rendered.
* **ctx** (CanvasRenderingContext2D): The canvas rendering context.
* **options** (object): Optional configuration object with the following properties:
  * **width** (number or 'auto', default: 'auto'): Width of the text box. `'auto'` = the rest of the canvas from `xStart`.
  * **height** (number or 'auto', default: 'auto'): Height of the text box. `'auto'` = the rest of the canvas from `yStart`. Lines that fall below `yStart + height` are not drawn.
  * **xStart** (number, default: 0): Left edge of the text box.
  * **yStart** (number, default: 0): Top edge of the text box.
  * **align** (string, default: 'left'): Horizontal text alignment ('left', 'center', 'right', 'justify').
  * **verticalAlign** (string, default: 'top'): Vertical text alignment ('top', 'middle', 'bottom').
  * **baseLine** (string, default: 'top'): Text baseline alignment ('top', 'hanging', 'middle', 'alphabetic', 'ideographic', 'bottom').
  * **spaceBeforeParagraph** (number, default: 0): Space before each paragraph.
  * **spaceAfterParagraph** (number, default: 0): Space after each paragraph.
  * **lineSpacing** (number or 'auto', default: 'auto'): Line spacing factor (multiplies the line height), or `'auto'` for automatic spacing.
  * **indent** (object): Merged with the defaults, so you can pass only the keys you need (e.g. `{ type: 'firstLine' }` uses `by: 0`, `{ by: 4 }` uses `type: 'none'`).
    * **type** (string, default: 'none'): Type of indentation ('none', 'firstLine', 'hanging').
    * **by** (number, default: 0): Indentation amount, as a number of space characters in the current font.

The text box is `[xStart, xStart + width] x [yStart, yStart + height]`. Word wrap, `align`, `indent` and `verticalAlign` are all computed inside this box.

### Behavior notes
* Paragraphs are separated by `\n`. Each paragraph is trimmed and wrapped word by word; a word wider than `width` is not split and overflows the box.
* The last line of a paragraph is never justified (it is drawn left-aligned).
* The canvas state is isolated: `textBaseline` and `textAlign` are set while drawing and restored afterwards, so your own values are left unchanged. Set `ctx.font` and `ctx.fillStyle` before calling.

### Errors
Invalid input throws an `Error` with the message `Invalid <name>`, for example `Invalid text`, `Invalid ctx`, `Invalid Align`, `Invalid width` or `Invalid indent.by`. `ctx` must be a `CanvasRenderingContext2D`.

## Development
```
npm install
npm test        # vitest
npm run build   # dist/ (cjs, es, umd)
npm run dev     # vite dev server
```

## Migrating from 1.x

In 2.0.0, `width` and `height` are the **size** of the text box. In 1.x they were the absolute right/bottom edge (`xStart + size`).

* If `xStart` and `yStart` are `0` (or omitted), nothing changes.
* If you set `xStart`/`yStart` together with `width`/`height`, subtract the start from the old value:

```js
// 1.x: right edge at x = 300, bottom edge at y = 200
canvasTextParagraphs(text, ctx, { xStart: 50, yStart: 20, width: 300, height: 200 })

// 2.0.0: same box
canvasTextParagraphs(text, ctx, { xStart: 50, yStart: 20, width: 250, height: 180 })
```

* `'auto'` still fills the canvas, now measured from `xStart`/`yStart`.
* `verticalAlign: 'middle' | 'bottom'` now centers/bottoms inside the box, not relative to the canvas origin.

Other behavior changes since 1.1.0:

* A line that fits the box width exactly is no longer wrapped early (the trailing space is no longer measured), so line breaks can differ slightly from 1.x.
* `indent` is merged with its defaults; `{ type: 'firstLine' }` without `by` no longer throws.
* `textBaseline` and `textAlign` of your context are restored after each call.
* The UMD build exposes only the global `canvasTextParagraphs`, and the ES build can now be imported where `self` is undefined (Node, SSR).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
