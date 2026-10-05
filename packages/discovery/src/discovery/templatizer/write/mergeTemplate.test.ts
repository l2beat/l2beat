import { expect } from 'earl'
import { type MergeInput, mergeTemplate } from './mergeTemplate'

describe(mergeTemplate.name, () => {
  /** What `TemplateService.ensureTemplateExists` writes. */
  const NEW = '{\n  "$schema": "../../schema.json"\n}\n'

  /** A researcher's template: comments, hand layout, a trailing comment. */
  const EXISTING = `{
  "$schema": "../../schema.json",
  "description": "Keeps the validator set.",
  "ignoreMethods": ["threshold"],
  "fields": {
    // written by a researcher
    "validators": {
      "severity": "HIGH",
      "handler": { "type": "event", "select": "validator", "add": { "event": "ValidatorUpdated" } }
    },
    "owner": {
      "description": "Can pause."
    }
    // a trailing comment the researcher left here
  }
}
`

  function merged(input: Partial<MergeInput>): string {
    const result = mergeTemplate({
      text: EXISTING,
      isNew: false,
      additions: {},
      ...input,
    })
    if ('problems' in result) {
      throw new Error(JSON.stringify(result.problems))
    }
    return result.text
  }

  function problems(input: Partial<MergeInput>) {
    const result = mergeTemplate({
      text: EXISTING,
      isNew: false,
      additions: {},
      ...input,
    })
    return 'problems' in result ? result.problems : []
  }

  it('writes a new template into the file V1 creates, header first, each field under its comments, laid out as biome prints it', () => {
    const text = merged({
      text: NEW,
      isNew: true,
      additions: {
        description: 'A registry.',
        fields: {
          validators: {
            handler: {
              type: 'event',
              select: 'validator',
              add: { event: 'ValidatorUpdated', where: ['=', '#active', true] },
              remove: {
                event: 'ValidatorUpdated',
                where: ['!=', '#active', true],
              },
            },
          },
          delay: {
            handler: { type: 'call', method: 'delay', args: [] },
            edit: ['format', 'FormatSeconds'],
          },
        },
      },
      fieldComments: {
        validators: ['written by setValidator (onlyOwner)', 'review: note'],
      },
      header: ['Authored by a model. Review before committing.'],
    })

    expect(text).toEqual(`{
  "$schema": "../../schema.json",
  // Authored by a model. Review before committing.
  "description": "A registry.",
  "fields": {
    // written by setValidator (onlyOwner)
    // review: note
    "validators": {
      "handler": {
        "type": "event",
        "select": "validator",
        "add": { "event": "ValidatorUpdated", "where": ["=", "#active", true] },
        "remove": {
          "event": "ValidatorUpdated",
          "where": ["!=", "#active", true]
        }
      }
    },
    "delay": {
      "handler": {
        "type": "call",
        "method": "delay",
        "args": []
      },
      "edit": ["format", "FormatSeconds"]
    }
  }
}
`)
  })

  it('writes only the header into a new template with nothing to add', () => {
    expect(
      merged({ text: NEW, isNew: true, header: ['Authored without a model.'] }),
    ).toEqual(
      '{\n  "$schema": "../../schema.json"\n  // Authored without a model.\n}\n',
    )
  })

  it('appends new fields after the last one, keeping every byte of the old text, comments included', () => {
    const text = merged({
      additions: {
        fields: {
          indices: {
            handler: {
              type: 'array',
              method: 'roles',
              indices: Array.from({ length: 30 }, (_, i) => i),
            },
          },
        },
      },
      fieldComments: { indices: ['reads every role'] },
      header: ['Added by a model.'],
    })

    expect(text).toEqual(
      EXISTING.replace(
        `      "description": "Can pause."
    }
`,
        `      "description": "Can pause."
    },
    // Added by a model.
    // reads every role
    "indices": {
      "handler": {
        "type": "array",
        "method": "roles",
        "indices": [
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
          20, 21, 22, 23, 24, 25, 26, 27, 28, 29
        ]
      }
    }
`,
      ),
    )
  })

  it('adds severity, description and permissions to a field the template has, under the field’s comments', () => {
    const text = merged({
      additions: {
        fields: {
          owner: {
            severity: 'HIGH',
            permissions: [{ type: 'interact', description: 'pause' }],
          },
        },
      },
      fieldComments: { owner: ['owner can pause'] },
    })

    expect(text).toEqual(
      EXISTING.replace(
        `      "description": "Can pause."
    }`,
        `      "description": "Can pause.",
      // owner can pause
      "severity": "HIGH",
      "permissions": [{ "type": "interact", "description": "pause" }]
    }`,
      ),
    )
  })

  it('adds `fields` to an existing template that has none', () => {
    const text = merged({
      text: '{\n  "$schema": "x",\n  "ignoreMethods": []\n}\n',
      additions: {
        fields: { a: { handler: { type: 'hardcoded', value: 1 } } },
      },
    })

    expect(text).toEqual(`{
  "$schema": "x",
  "ignoreMethods": [],
  "fields": {
    "a": {
      "handler": {
        "type": "hardcoded",
        "value": 1
      }
    }
  }
}
`)
  })

  it('fills an empty object and inserts behind a trailing comma', () => {
    expect(
      merged({
        text: '{\n  "fields": {}\n}\n',
        additions: { fields: { a: { severity: 'LOW' } } },
      }),
    ).toEqual(
      '{\n  "fields": {\n    "a": {\n      "severity": "LOW"\n    }\n  }\n}\n',
    )
    expect(
      merged({
        text: '{\n  "fields": {\n    "a": {},\n  }\n}\n',
        additions: { fields: { b: { severity: 'LOW' } } },
      }),
    ).toEqual(
      '{\n  "fields": {\n    "a": {},\n    "b": {\n      "severity": "LOW"\n    },\n  }\n}\n',
    )
  })

  it('spreads an object written on one line before adding to it, changing only whitespace', () => {
    // What `ensureTemplateExists` really writes, through `formatJson`.
    const v1 = '{ "$schema": "../../schema.json" }\n'
    expect(
      merged({
        text: v1,
        isNew: true,
        additions: { fields: { a: { severity: 'LOW' } } },
        header: ['Authored by a model.'],
      }),
    ).toEqual(`{
  "$schema": "../../schema.json",
  // Authored by a model.
  "fields": {
    "a": {
      "severity": "LOW"
    }
  }
}
`)
    expect(
      merged({ text: v1, isNew: true, header: ['Authored without a model.'] }),
    ).toEqual(
      '{\n  "$schema": "../../schema.json"\n  // Authored without a model.\n}\n',
    )
    expect(
      merged({
        text: '{\n  "fields": {\n    "owner": { "description": "Can pause." }\n  }\n}\n',
        additions: { fields: { owner: { severity: 'HIGH' } } },
      }),
    ).toEqual(
      '{\n  "fields": {\n    "owner": {\n      "description": "Can pause.",\n      "severity": "HIGH"\n    }\n  }\n}\n',
    )
  })

  it('returns an existing template unchanged, without a header, when there is nothing to add', () => {
    expect(
      merged({ additions: { fields: {} }, header: ['Added by a model.'] }),
    ).toEqual(EXISTING)
  })

  it('never replaces: a key the template has, a top-level key of an existing template, another key on an existing field', () => {
    expect(
      problems({
        additions: {
          ignoreRelatives: ['x'],
          description: 'other',
          fields: {
            validators: {
              severity: 'LOW',
              handler: { type: 'call', method: 'validators', args: [] },
              edit: ['format', 'FormatSeconds'],
            },
            owner: { description: 'other', type: 'PERMISSION' },
          },
        },
      }),
    ).toEqual([
      {
        path: 'ignoreRelatives',
        message:
          'this template is shared by every contract of its shapes, so nothing is added at its top level: add new entries under `fields`, and to a field it already has only severity, description, permissions',
      },
      {
        path: 'description',
        message:
          'the template already has description, which keeps its value; leave description out',
      },
      {
        path: 'fields.validators.severity',
        message:
          'validators already has severity, which keeps its value; leave severity out',
      },
      {
        path: 'fields.validators.handler',
        message:
          'validators already has handler, which keeps its value; leave handler out',
      },
      {
        path: 'fields.validators.edit',
        message:
          'validators is a field the template already has, and only severity, description, permissions are added to it, which leave its value as it is; to read more state, add a field of another name',
      },
      {
        path: 'fields.owner.description',
        message:
          'owner already has description, which keeps its value; leave description out',
      },
      {
        path: 'fields.owner.type',
        message:
          'owner is a field the template already has, and only severity, description, permissions are added to it, which leave its value as it is; to read more state, add a field of another name',
      },
    ])
    expect(
      problems({ text: NEW, isNew: true, additions: { $schema: 'y' } }),
    ).toEqual([
      {
        path: '$schema',
        message:
          'the template already has $schema, which keeps its value; leave $schema out',
      },
    ])
  })

  it('refuses a result discovery would not load', () => {
    expect(() =>
      merged({
        text: NEW,
        isNew: true,
        additions: { fields: { a: { handler: { type: 'nope' } } } },
      }),
    ).toThrow('The merged template.jsonc does not load')
  })
})
