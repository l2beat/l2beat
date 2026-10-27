import type { JsonSchema } from '@l2beat/validate'

export function schemaToMarkdown(schema: unknown): string {
  if (!schema || typeof schema !== 'object') {
    return '### Schema\n\nNo schema available.'
  }

  const s = schema as JsonSchema
  const sections: string[] = []

  // Main schema description
  if (s.description) {
    sections.push(`### Description\n\n${s.description}`)
  }

  // Type information
  sections.push(generateTypeSection(s))

  // Properties (for objects)
  if (s.properties) {
    sections.push(generatePropertiesSection(s.properties, s.required || []))
  }

  // Array items
  if (s.items) {
    sections.push(generateArrayItemsSection(s.items))
  }

  // Enum values
  if (s.enum) {
    sections.push(generateEnumSection(s.enum))
  }

  // Const value
  if (s.const !== undefined) {
    sections.push(`### Constant Value\n\n\`${JSON.stringify(s.const)}\``)
  }

  // anyOf/oneOf/allOf
  if (s.anyOf) {
    sections.push(generateCombinatorSection('One or more of', s.anyOf))
  }
  if (s.oneOf) {
    sections.push(generateCombinatorSection('Exactly one of', s.oneOf))
  }
  if (s.allOf) {
    sections.push(generateCombinatorSection('All of', s.allOf))
  }

  // Additional constraints
  const constraints = generateConstraintsSection(s)
  if (constraints) {
    sections.push(constraints)
  }

  return sections.join('\n\n')
}

function generateTypeSection(schema: JsonSchema): string {
  const types = Array.isArray(schema.type) ? schema.type : [schema.type]
  const typeStr = types.filter(Boolean).join(' or ')

  if (!typeStr) {
    return '### Type\n\nAny'
  }

  return `### Type\n\n\`${typeStr}\``
}

function generatePropertiesSection(
  properties: Record<string, JsonSchema>,
  required: string[],
): string {
  const lines: string[] = ['### Properties']

  const entries = Object.entries(properties)
  if (entries.length === 0) {
    return ''
  }

  for (const [key, propSchema] of entries) {
    const isRequired = required.includes(key)
    const badge = isRequired ? '**required**' : '_optional_'
    const type = getTypeDisplay(propSchema)
    const desc = propSchema.description ? ` - ${propSchema.description}` : ''

    lines.push(`- \`${key}\` (${badge}) - ${type}${desc}`)

    // Add nested details for complex types
    if (propSchema.enum) {
      lines.push(
        `  - Allowed values: ${propSchema.enum.map((v) => `\`${JSON.stringify(v)}\``).join(', ')}`,
      )
    }
    if (propSchema.const !== undefined) {
      lines.push(`  - Must be: \`${JSON.stringify(propSchema.const)}\``)
    }
    if (propSchema.minimum !== undefined) {
      lines.push(`  - Minimum: \`${propSchema.minimum}\``)
    }
    if (propSchema.maximum !== undefined) {
      lines.push(`  - Maximum: \`${propSchema.maximum}\``)
    }
    if (propSchema.minLength !== undefined) {
      lines.push(`  - Minimum length: \`${propSchema.minLength}\``)
    }
    if (propSchema.maxLength !== undefined) {
      lines.push(`  - Maximum length: \`${propSchema.maxLength}\``)
    }
    if (propSchema.pattern) {
      lines.push(`  - Pattern: \`${propSchema.pattern}\``)
    }
    if (propSchema.format) {
      lines.push(`  - Format: \`${propSchema.format}\``)
    }
    if (propSchema.default !== undefined) {
      lines.push(`  - Default: \`${JSON.stringify(propSchema.default)}\``)
    }
  }

  return lines.join('\n')
}

function generateArrayItemsSection(items: JsonSchema | JsonSchema[]): string {
  const lines: string[] = ['### Array Items']

  if (Array.isArray(items)) {
    lines.push('\nTuple with fixed positions:')
    items.forEach((item, idx) => {
      const type = getTypeDisplay(item)
      const desc = item.description ? ` - ${item.description}` : ''
      lines.push(`${idx + 1}. ${type}${desc}`)
    })
  } else {
    lines.push(`\nEach item must be: ${getTypeDisplay(items)}`)
    if (items.description) {
      lines.push(`\n${items.description}`)
    }
  }

  return lines.join('\n')
}

