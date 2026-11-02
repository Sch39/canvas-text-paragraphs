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
  * **lineSpacing** (number or string, default: 'auto'): Line spacing factor or 'auto' for automatic spacing.
  * **indent** (object):
    * **type** (string, default: 'none'): Type of indentation ('none', 'firstLine', 'hanging').
    * **by** (number, default: 0): Indentation amount in pixels.

The text box is `[xStart, xStart + width] x [yStart, yStart + height]`. Word wrap, `align`, `indent` and `verticalAlign` are all computed inside this box.

## Migrasi dari 1.x

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

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
