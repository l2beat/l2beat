import { ControlIcon } from './ControlIcon'

export function IconControlFlow(props: { className?: string }) {
  return (
    <ControlIcon {...props}>
      <rect x="1.5" y="2" width="4" height="7.5" rx=".75" />
      <rect x="10.5" y="2.25" width="4" height="3.5" rx=".75" />
      <rect x="10.5" y="10.25" width="4" height="3.5" rx=".75" />
      <path d="M5.5 4h5M5.5 7.25C8 7.25 8 12 10.5 12" />
    </ControlIcon>
  )
}
