import { validateNumber, checkArrayValue } from "../utils/validators";

const defaultOptions = {
  height: 'auto',
  width: 'auto',
  baseLine: 'top',
  xStart: 0,
  yStart: 0,
  align: 'left',
  verticalAlign: 'top',
  spaceBeforeParagraph: 0,
  spaceAfterParagraph: 0,
  lineSpacing: 'auto',
  indent: {
    type: 'none',
    by: 0
  },
}

const validBaseLine = [
  "top",
  "hanging",
  "middle",
  "alphabetic",
  "ideographic",
  "bottom",
],
  validAlign = ['left', 'center', 'right', 'justify'],
  validIndentType = ['none', 'firstLine', 'hanging'],
  validVerticalAlign = ['top', 'middle', 'bottom']

/**
 * Merges user options with defaults (shallow merge) and validates them.
 * Throws `Error('Invalid <option>')` on invalid values.
 *
 * @param {object} [options={}] - User supplied options.
 * @returns {object} The merged and validated options.
 */
export function normalizeOptions(options = {}) {
  const mergedOptions = { ...defaultOptions, ...options }

  checkArrayValue(validBaseLine, mergedOptions.baseLine, 'Invalid Baseline')
  checkArrayValue(validAlign, mergedOptions.align, 'Invalid Align')
  checkArrayValue(validIndentType, mergedOptions.indent.type, 'Invalid indent.type')
  checkArrayValue(validVerticalAlign, mergedOptions.verticalAlign, 'Invalid verticalAlign')

  validateNumber(mergedOptions.spaceBeforeParagraph, 'Invalid spaceBeforeParagraph')
  validateNumber(mergedOptions.spaceAfterParagraph, 'Invalid spaceAfterParagraph')
  validateNumber(mergedOptions.xStart, 'Invalid xStart')
  validateNumber(mergedOptions.yStart, 'Invalid yStart')

  try {
    validateNumber(mergedOptions.width, 'Invalid width')
  } catch (error) {
    if (mergedOptions.width !== 'auto') {
      throw new Error('Invalid width')
    }
  }

  try {
    validateNumber(mergedOptions.height, 'Invalid height')
  } catch (error) {
    if (mergedOptions.height !== 'auto') {
      throw new Error('Invalid height')
    }
  }
  validateNumber(mergedOptions.indent.by, 'Invalid indent.by')

  try {
    validateNumber(mergedOptions.lineSpacing, 'Invalid lineSpacing')
  } catch (error) {
    if (mergedOptions.lineSpacing !== 'auto') {
      throw new Error('Invalid lineSpacing')
    }
  }

  return mergedOptions
}
