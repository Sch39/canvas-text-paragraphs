import { validateNumber, validateNumberOrAuto, checkArrayValue } from "../utils/validators";

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

const oneOf = (allowed, value, message) => checkArrayValue(allowed, value, message)
const number = (_, value, message) => validateNumber(value, message)
const numberOrAuto = (_, value, message) => validateNumberOrAuto(value, message)

// [check, getValue, errorMessage, allowedValues]
const rules = [
  [oneOf, (o) => o.baseLine, 'Invalid Baseline', validBaseLine],
  [oneOf, (o) => o.align, 'Invalid Align', validAlign],
  [oneOf, (o) => o.indent.type, 'Invalid indent.type', validIndentType],
  [oneOf, (o) => o.verticalAlign, 'Invalid verticalAlign', validVerticalAlign],
  [number, (o) => o.spaceBeforeParagraph, 'Invalid spaceBeforeParagraph'],
  [number, (o) => o.spaceAfterParagraph, 'Invalid spaceAfterParagraph'],
  [number, (o) => o.xStart, 'Invalid xStart'],
  [number, (o) => o.yStart, 'Invalid yStart'],
  [numberOrAuto, (o) => o.width, 'Invalid width'],
  [numberOrAuto, (o) => o.height, 'Invalid height'],
  [number, (o) => o.indent.by, 'Invalid indent.by'],
  [numberOrAuto, (o) => o.lineSpacing, 'Invalid lineSpacing'],
]

/**
 * Merges user options with defaults (shallow merge) and validates them.
 * Throws `Error('Invalid <option>')` on invalid values.
 *
 * @param {object} [options={}] - User supplied options.
 * @returns {object} The merged and validated options.
 */
export function normalizeOptions(options = {}) {
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    // indent is merged deeply so a partial object keeps the remaining defaults
    indent: { ...defaultOptions.indent, ...options.indent },
  }

  // Order matters: when several options are invalid, the first rule that fails is reported.
  for (const [check, getValue, message, allowed] of rules) {
    check(allowed, getValue(mergedOptions), message)
  }

  return mergedOptions
}
