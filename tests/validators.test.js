import { describe, it, expect } from 'vitest'
import { validateNumberOrAuto } from '../src/utils/validators'
import { normalizeOptions } from '../src/core/normalizeOptions'

describe('validateNumberOrAuto', () => {
  it.each([0, 10, -1, 1.5, 'auto'])('accepts %j', (v) => {
    expect(() => validateNumberOrAuto(v, 'Invalid x')).not.toThrow()
  })

  it.each(['abc', '10', null, undefined, {}, []])('rejects %j', (v) => {
    expect(() => validateNumberOrAuto(v, 'Invalid x')).toThrow('Invalid x')
  })
})

describe('normalizeOptions error precedence', () => {
  it('reports the first failing rule when several options are invalid', () => {
    expect(() => normalizeOptions({ lineSpacing: 'x', width: 'x', baseLine: 'x' })).toThrow('Invalid Baseline')
    expect(() => normalizeOptions({ lineSpacing: 'x', width: 'x' })).toThrow('Invalid width')
  })
})
