import clsx from 'clsx'
import { Icon } from './Icon'

export function IconGear(props: { className?: string }) {
  return (
    <Icon
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </Icon>
  )
}

export function IconGears(props: {
  containerClassName?: string
  className?: string
  animate?: boolean
}) {
  return (
    <div className={clsx('relative', 'size-4', props.containerClassName)}>
      <div
        className={clsx(
          '-translate-x-3/4 -translate-y-1/4 absolute top-1/2 left-1/2',
          props.className,
        )}
      >
        <IconGear
          className={clsx(props.animate && 'animate-spin', 'size-2.5')}
        />
      </div>
      <div
        className={clsx(
          '-translate-x-1/4 -translate-y-3/4 absolute top-1/2 left-1/2',
          props.className,
        )}
      >
        <IconGear
          className={clsx(props.animate && 'animate-spin-reverse', 'size-2.5')}
        />
      </div>
    </div>
  )
}
