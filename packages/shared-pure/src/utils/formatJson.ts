import { clamp } from './clamp'

enum WordType {
  Text = 0,
  Line = 1,
  GroupPush = 2,
  GroupPop = 3,
  NestPush = 4,
  NestPop = 5,
}

interface WordText {
  type: WordType.Text | WordType.Line
  value: string
}

interface WordRest {
  type:
    | WordType.GroupPush
    | WordType.GroupPop
    | WordType.NestPush
    | WordType.NestPop
}

type Word = WordText | WordRest

function fits(doc: Word[], offset: number, remainingWidth: number): boolean {
  let groupStack = 0
  let width = 0

  let i = offset
  for (; i < doc.length; i++) {
    const word = doc[i]
    if (groupStack < 0) {
      break
    }

    if (word.type === WordType.GroupPush) {
      groupStack++
    } else if (word.type === WordType.GroupPop) {
      groupStack--
    } else {
      if (word.type === WordType.Text || word.type === WordType.Line) {
        width += word.value.length

        if (width > remainingWidth) {
          return false
        }
      }
    }
  }

  if (width > remainingWidth) {
    return false
  }

  for (; i < doc.length; i++) {
    const word = doc[i]
    if (word.type === WordType.Line) {
      break
    }
    if (word.type === WordType.Text) {
      width += word.value.length
      if (width > remainingWidth) {
        return false
      }
    }
  }

  return width <= remainingWidth
}

function renderDocument(doc: Word[], config: FormatConfiguration): string {
  let result = ''

  let nest = 0
  let currentLineSize = 0
  let flatMode = false
  const flatModeStack: boolean[] = []

  for (const [i, word] of doc.entries()) {
    switch (word.type) {
      case WordType.GroupPush: {
        flatModeStack.push(flatMode)
        const remainingWidth =
          config.lineSize - clamp(currentLineSize, nest, config.lineSize)
        flatMode = fits(doc, i + 1, remainingWidth)
        break
      }
      case WordType.GroupPop: {
        flatMode = flatModeStack.pop() ?? false
        break
      }
      case WordType.Line: {
        if (!flatMode) {
          result += '\n'
          currentLineSize = 0
        } else {
          if (currentLineSize === 0) {
            result += ' '.repeat(nest)
            currentLineSize += nest
          }
          result += word.value
          currentLineSize += word.value.length
        }
        break
      }
      case WordType.Text: {
        if (currentLineSize === 0) {
          result += ' '.repeat(nest)
          currentLineSize += nest
        }
        result += word.value
        currentLineSize += word.value.length
        break
      }
      case WordType.NestPush: {
        if (!flatMode) {
          nest += config.indentSize
        }
        break
      }
      case WordType.NestPop: {
        if (!flatMode) {
          nest -= config.indentSize
        }
        break
      }
    }
  }

  return result
}

function wordText(value: string): Word {
  return { type: WordType.Text, value }
}

function wordLine(): Word {
  return { type: WordType.Line, value: ' ' }
}

function wordSoftline(): Word {
  return { type: WordType.Line, value: '' }
}

function wordGroupPush(): Word {
  return { type: WordType.GroupPush }
}

function wordGroupPop(): Word {
  return { type: WordType.GroupPop }
}

function wordNestPush(): Word {
  return { type: WordType.NestPush }
}

function wordNestPop(): Word {
  return { type: WordType.NestPop }
}

function arrayIsConcise(value: unknown[]): boolean {
  return value.length > 1 && value.every((v) => typeof v === 'number')
}

function pushJsonDocument(doc: Word[], value: unknown) {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      doc.push(wordText('[]'))
      return
    }

    doc.push(wordGroupPush())
    doc.push(wordText('['))
    doc.push(wordSoftline())
    doc.push(wordNestPush())

    if (arrayIsConcise(value)) {
      for (const [i, item] of value.entries()) {
        doc.push(wordGroupPush())
        pushJsonDocument(doc, item)
        if (i < value.length - 1) {
          doc.push(wordText(','))
          doc.push(wordLine())
        }
        doc.push(wordGroupPop())
      }
    } else {
      for (const [i, item] of value.entries()) {
        pushJsonDocument(doc, item)
        if (i < value.length - 1) {
          doc.push(wordText(','))
          doc.push(wordLine())
        }
      }
    }

    doc.push(wordNestPop())
    doc.push(wordSoftline())
    doc.push(wordText(']'))
    doc.push(wordGroupPop())
  } else if (typeof value === 'object' && value !== null) {
    const keys = Object.keys(value)
    const record = value as Record<string, unknown>
    const validKeys = keys.filter((key) => record[key] !== undefined)
    if (validKeys.length === 0) {
      doc.push(wordText('{}'))
      return
    }

    doc.push(wordGroupPush())
    doc.push(wordText('{'))
    doc.push(wordNestPush())
    doc.push(wordLine())

    for (const [i, key] of validKeys.entries()) {
      doc.push(wordText(JSON.stringify(key)))
      doc.push(wordText(': '))
      pushJsonDocument(doc, record[key] as unknown)

      if (i < validKeys.length - 1) {
        doc.push(wordText(','))
      }

      doc.push(wordLine())
    }

    doc.push(wordNestPop())
    doc.push(wordText('}'))
    doc.push(wordGroupPop())
  } else {
    doc.push(wordText(JSON.stringify(value) ?? 'null'))
  }
}

export interface FormatConfiguration {
  indentSize: number
  lineSize: number
}

const DEFAULT_CONFIGURATION: FormatConfiguration = {
  indentSize: 2,
  lineSize: 80,
}

export function formatJson(
  value: unknown,
  config: FormatConfiguration = DEFAULT_CONFIGURATION,
): string {
  const doc: Word[] = []

  doc.push(wordGroupPush())
  pushJsonDocument(doc, value)
  doc.push(wordGroupPop())

  return renderDocument(doc, config) + '\n'
}
