import { expect } from 'earl'
import { validateBlip } from './validateBlip'

describe(validateBlip.name, () => {
  it('validates and blips', () => {
    expect(validateBlip(['and'])).toBeFalsy()
    expect(validateBlip(['and', 123])).toBeTruthy()
    expect(validateBlip(['and', 123, false])).toBeTruthy()
    expect(validateBlip(['and', 123, false, 'alskdjf'])).toBeTruthy()
    expect(validateBlip(['and', 123, false, {}])).toBeFalsy()
    expect(validateBlip(['and', 123, false, 123n])).toBeFalsy()
  })

  it('validates = blips', () => {
    expect(validateBlip(['='])).toBeFalsy()
    expect(validateBlip(['=', 123])).toBeTruthy()
    expect(validateBlip(['=', 123, false])).toBeTruthy()
    expect(validateBlip(['=', 123, false, 'alskdjf'])).toBeTruthy()
    expect(validateBlip(['=', 123, false, {}])).toBeFalsy()
    expect(validateBlip(['=', 123, false, 123n])).toBeFalsy()
  })

  it('validates != blips', () => {
    expect(validateBlip(['!='])).toBeFalsy()
    expect(validateBlip(['!=', 123])).toBeTruthy()
    expect(validateBlip(['!=', 123, false])).toBeTruthy()
    expect(validateBlip(['!=', 123, false, 'alskdjf'])).toBeTruthy()
    expect(validateBlip(['!=', 123, false, {}])).toBeFalsy()
    expect(validateBlip(['!=', 123, false, 123n])).toBeFalsy()
  })

  it('validates not blips', () => {
    expect(validateBlip(['not'])).toBeFalsy()
    expect(validateBlip(['not', 123])).toBeTruthy()
    expect(validateBlip(['not', 123, false])).toBeFalsy()
    expect(validateBlip(['not', 123n])).toBeFalsy()
    expect(validateBlip(['not', undefined])).toBeFalsy()
  })

  it('validates invalid blips', () => {
    expect(validateBlip(12345n)).toBeFalsy()
    expect(validateBlip({})).toBeFalsy()
    expect(validateBlip(undefined)).toBeFalsy()
    expect(validateBlip(null)).toBeFalsy()
  })

  it('validates valid blips', () => {
    expect(validateBlip('string')).toBeTruthy()
    expect(validateBlip(123)).toBeTruthy()
    expect(validateBlip(false)).toBeTruthy()
    expect(validateBlip(true)).toBeTruthy()
  })
})
