import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import type { ApiHandlersResponse } from '../../../../../api/types'
import { Dialog } from '../../../../../components/Dialog'
import { IconEdit } from '../../../../../icons/IconEdit'
import { useAvailableHandlers } from '../../../hooks/useAvailableHandlers'
import { useConfigModels } from '../../../hooks/useConfigModels'
import { HandlerEditor } from './HandlerEditor'
import { HandlerSelector } from './HandlerSelector'

type Props = {
  context: 'config' | 'template'
  fieldName: string
}

export function FieldHandlerConfigDialog({ context, fieldName }: Props) {
  const editorKey = `handler-${context}-${fieldName}`
  const models = useConfigModels()
  const model = context === 'config' ? models.configModel : models.templateModel
  const { handlers, parseRaw, detectHandler } = useAvailableHandlers()

  const [handlerString, setHandlerString] = useState(
    model.getFieldHandlerString(fieldName) ?? '',
  )

  useEffect(() => {
    setHandlerString(model.getFieldHandlerString(fieldName) ?? '')
  }, [model, fieldName])

  const [selectedHandler, setSelectedHandler] = useState<
    ApiHandlersResponse['handlers'][number] | undefined
  >(undefined)

  const [errors, setErrors] = useState<string | undefined>(undefined)

  useEffect(() => {
    setSelectedHandler(detectHandler(handlerString))
  }, [handlerString])

  function onSave(content: string) {
    const result = parseRaw(content)
    if (!result.ok) {
      toast.error('Cannot save handler.', {
        description: <pre>{result.message}</pre>,
      })
      return false
    }
    model.setFieldHandler(fieldName, result.model)
    toast.success('Handler saved.')
    return true
  }

  function onChange(content: string) {
    setHandlerString(content)
    const result = parseRaw(content)
    if (!result.ok) {
      setErrors(result.message)
    } else {
      setErrors(undefined)
    }
  }

  function onSelectedHandlerChange(type: string) {
    const handler = handlers.find((handler) => handler.type === type)
    if (handler) {
      setSelectedHandler(handler)
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <div className="absolute top-0 right-0 hidden h-full w-full cursor-pointer items-center justify-center bg-coffee-700/50 group-hover:flex">
          <IconEdit className="size-4 text-coffee-200/80" />
        </div>
      </Dialog.Trigger>
      <Dialog.Body
        onEscapeKeyDown={(e) => {
          e.preventDefault()
        }}
        onPointerDownOutside={(e) => {
          e.preventDefault()
        }}
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
        className="flex h-[85vh] max-w-full flex-col"
      >
        <Dialog.Title>Handler editor</Dialog.Title>
        <div className="grid min-h-0 flex-1 grid-cols-5 gap-2">
          <div className="col-span-3 flex min-h-0 w-full flex-col">
            <div className="flex min-h-0 flex-1 flex-col border border-coffee-200 bg-coffee-900 p-4 pl-0">
              <HandlerEditor
                context={context}
                editorKey={editorKey}
                fieldName={fieldName}
                contents={handlerString}
                selectedHandler={selectedHandler}
                onSave={onSave}
                onChange={onChange}
              />
            </div>
          </div>
          <div className="col-span-2 flex h-full min-h-0 w-full">
            <HandlerSelector
              handlers={handlers}
              selectedHandler={selectedHandler}
              onSelectedHandlerChange={onSelectedHandlerChange}
            />

            {errors && <div className="text-coffee-300 text-xs">{errors}</div>}
          </div>
        </div>
      </Dialog.Body>
    </Dialog.Root>
  )
}
