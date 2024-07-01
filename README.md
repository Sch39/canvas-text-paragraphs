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

## Function Parameter
* **text** (string): The text content to be rendered.
* **ctx** (CanvasRenderingContext2D): The canvas rendering context.
* **options** (object): Optional configuration object with the following properties:
  * **width** (number, default: 'auto'): Width of the paragraph area.
  * **height** (number, default: 'auto'): Height of the  paragraph area.
  * **xStart** (number, default: 0): starting position of the paragraph on the x axis
  * **yStart** (number, default: 0): starting position of the paragraph on the y axis
  * **align** (string, default: 'left'): Horizontal text alignment ('left', 'center', 'right', 'justify').
  * **verticalAlign** (string, default: 'top'): Vertical text alignment ('top', 'middle', 'bottom').
  * **baseLine** (string, default: 'top'): Text baseline alignment ('top', 'hanging', 'middle', 'alphabetic', 'ideographic', 'bottom').
  * **spaceBeforeParagraph** (number, default: 0): Space before each paragraph.
  * **spaceAfterParagraph** (number, default: 0): Space after each paragraph.
  * **lineSpacing** (number or string, default: 'auto'): Line spacing factor or 'auto' for automatic spacing.
  * **indent** (object):
    * **type** (string, default: 'none'): Type of indentation ('none', 'firstLine', 'hanging').
    * **by** (number, default: 0): Indentation amount in pixels.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.