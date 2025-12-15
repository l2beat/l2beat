import { Dialog } from '../../../../components/Dialog'
import { EditorView } from '../../../../components/editor/views/EditorView'
import { IconEdit } from '../../../../icons/IconEdit'
import { useConfigModels } from '../../hooks/useConfigModels'

type Props = {
  context: 'config' | 'template'
  fieldName: string
}

export function FieldHandlerConfigDialog({ context, fieldName }: Props) {
  const models = useConfigModels()

  const model = context === 'config' ? models.configModel : models.templateModel

  const handler = model.getFieldHandler(fieldName)

  const editorKey = `handler-${context}-${fieldName}`

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <div className="absolute top-0 right-0 hidden h-full w-full cursor-pointer items-center justify-center bg-coffee-700/50 group-hover:flex">
          <IconEdit className="size-4 text-coffee-200/80" />
        </div>
      </Dialog.Trigger>
      <Dialog.Body className="h-full max-w-full">
        <Dialog.Title>Handler</Dialog.Title>
        <div className="grid h-full grid-cols-2 gap-2">
          <div className="h-3/4 w-full">
            <EditorView
              features={{ lineSelection: false, rangeHighlight: false }}
              editorId={editorKey}
              callbacks={{
                onSave: (content) => {
                  model.setFieldHandler(fieldName, JSON.parse(content))
                  return content
                },
              }}
              files={[
                {
                  id: editorKey,
                  name: `handler.${context}.${fieldName}`, // doesn't matter, it's not used
                  content: JSON.stringify(handler, null, 2),
                  readOnly: false,
                  language: 'json',
                },
              ]}
            />
          </div>
        </div>
      </Dialog.Body>
    </Dialog.Root>
  )
}
