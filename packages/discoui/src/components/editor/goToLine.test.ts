import { Text } from '@codemirror/state'
import { expect } from 'earl'
import { parsePosition } from './goToLine'

describe('parsePosition', () => {
  const doc = Text.of(['first', 'second', 'third'])

  it('points at the start of a line', () => {
    expect(parsePosition(doc, '1')).toEqual(0)
    expect(parsePosition(doc, ' 2 ')).toEqual(6)
  })

  it('takes a one-based column', () => {
    expect(parsePosition(doc, '2:1')).toEqual(6)
    expect(parsePosition(doc, '2:4')).toEqual(9)
    expect(parsePosition(doc, '2,4')).toEqual(9)
  })

  it('clamps to the last line and the line end', () => {
    expect(parsePosition(doc, '99')).toEqual(13)
    expect(parsePosition(doc, '1:99')).toEqual(5)
  })

  it('rejects anything else', () => {
    for (const value of [
      '',
      '0',
      '1:0',
      '-1',
      '+1',
      '1.5',
      'a',
      '1:',
      '1:2:3',
    ]) {
      expect(parsePosition(doc, value)).toEqual(undefined)
    }
  })
})
