import clsx from 'clsx'
import { Button } from '../../../components/Button'
import { IconClose } from '../../../icons/IconClose'

export function FieldTag(props: {
  source: 'config' | 'template' | 'legacy'
  children: React.ReactNode
  onRemoveClick?: () => void
}) {
  return (
    <span className="flex max-w-fit items-center justify-center gap-1 rounded-sm bg-aux-blue text-coffee-800">
      <div className="py-0.5 pl-1 font-bold font-mono text-[10px]">
        {props.children}
      </div>
      <span
        className={clsx(
          'w-4 select-none px-1 py-0.5 font-normal last:rounded-r-sm',
          toTagColor(props.source),
        )}
      >
        {props.source.at(0)?.toUpperCase()}
      </span>
      {props.onRemoveClick && (
        <Button
          onClick={props.onRemoveClick}
          variant="icon"
          size="icon"
          className="pr-1"
        >
          <IconClose />
        </Button>
      )}
    </span>
  )
}

function toTagColor(source: 'config' | 'template' | 'legacy') {
  if (source === 'config') {
    return 'bg-aux-cyan'
  }
  if (source === 'template') {
    return 'bg-aux-green'
  }
  return 'bg-aux-red'
}
