import type { FieldConfigSchema } from '@l2beat/discovery'
import { fromJsonSchema, type JsonSchema, v } from '@l2beat/validate'
import { useQuery } from '@tanstack/react-query'
import { parse } from 'comment-json'
import { useMemo } from 'react'
import { getHandlers } from '../../../api/api'

const HandlerBaseSchema = v.passthroughObject({
  type: v.string(),
})

export function useAvailableHandlers() {
  const handlersResponse = useQuery({
    queryKey: ['handlers'],
    queryFn: () => {
      return getHandlers()
    },
  })

  const availableHandlers = useMemo(() => {
    return handlersResponse.data?.handlers ?? []
  }, [handlersResponse.data])

  function detectHandler(content: string) {
    const maybeJsonc = tryParsingJsonc(content)
    if (!maybeJsonc) {
      return undefined
    }
    const result = HandlerBaseSchema.safeParse(maybeJsonc)
    if (!result.success) {
      return undefined
    }
    return availableHandlers.find(
      (handler) => handler.type === result.data.type,
    )
  }

  function validateRawHandler(content: string) {
    if (content.trim() === '') {
      return { ok: true, handler: undefined } as const
    }

    const maybeJsonc = tryParsingJsonc(content)

    if (!maybeJsonc) {
      return { ok: false, message: 'Invalid JSONC' } as const
    }

    const result = HandlerBaseSchema.safeParse(maybeJsonc)

    if (!result.success) {
      return { ok: false, message: 'Invalid base definition' } as const
    }

    const handlerType = result.data.type

    const matchingHandler = availableHandlers.find(
      (handler) => handler.type === handlerType,
    )

    if (!matchingHandler) {
      return { ok: false, message: 'Unsupported handler type' } as const
    }

    const handlerSchema = matchingHandler.schema

    const handlerResult = fromJsonSchema(handlerSchema as JsonSchema).safeParse(
      result.data,
    )

    if (!handlerResult.success) {
      return {
        ok: false,
        message: 'Invalid handler definition',
      } as const
    }

    return {
      ok: true,
      handler: maybeJsonc as FieldConfigSchema['handler'],
    } as const
  }

  return {
    isPending: handlersResponse.isPending,
    isError: handlersResponse.isError,
    handlers: availableHandlers,
    parseRaw: validateRawHandler,
    detectHandler,
  }
}

function tryParsingJsonc(content: string): unknown {
  try {
    return parse(content)
  } catch {
    return undefined
  }
}
