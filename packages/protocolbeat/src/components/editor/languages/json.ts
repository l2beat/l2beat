import type { languages } from 'monaco-editor'
import * as configSchema from '../../../../../discovery/schemas/config.v2.schema.json'
import * as contractSchema from '../../../../../discovery/schemas/contract.v2.schema.json'

export const jsonDiagnostics: languages.json.DiagnosticsOptions = {
  allowComments: true,
  validate: true,
  enableSchemaRequest: true,
  schemaValidation: 'error',
  // TODO: Use editor.upsertJsonSchema() instead in respective editor components
  schemas: [
    {
      uri: 'inmemory:/discovery/schemas/contract.v2.schema.json',
      fileMatch: ['template.jsonc'],
      schema: {
        $schema: contractSchema.$schema,
        properties: contractSchema.properties,
        type: contractSchema.type,
      },
    },
    {
      uri: 'inmemory:/discovery/schemas/config.v2.schema.json',
      fileMatch: ['config.jsonc'],
      schema: {
        $schema: configSchema.$schema,
        properties: configSchema.properties,
        type: configSchema.type,
      },
    },
  ],
}
