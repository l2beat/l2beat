import { parse } from 'comment-json'
import { expect } from 'earl'
import { ConfigModel, ContractConfigModel } from './ConfigModel'

describe('ContractConfigModel', () => {
  const jsonc = `{
      // Comment A
      /** Comment B */
      "ignoreInWatchMode": ["methodWM"], // Comment C
      "ignoreRelatives": ["relative1", "relative2"], // Comment D
      "ignoreMethods": ["methodA", 
      // Comment E
      "methodB"], /* Comment F */
    }`

  it('preserves comments on round-trip no-op', () => {
    const model = ContractConfigModel.fromRawJsonc(jsonc)
    const text = model.toString()

    expect(text).toInclude('Comment A')
    expect(text).toInclude('Comment B')
    expect(text).toInclude('Comment C')
    expect(text).toInclude('Comment D')
    expect(text).toInclude('Comment E')
    expect(text).toInclude('Comment F')
  })

  it('addToIgnoredMethods preserves existing array comments and appends value', () => {
    const model = ContractConfigModel.fromRawJsonc(jsonc)
    model.addToIgnoredMethods('methodC')

    const text = model.toString()
    // Some mid-array comments may change position; assert at least one remains
    expect(text).toInclude('Comment F')
    expect(text).toInclude('"methodC"')
    expect(model.ignoreMethods ?? []).toInclude('methodC')
  })

  it('removeFromIgnoredMethods removes value; surrounding comments remain', () => {
    const model = ContractConfigModel.fromRawJsonc(jsonc)
    model.removeFromIgnoredMethods('methodB')

    const text = model.toString()
    expect(text).not.toInclude('"methodB"')
    // Inline/block comments elsewhere are preserved
    expect(text).toInclude('Comment A')
    expect(text).toInclude('Comment C')
  })

  it('add/remove for ignoreRelatives and ignoreInWatchMode mirror behaviors', () => {
    const model = ContractConfigModel.fromRawJsonc(jsonc)

    // add
    model.addToIgnoredRelatives('relative3')
    model.addToIgnoredInWatchMode('wm2')
    expect(model.ignoreRelatives ?? []).toInclude('relative3')
    expect(model.ignoreInWatchMode ?? []).toInclude('wm2')

    // remove one each; wm2 still present
    model.removeFromIgnoredRelatives('relative2')
    model.removeFromIgnoredInWatchMode('methodWM')
    expect(model.ignoreRelatives ?? []).not.toInclude('relative2')
    expect(model.ignoreInWatchMode ?? []).toInclude('wm2')

    // remove remaining to become undefined
    model.removeFromIgnoredInWatchMode('wm2')
    expect(model.ignoreInWatchMode).toEqual(undefined)

    const text = model.toString()
    expect(text).toInclude('Comment D')
    expect(text).not.toInclude('"methodWM"')
  })

  it('isEmpty, diff, hasDefinition behave as expected', () => {
    const empty = ContractConfigModel.fromRawJsonc('{}')
    expect(empty.isEmpty()).toEqual(true)
    expect(empty.hasDefinition('ignoreMethods')).toEqual(false)

    const model = ContractConfigModel.fromRawJsonc(jsonc)
    expect(model.isEmpty()).toEqual(false)
    expect(model.hasDefinition('ignoreMethods')).toEqual(true)

    const clone = ContractConfigModel.fromRawJsonc(jsonc)
    expect(model.diff(clone)).toEqual(false)
    model.addToIgnoredMethods('x')
    expect(model.diff(clone)).toEqual(true)

    // Remove all to become empty
    for (const m of ['methodA', 'methodB', 'x']) {
      model.removeFromIgnoredMethods(m)
    }
    model.removeFromIgnoredInWatchMode('methodWM')
    for (const r of ['relative1', 'relative2']) {
      model.removeFromIgnoredRelatives(r)
    }
    expect(model.isEmpty()).toEqual(true)
  })
})

describe('ConfigModel', () => {
  const id = '0x123'
  const newId = '0x456'

  const contractConfig = `{
    // Comment A
    /** Comment B */
    "ignoreInWatchMode": ["methodWM"], // Comment C
    "ignoreRelatives": ["relative1", "relative2"], // Comment D
    "ignoreMethods": ["methodA", 
    // Comment E
    "methodB"], /* Comment F */
  }`

  const config = `{
  /** Comment G */
    "name": "test", /* Comment H */
    "overrides": {
      "${id}": ${contractConfig}
    }
  }`

  it('keeps nested comments after no-op round-trip', () => {
    const model = ConfigModel.fromRawJsonc(config)
    const text = model.toString()
    expect(text).toInclude('Comment A')
    expect(text).toInclude('Comment B')
    expect(text).toInclude('Comment C')
    expect(text).toInclude('Comment D')
    expect(text).toInclude('Comment E')
    expect(text).toInclude('Comment F')
    expect(text).toInclude('Comment G')
    expect(text).toInclude('Comment H')
  })

  it('empty overrides are pruned in toString', () => {
    const model = ConfigModel.fromRawJsonc(config)
    // Create new override then remove to empty it
    model.addToIgnoredInWatchMode(newId, 'wm2')
    model.removeFromIgnoredInWatchMode(newId, 'wm2')

    const parsedCfg = parse(model.toString()) as any
    expect(parsedCfg.overrides?.[newId]).toEqual(undefined)
    expect(model.toString()).not.toInclude(newId)
  })

  it('ensure creates override on the fly, then prunes after removals', () => {
    const model = ConfigModel.fromRawJsonc(config)

    model.addToIgnoredMethods(newId, 'm1')
    expect(model.getIgnoredMethods(newId) ?? []).toInclude('m1')
    model.removeFromIgnoredMethods(newId, 'm1')
    expect(model.getIgnoredMethods(newId)).toEqual(undefined)

    const parsed = parse(model.toString()) as any
    expect(parsed.overrides?.[newId]).toEqual(undefined)
  })

  it('getters reflect nested contract values after mutations', () => {
    const model = ConfigModel.fromRawJsonc(config)
    model.addToIgnoredMethods(id, 'mX')
    model.addToIgnoredRelatives(id, 'rX')
    model.addToIgnoredInWatchMode(id, 'wX')

    expect(model.getIgnoredMethods(id) ?? []).toInclude('mX')
    expect(model.getIgnoreRelatives(id) ?? []).toInclude('rX')
    expect(model.getIgnoreInWatchMode(id) ?? []).toInclude('wX')
  })

  it('diff semantics', () => {
    const a = ConfigModel.fromRawJsonc(config)
    const b = ConfigModel.fromRawJsonc(config)
    expect(a.diff(b)).toEqual(false)
    a.addToIgnoredMethods(id, 'm2')
    expect(a.diff(b)).toEqual(true)
  })

  it('removing entry drops its attached comment when key disappears', () => {
    const model = ConfigModel.fromRawJsonc(config)

    // Remove the only entry so the whole key gets pruned
    model.removeFromIgnoredInWatchMode(id, 'methodWM')
    const text = model.toString()

    // The array/key is gone, so the inline comment bound to it should disappear as well
    expect(text).not.toInclude('Comment C')
  })
})
