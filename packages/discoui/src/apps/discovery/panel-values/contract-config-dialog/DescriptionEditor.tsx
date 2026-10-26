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
      <TextArea
        value={interpolateDescription(description)}
        placeholder="Preview"
        className="bg-coffee-700/50 selection:bg-coffee-600"
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
        >
          <IconClose className="size-4 text-coffee-200/80" />
        </Button>
      </div>
    </div>
  )
}
