import { expect } from 'earl'
import { BulletListBuilder } from './BulletListBuilder'

describe('BulletListBuilder', () => {
  let builder: BulletListBuilder

  beforeEach(() => {
    builder = new BulletListBuilder()
  })

  it('should build simple flat list', () => {
    builder.addItem('item 1').addItem('item 2')
    const expected = `
* item 1
* item 2`.trim()
    expect(builder.renderMd()).toEqual(expected)
  })

  it('should handle nesting with indent/dedent', () => {
    builder
      .addItem('item 1')
      .indent()
      .addItem('item 1.1')
      .addItem('item 1.2')
      .dedent()
      .addItem('item 2')

    const expected = `
* item 1
  * item 1.1
  * item 1.2
* item 2`.trim()
    expect(builder.renderMd()).toEqual(expected)
  })

  it('should reset indentation to a previous level', () => {
    builder
      .addItem('item 1')
      .indent()
      .addItem('item 1.1')
      .indent()
      .addItem('item 1.1.1')
      .resetIndent(0)
      .addItem('item 2')

    const expected = `
* item 1
  * item 1.1
    * item 1.1.1
* item 2`.trim()
    expect(builder.renderMd()).toEqual(expected)
  })

  it('should merge single subpoints correctly', () => {
    builder
      .addItem('item 1')
      .indent()
      .addItem('item 1.1')
      .indent()
      .addItem('item 1.1.1')
      .addItem('item 1.1.2')
      .addItem('item 1.1.3')
      .indent()
      .addItem('item 1.1.3.1')
      .dedent()
      .addItem('item 1.1.4')
      .indent()
      .resetIndent(0)
      .addItem('item 2')

    const expectedMerged = `
* item 1 item 1.1
  * item 1.1.1
  * item 1.1.2
  * item 1.1.3 item 1.1.3.1
  * item 1.1.4
* item 2`.trim()
    expect(builder.renderMd({ mergeSingleSubpoints: true })).toEqual(
      expectedMerged,
    )

    const expectedNotMerged = `
* item 1
  * item 1.1
    * item 1.1.1
    * item 1.1.2
    * item 1.1.3
      * item 1.1.3.1
    * item 1.1.4
* item 2`.trim()
    expect(builder.renderMd()).toEqual(expectedNotMerged)
  })

  it('should merge single subpoints recursively', () => {
    builder
      .addItem('item 1')
      .indent()
      .addItem('item 1.1')
      .indent()
      .addItem('item 1.1.1')
      .indent()
      .addItem('item 1.1.1.1')
      .resetIndent(0)
      .addItem('item 2')
      .indent()
      .addItem('item 2.1')

    const expectedMerged = `
* item 1 item 1.1 item 1.1.1 item 1.1.1.1
* item 2 item 2.1`.trim()
    expect(builder.renderMd({ mergeSingleSubpoints: true })).toEqual(
      expectedMerged,
    )

    const expectedNotMerged = `
* item 1
  * item 1.1
    * item 1.1.1
      * item 1.1.1.1
* item 2
  * item 2.1`.trim()
    expect(builder.renderMd()).toEqual(expectedNotMerged)
  })

  it('should use mergedText when merging single subpoints', () => {
    builder
      .addItem('item 1')
      .indent()
      .addItem('item 1.1')
      .indent()
      .addItem('item 1.1.1')
      .addItem('item 1.1.2')
      .addItem('item 1.1.3', '(item 1.1.3)')
      .indent()
      .addItem('item 1.1.3.1', '(item 1.1.3.1)')
      .dedent()
      .addItem('item 1.1.4')
      .indent()
      .resetIndent(0)
      .addItem('item 2')

    const expectedMerged = `
* item 1 item 1.1
  * item 1.1.1
  * item 1.1.2
  * item 1.1.3 (item 1.1.3.1)
  * item 1.1.4
* item 2`.trim()
    expect(builder.renderMd({ mergeSingleSubpoints: true })).toEqual(
      expectedMerged,
    )
  })

  it('should throw error on invalid indentation operations', () => {
    expect(() => builder.indent()).toThrow()
    expect(() => builder.dedent()).toThrow()
    expect(() => builder.resetIndent(5)).toThrow()
  })
})
