import type { languages } from 'monaco-editor'
import * as contractSchema from '../../../../../discovery/schemas/contract.v2.schema.json'

export const jsonDiagnostics: languages.json.DiagnosticsOptions = {
  allowComments: true,
  validate: true,
  enableSchemaRequest: true,
  schemaValidation: 'error',
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
  ],
}
