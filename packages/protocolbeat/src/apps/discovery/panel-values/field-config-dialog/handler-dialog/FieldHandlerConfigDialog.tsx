import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import type { ApiHandlersResponse } from '../../../../../api/types'
import { Button } from '../../../../../components/Button'
import { Dialog } from '../../../../../components/Dialog'
import { Kbd } from '../../../../../components/Kbd'
import { IconEdit } from '../../../../../icons/IconEdit'
import { IconTriangleAlert } from '../../../../../icons/IconTriangleAlert'
import { useAvailableHandlers } from '../../../hooks/useAvailableHandlers'
import { useConfigModels } from '../../../hooks/useConfigModels'
import { useIsomorphicKeys } from '../../../hooks/useIsomorphicKeys'
import { HandlerEditor } from './HandlerEditor'
import { HandlerSelector } from './HandlerSelector'

type Props = {
  context: 'config' | 'template'
  fieldName: string
}

export function FieldHandlerConfigDialog({ context, fieldName }: Props) {
  const models = useConfigModels()
  const { ctrlKey } = useIsomorphicKeys()
  const { handlers, parseRaw, detectHandler } = useAvailableHandlers()

  const model = context === 'config' ? models.configModel : models.templateModel

  const currentlyConfiguredHandler = useMemo(
    () => model.getFieldHandlerString(fieldName) ?? '',
    [model, fieldName],
  )

  const [handlerEditorContent, setHandlerEditorContent] = useState(
    currentlyConfiguredHandler,
  )

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  )

  const editorKey = `handler-${context}-${fieldName}`

  // Not using useCodeStore since we're running in controlled mode
  const isDirty = handlerEditorContent !== currentlyConfiguredHandler

  const [selectedHandler, setSelectedHandler] = useState<
    ApiHandlersResponse['handlers'][number] | undefined
  >(detectHandler(handlerEditorContent))

  useEffect(() => {
    setHandlerEditorContent(currentlyConfiguredHandler)
  }, [currentlyConfiguredHandler])

  useEffect(() => {
    validateContents(selectedHandler?.type ?? '', handlerEditorContent)
  }, [selectedHandler, handlerEditorContent])

  function validateContents(type: string, content: string) {
    const result = parseRaw(type, content)
    if (!result.ok) {
      setErrorMessage(result.message)
    } else {
      setErrorMessage(undefined)
    }
  }

  function onSave(content: string) {
    const result = parseRaw(selectedHandler?.type ?? '', content)
    if (!result.ok) {
      toast.error('Cannot save handler', {
        description: <pre>{result.message}</pre>,
      })
      return false
    }
    model.setFieldHandler(fieldName, result.handler)
    toast.success('Handler saved')
    return true
  }

  function onChange(content: string) {
    setHandlerEditorContent(content)
  }

  function onSelectedHandlerChange(type: string) {
    const handler = handlers.find((handler) => handler.type === type)
    if (handler) {
      setSelectedHandler(handler)
    }
  }

  function onOpenChange(open: boolean) {
    if (!open) {
      setHandlerEditorContent(currentlyConfiguredHandler)
      setSelectedHandler(detectHandler(currentlyConfiguredHandler))
      setErrorMessage(undefined)
    }
  }

  return (
    <Dialog.Root onOpenChange={onOpenChange}>
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
          <div className="col-span-3 flex min-h-0 w-full flex-col gap-2 border-coffee-400 border-r pr-2">
            <div className="flex min-h-0 flex-1 flex-col border border-coffee-400 bg-coffee-900 p-4 pl-0">
              <HandlerEditor
                context={context}
                editorKey={editorKey}
                fieldName={fieldName}
                contents={handlerEditorContent}
                selectedHandler={selectedHandler}
                onSave={onSave}
                onChange={onChange}
              />
            </div>
            <div className="flex items-start justify-end gap-2">
              {errorMessage && (
                <div className="flex h-full w-full items-center gap-1 border border-aux-red/20 bg-aux-red/10 p-1 text-2xs">
                  <IconTriangleAlert className="size-4 text-aux-red" />
                  {errorMessage}
                </div>
              )}
              <Dialog.Close asChild>
                <Button variant="destructive" className="rounded-sm">
                  Discard
                </Button>
              </Dialog.Close>
              <Button
                onClick={() => onSave(handlerEditorContent)}
                disabled={!isDirty}
                className="rounded-sm"
              >
                <div className="flex items-center justify-center gap-1">
                  Save <Kbd keys={[[ctrlKey, 'S']]} size="sm" />
                </div>
              </Button>
            </div>
          </div>
          <div className="col-span-2 flex h-full min-h-0 w-full">
            <HandlerSelector
              handlers={handlers}
              selectedHandler={selectedHandler}
              onSelectedHandlerChange={onSelectedHandlerChange}
            />
          </div>
        </div>
      </Dialog.Body>
    </Dialog.Root>
  )
}
