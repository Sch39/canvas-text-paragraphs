// Node has no CanvasRenderingContext2D. Define a stand-in so the library's
// `instanceof CanvasRenderingContext2D` check (isCanvasContext) passes for the
// mock context, without changing the validator.
if (typeof globalThis.CanvasRenderingContext2D === 'undefined') {
  globalThis.CanvasRenderingContext2D = class CanvasRenderingContext2D {}
}
