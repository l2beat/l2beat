import { Button } from '../../../components/Button'
import { IconClose } from '../../../icons/IconClose'
import { cn } from '../../../utils/cn'

export function FieldTag(props: {
  source: 'config' | 'template' | 'legacy'
  children: React.ReactNode
  onRemoveClick?: () => void
}) {
  return (
    <span className="flex max-w-fit items-center justify-center overflow-hidden rounded-xs bg-aux-blue/15 text-aux-blue">
      <div className="py-0.5 pl-1.5 font-medium font-mono text-[10px] leading-3">
        {props.children}
      </div>
      <span
        className={cn(
          'select-none px-1 py-0.5 font-mono font-semibold text-[10px] leading-3',
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
    return 'bg-aux-cyan/15 text-aux-cyan'
  }
  if (source === 'template') {
    return 'bg-aux-green/15 text-aux-green'
  }
  return 'bg-aux-red/15 text-aux-red'
}
