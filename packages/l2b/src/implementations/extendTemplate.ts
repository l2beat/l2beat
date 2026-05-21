import { getDiscoveryPaths } from '@l2beat/discovery'
import { readFileSync, writeFileSync } from 'fs'
import { applyEdits, modify, type ParseError, parse } from 'jsonc-parser'
import path from 'path'

export type ExtendTemplateOptions = {
  description?: string
  ignoreRelatives?: string[]
}

export type ExtendTemplateResult = {
  appliedDescription: boolean
  appliedIgnoreRelatives: boolean
  conflicts: string[]
}

/**
 * Surgically inserts `description` and `ignoreRelatives` into an existing
 * template.jsonc, preserving its comments and formatting via jsonc-parser's
 * `modify` API.
 *
 * Both fields are insert-only: if the template already has the field, the
 * insertion is skipped and the field name is reported in `conflicts`. The
 * caller decides whether to treat conflicts as an error or a warning.
 */
export function extendTemplate(
  templateName: string,
  options: ExtendTemplateOptions,
): ExtendTemplateResult {
  const paths = getDiscoveryPaths()
  const templatePath = path.join(
    paths.discovery,
    '_templates',
    templateName,
    'template.jsonc',
  )

  const original = readFileSync(templatePath, 'utf-8')
  const errors: ParseError[] = []
  const parsed = parse(original, errors, { allowTrailingComma: true }) as
    | Record<string, unknown>
    | undefined
  if (errors.length !== 0 || parsed === undefined || parsed === null) {
    throw new Error(`Cannot parse template at ${templatePath}`)
  }

  const result: ExtendTemplateResult = {
    appliedDescription: false,
    appliedIgnoreRelatives: false,
    conflicts: [],
  }

  let text = original
  const formattingOptions = { tabSize: 2, insertSpaces: true }

  if (options.description !== undefined) {
    if ('description' in parsed) {
      result.conflicts.push('description')
    } else {
      const edits = modify(text, ['description'], options.description, {
        formattingOptions,
      })
      text = applyEdits(text, edits)
      result.appliedDescription = true
    }
  }

  if (options.ignoreRelatives !== undefined) {
    if ('ignoreRelatives' in parsed) {
      result.conflicts.push('ignoreRelatives')
    } else {
      const edits = modify(text, ['ignoreRelatives'], options.ignoreRelatives, {
        formattingOptions,
      })
      text = applyEdits(text, edits)
      result.appliedIgnoreRelatives = true
    }
  }

  if (result.appliedDescription || result.appliedIgnoreRelatives) {
    writeFileSync(templatePath, text)
  }

  return result
}
