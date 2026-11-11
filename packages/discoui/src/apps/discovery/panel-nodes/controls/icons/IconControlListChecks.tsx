import { ControlIcon } from './ControlIcon'

export function IconControlListChecks(props: { className?: string }) {
  return (
    <ControlIcon {...props}>
      <path d="M2 4l1.25 1.25L5.5 3" />
      <path d="M2 11l1.25 1.25L5.5 10" />
      <path d="M8 4.25h6" />
      <path d="M8 8h6" />
      <path d="M8 11.75h6" />
    </ControlIcon>
  )
}
