export function validateNumber(input, errorMessage) {
  if (typeof input !== 'number') {
    throw new Error(errorMessage)
  }
}
export function validateString(input, errorMessage) {
  if (typeof input !== 'string') {
    throw new Error(errorMessage)
  }
}

export function isCanvasContext(ctx) {
  if (!(ctx instanceof CanvasRenderingContext2D)) {
    throw new Error('Invalid ctx')
  }
}

export function checkArrayValue(arr, inputValue, errorMessage) {
  if (!arr.includes(inputValue)) {
    throw new Error(errorMessage)
  }
}