import { useEffect, useMemo, useState } from 'react'
import { Button } from '../../../../components/Button'
import { TextArea } from '../../../../components/TextArea'
import { IconClose } from '../../../../icons/IconClose'
import { IconTick } from '../../../../icons/IconTick'
import { useModelUtils } from '../../hooks/useModelUtils'

type Props = {
  content: string | undefined
  setContent: (content: string | undefined) => void
}

export function DescriptionEditor(props: Props) {
  const { interpolateDescription } = useModelUtils()
  const [description, setDescription] = useState(props.content ?? '')

  const isDirty = useMemo(() => {
    return (props.content ?? '') !== description
  }, [props.content, description])

  useEffect(() => {
    setDescription(props.content ?? '')
  }, [props.content])

  return (
    <div className="flex flex-col gap-1">
      <TextArea
        value={description ?? ''}
        onChange={(e) => setDescription(e.target.value ?? undefined)}
        placeholder="No description"
      />
      <span className="mt-0.5 text-[11px] text-coffee-400 leading-4">
        Preview
      </span>
      <TextArea
        value={interpolateDescription(description)}
        placeholder="Nothing to preview"
        aria-label="Preview"
        className="cursor-default resize-none border-coffee-700 bg-coffee-900 text-coffee-300"
        readOnly
      />
      <div className="flex w-full justify-end">
        <Button
          variant="icon"
          size="icon"
          onClick={() => {
            props.setContent(description)
          }}
          disabled={!isDirty}
          title="Save description"
          aria-label="Save description"
        >
          <IconTick className="size-4 text-coffee-200/80" />
        </Button>
        <Button
          variant="icon"
          size="icon"
          onClick={() => {
            setDescription('')
            props.setContent(undefined)
          }}
          disabled={description === '' && props.content === undefined}
          title="Clear description"
          aria-label="Clear description"
        >
          <IconClose className="size-4 text-coffee-200/80" />
        </Button>
      </div>
    </div>
  )
}
