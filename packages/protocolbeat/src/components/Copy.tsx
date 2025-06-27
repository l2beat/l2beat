import clsx from 'clsx'
import { useCopy } from '../hooks/useCopy'
import { IconCopy } from '../icons/IconCopy'
import { IconTick } from '../icons/IconTick'

export function Copy(props: {
  value: string
  className?: string
  timeoutMs?: number
}) {
  const { copied, setCopied } = useCopy(props.value, props.timeoutMs)

  return (
    <button
      className={clsx('block h-4 w-4', props.className)}
      onClick={(e) => {
        e.preventDefault()
        setCopied(true)
      }}
    >
      {!copied && (
        <IconCopy className="relative top-[3px] block text-coffee-600" />
      )}
      {copied && (
        <IconTick className="relative top-[3px] block text-aux-green" />
      )}
    </button>
  )
}