function generateEnumSection(enumValues: unknown[]): string {
  const lines: string[] = ['### Allowed Values']
  lines.push('')
  enumValues.forEach((val) => {
    lines.push(`- \`${JSON.stringify(val)}\``)
  })
  return lines.join('\n')
}

function generateCombinatorSection(
  label: string,
  schemas: JsonSchema[],
): string {
  const lines: string[] = [`### ${label}`]
  lines.push('')

  schemas.forEach((subSchema, idx) => {
    lines.push(`**Option ${idx + 1}:**`)
    const type = getTypeDisplay(subSchema)
    lines.push(`- Type: ${type}`)
    if (subSchema.description) {
      lines.push(`- ${subSchema.description}`)
    }
    if (subSchema.properties) {
      const propKeys = Object.keys(subSchema.properties)
      if (propKeys.length > 0) {
        lines.push(
          `- Properties: ${propKeys.map((k) => `\`${k}\``).join(', ')}`,
        )
      }
    }
    lines.push('')
  })

  return lines.join('\n')
}

function generateConstraintsSection(schema: JsonSchema): string | null {
  const constraints: string[] = []

  if (schema.minimum !== undefined) {
    constraints.push(`- Minimum value: \`${schema.minimum}\``)
  }
  if (schema.maximum !== undefined) {
    constraints.push(`- Maximum value: \`${schema.maximum}\``)
  }
  if (schema.minLength !== undefined) {
    constraints.push(`- Minimum length: \`${schema.minLength}\``)
  }
  if (schema.maxLength !== undefined) {
    constraints.push(`- Maximum length: \`${schema.maxLength}\``)
  }
  if (schema.pattern) {
    constraints.push(`- Must match pattern: \`${schema.pattern}\``)
  }
  if (schema.format) {
    constraints.push(`- Format: \`${schema.format}\``)
  }
  if (schema.additionalProperties === false) {
    constraints.push('- No additional properties allowed')
  } else if (typeof schema.additionalProperties === 'object') {
    constraints.push(
      `- Additional properties must be: ${getTypeDisplay(schema.additionalProperties)}`,
    )
  }

  if (constraints.length === 0) {
    return null
  }

  return '### Constraints\n\n' + constraints.join('\n')
}

function getTypeDisplay(schema: JsonSchema): string {
  // Handle const
  if (schema.const !== undefined) {
    return `constant \`${JSON.stringify(schema.const)}\``
  }

  // Handle enum
  if (schema.enum) {
    return `enum (${schema.enum.map((v) => `\`${JSON.stringify(v)}\``).join(' | ')})`
  }

  // Handle anyOf/oneOf/allOf
  if (schema.anyOf) {
    return schema.anyOf.map((s) => getTypeDisplay(s)).join(' | ')
  }
  if (schema.oneOf) {
    return schema.oneOf.map((s) => getTypeDisplay(s)).join(' | ')
  }
  if (schema.allOf) {
    return schema.allOf.map((s) => getTypeDisplay(s)).join(' & ')
  }

  // Handle arrays
  if (schema.type === 'array' && schema.items) {
    const itemType = Array.isArray(schema.items)
      ? '[' + schema.items.map(getTypeDisplay).join(', ') + ']'
      : getTypeDisplay(schema.items)
    return `array<${itemType}>`
  }

  // Handle objects
  if (schema.type === 'object') {
    if (schema.properties) {
      const keys = Object.keys(schema.properties)
      if (keys.length > 0) {
        return `object { ${keys
          .slice(0, 3)
          .map((k) => `\`${k}\``)
          .join(', ')}${keys.length > 3 ? ', ...' : ''} }`
      }
    }
    return 'object'
  }

  // Handle multiple types
  if (Array.isArray(schema.type)) {
    return schema.type.map((t) => `\`${t}\``).join(' | ')
  }

  // Handle simple type
  if (schema.type) {
    return `\`${schema.type}\``
  }

  return 'any'
}
