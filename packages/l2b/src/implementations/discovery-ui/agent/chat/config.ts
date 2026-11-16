import { v as z } from '@l2beat/validate'
import type { ApiChatConfigOption } from '../../types'

// The panel offers the model and how hard it thinks. Agents send more, like
// permission modes, which DiscoUI leaves at the researcher's own settings.
const CATEGORIES = ['model', 'thought_level'] as const
// Far above the dozen models an adapter lists; the rest is cut.
const VALUES_MAX = 60
const LABEL_CHARACTERS_MAX = 200
// Ids and values go back to the agent as they came, so a long one is
// skipped rather than cut.
const ID_CHARACTERS_MAX = 200

const valueSchema = z.object({
  value: z.string(),
  name: z.string(),
  description: z.union([z.string(), z.null()]).optional(),
})
// ACP lets an agent group the values of a select under headings.
const groupSchema = z.object({
  group: z.string(),
  options: z.array(valueSchema),
})
const optionSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.union([z.string(), z.null()]).optional(),
  type: z.literal('select'),
  currentValue: z.string(),
  options: z.array(z.union([valueSchema, groupSchema])),
})
type Option = z.infer<typeof optionSchema>
const optionsSchema = z.object({ configOptions: z.array(z.unknown()) })

// Options that do not parse are skipped one by one, so a new kind of option
// from a newer adapter leaves the model picker working. Undefined when the
// message carries no options at all.
export function readConfigOptions(
  message: unknown,
): ApiChatConfigOption[] | undefined {
  const parsed = optionsSchema.safeParse(message)
  if (!parsed.success) {
    return undefined
  }
  const options: ApiChatConfigOption[] = []
  for (const category of CATEGORIES) {
    const option = parsed.data.configOptions
      .map((raw) => optionSchema.safeParse(raw))
      .flatMap((result) => (result.success ? [result.data] : []))
      .find(
        (candidate) =>
          candidate.category === category &&
          candidate.id.length <= ID_CHARACTERS_MAX &&
          candidate.currentValue.length <= ID_CHARACTERS_MAX,
      )
    if (option !== undefined) {
      options.push(toConfigOption(option, category))
    }
  }
  return options
}

function toConfigOption(
  option: Option,
  category: (typeof CATEGORIES)[number],
): ApiChatConfigOption {
  const values = option.options
    .flatMap((entry) => ('group' in entry ? entry.options : [entry]))
    .filter((entry) => entry.value.length <= ID_CHARACTERS_MAX)
    .slice(0, VALUES_MAX)
    .map((entry) => {
      const value = { value: entry.value, name: clip(entry.name) }
      return typeof entry.description === 'string'
        ? { ...value, description: clip(entry.description) }
        : value
    })
  return {
    id: option.id,
    name: clip(option.name),
    category,
    currentValue: option.currentValue,
    values,
  }
}

function clip(text: string): string {
  return text.slice(0, LABEL_CHARACTERS_MAX)
}
