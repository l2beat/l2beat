import { expect } from 'earl'
import { FieldConfigModel } from './FieldConfigModel'

describe('FieldConfigModel', () => {
  describe('comment preservation', () => {
    const jsonc = `{
      // Comment A
      /** Comment B */
      "severity": "HIGH", // Comment C
      "description": "Test field" /* Comment D */
    }`

    it('preserves comments on round-trip no-op', () => {
      const model = FieldConfigModel.fromRawJsonc(jsonc)
      const text = model.toString()

      expect(text).toInclude('Comment A')
      expect(text).toInclude('Comment B')
      expect(text).toInclude('Comment C')
      expect(text).toInclude('Comment D')
    })

    it('preserves comments after setSeverity', () => {
      const model = FieldConfigModel.fromRawJsonc(jsonc)
      const updated = model.setSeverity('LOW')

      const text = updated.toString()
      expect(text).toInclude('Comment A')
      expect(text).toInclude('"LOW"')
    })

    it('preserves comments when setting severity to undefined', () => {
      const model = FieldConfigModel.fromRawJsonc(jsonc)
      const updated = model.setSeverity(undefined)

      const text = updated.toString()
      // Description field and its comments should be preserved
      expect(text).toInclude('Comment D')
      expect(text).toInclude('"description"')
      expect(text).not.toInclude('"severity"')
    })
  })

  describe('data immutability', () => {
    const jsonc = `{
      "severity": "HIGH",
      "description": "Test field"
    }`

    it('does not mutate original model when setting severity', () => {
      const original = FieldConfigModel.fromRawJsonc(jsonc)
      const updated = original.setSeverity('LOW')

      expect(original.severity).toEqual('HIGH')
      expect(updated.severity).toEqual('LOW')
    })

    it('peek returns cloned data, mutations do not affect original', () => {
      const model = FieldConfigModel.fromRawJsonc(jsonc)
      const peeked = model.peek()

      peeked.severity = 'LOW'

      expect(model.severity).toEqual('HIGH')
    })

    it('multiple operations create independent instances', () => {
      const original = FieldConfigModel.fromRawJsonc(jsonc)
      const branch1 = original.setSeverity('LOW')
      const branch2 = original.setSeverity(undefined)

      expect(original.severity).toEqual('HIGH')
      expect(branch1.severity).toEqual('LOW')
      expect(branch2.severity).toEqual(undefined)
    })

    it('sequential operations maintain immutability chain', () => {
      const v1 = FieldConfigModel.fromRawJsonc(jsonc)
      const v2 = v1.setSeverity('LOW')
      const v3 = v2.setSeverity(undefined)
      const v4 = v3.setSeverity('HIGH')

      expect(v1.severity).toEqual('HIGH')
      expect(v2.severity).toEqual('LOW')
      expect(v3.severity).toEqual(undefined)
      expect(v4.severity).toEqual('HIGH')
    })
  })

  describe('edge cases', () => {
    it('hasDefinition works correctly', () => {
      const model = FieldConfigModel.fromRawJsonc(`{ "severity": "HIGH" }`)
      expect(model.hasDefinition('severity')).toEqual(true)
      expect(model.hasDefinition('description')).toEqual(false)
    })

    it('hasDefinition works for description field', () => {
      const model = FieldConfigModel.fromRawJsonc(`{ "description": "Test" }`)
      expect(model.hasDefinition('description')).toEqual(true)
      expect(model.hasDefinition('severity')).toEqual(false)
    })

    it('handles empty config', () => {
      const model = FieldConfigModel.fromRawJsonc('{}')
      expect(model.hasDefinition('severity')).toEqual(false)
      expect(model.hasDefinition('description')).toEqual(false)
      expect(model.severity).toEqual(undefined)
    })

    it('handles config with only severity', () => {
      const model = FieldConfigModel.fromRawJsonc(`{ "severity": "LOW" }`)
      expect(model.severity).toEqual('LOW')
      expect(model.hasDefinition('severity')).toEqual(true)
    })

    it('handles config with only description', () => {
      const model = FieldConfigModel.fromRawJsonc(
        `{ "description": "Test description" }`,
      )
      expect(model.hasDefinition('description')).toEqual(true)
      expect(model.severity).toEqual(undefined)
    })
  })

  describe('severity getter', () => {
    it('returns HIGH when set', () => {
      const model = FieldConfigModel.fromRawJsonc(`{ "severity": "HIGH" }`)
      expect(model.severity).toEqual('HIGH')
    })

    it('returns LOW when set', () => {
      const model = FieldConfigModel.fromRawJsonc(`{ "severity": "LOW" }`)
      expect(model.severity).toEqual('LOW')
    })

    it('returns undefined when not set', () => {
      const model = FieldConfigModel.fromRawJsonc('{}')
      expect(model.severity).toEqual(undefined)
    })

    it('returns undefined after setting to undefined', () => {
      const model = FieldConfigModel.fromRawJsonc(`{ "severity": "HIGH" }`)
      const updated = model.setSeverity(undefined)
      expect(updated.severity).toEqual(undefined)
    })
  })

  describe('setSeverity', () => {
    it('sets severity to HIGH', () => {
      const model = FieldConfigModel.fromRawJsonc('{}')
      const updated = model.setSeverity('HIGH')
      expect(updated.severity).toEqual('HIGH')
    })

    it('sets severity to LOW', () => {
      const model = FieldConfigModel.fromRawJsonc('{}')
      const updated = model.setSeverity('LOW')
      expect(updated.severity).toEqual('LOW')
    })

    it('removes severity when set to undefined', () => {
      const model = FieldConfigModel.fromRawJsonc(`{ "severity": "HIGH" }`)
      const updated = model.setSeverity(undefined)
      expect(updated.severity).toEqual(undefined)
      expect(updated.hasDefinition('severity')).toEqual(false)
    })

    it('changes severity from HIGH to LOW', () => {
      const model = FieldConfigModel.fromRawJsonc(`{ "severity": "HIGH" }`)
      const updated = model.setSeverity('LOW')
      expect(model.severity).toEqual('HIGH')
      expect(updated.severity).toEqual('LOW')
    })

    it('changes severity from LOW to HIGH', () => {
      const model = FieldConfigModel.fromRawJsonc(`{ "severity": "LOW" }`)
      const updated = model.setSeverity('HIGH')
      expect(model.severity).toEqual('LOW')
      expect(updated.severity).toEqual('HIGH')
    })
  })

  describe('setDescription', () => {
    it('sets a normal description', () => {
      const model = FieldConfigModel.fromRawJsonc('{}')
      const updated = model.setDescription('Test description')
      expect(updated.peek().description).toEqual('Test description')
      expect(updated.hasDefinition('description')).toEqual(true)
    })

    it('trims whitespace from description', () => {
      const model = FieldConfigModel.fromRawJsonc('{}')
      const updated = model.setDescription('  Test description  ')
      expect(updated.peek().description).toEqual('Test description')
    })

    it('converts empty string to undefined', () => {
      const model = FieldConfigModel.fromRawJsonc(
        `{ "description": "Existing" }`,
      )
      const updated = model.setDescription('')
      expect(updated.peek().description).toEqual(undefined)
      expect(updated.hasDefinition('description')).toEqual(false)
    })

    it('converts whitespace-only string to undefined', () => {
      const model = FieldConfigModel.fromRawJsonc(
        `{ "description": "Existing" }`,
      )
      const updated = model.setDescription('   ')
      expect(updated.peek().description).toEqual(undefined)
      expect(updated.hasDefinition('description')).toEqual(false)
    })

    it('removes description when set to undefined', () => {
      const model = FieldConfigModel.fromRawJsonc(
        `{ "description": "Existing" }`,
      )
      const updated = model.setDescription(undefined)
      expect(updated.peek().description).toEqual(undefined)
      expect(updated.hasDefinition('description')).toEqual(false)
    })

    it('changes description from one value to another', () => {
      const model = FieldConfigModel.fromRawJsonc(
        `{ "description": "Old description" }`,
      )
      const updated = model.setDescription('New description')
      expect(model.peek().description).toEqual('Old description')
      expect(updated.peek().description).toEqual('New description')
    })

    it('maintains immutability when setting description', () => {
      const original = FieldConfigModel.fromRawJsonc('{}')
      const updated = original.setDescription('Test')
      expect(original.peek().description).toEqual(undefined)
      expect(updated.peek().description).toEqual('Test')
    })

    it('preserves comments when setting description', () => {
      const jsonc = `{
        // Comment A
        "severity": "HIGH", // Comment B
        "description": "Old" // Comment C
      }`
      const model = FieldConfigModel.fromRawJsonc(jsonc)
      const updated = model.setDescription('New description')

      const text = updated.toString()
      expect(text).toInclude('Comment A')
      expect(text).toInclude('Comment B')
      expect(text).toInclude('New description')
    })
  })
})
