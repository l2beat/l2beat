/**
 * Configuration for supported AI models
 */

export const AI_MODELS = {
  'gpt-4o': {
    provider: 'openai',
    displayName: 'GPT-4o (OpenAI)',
    modelId: 'gpt-4o',
  },
  'claude-sonnet-4-5': {
    provider: 'claude',
    displayName: 'Claude Sonnet 4.5 (Anthropic)',
    modelId: 'claude-sonnet-4-5-20250929',
  },
} as const

export type ModelKey = keyof typeof AI_MODELS

export const DEFAULT_MODEL: ModelKey = 'gpt-4o'

/**
 * Get model configuration by key
 */
export function getModelConfig(modelKey: ModelKey): {
  provider: 'openai' | 'claude'
  displayName: string
  modelId: string
} {
  return AI_MODELS[modelKey]
}

/**
 * Check if a model key is valid
 */
export function isValidModelKey(key: string): key is ModelKey {
  return key in AI_MODELS
}

/**
 * Get all available models as array
 */
export function getAvailableModels(): Array<{
  key: ModelKey
  config: {
    provider: 'openai' | 'claude'
    displayName: string
    modelId: string
  }
}> {
  return Object.entries(AI_MODELS).map(([key, config]) => ({
    key: key as ModelKey,
    config,
  }))
}
