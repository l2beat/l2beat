import { ControlIcon } from './ControlIcon'

export function IconControlPerimeter(props: { className?: string }) {
  return (
    <ControlIcon {...props}>
      <rect
        x="2"
        y="2.5"
        width="8.5"
        height="11"
        rx="1.75"
        strokeDasharray="2.5 1.75"
      />
      <rect x="4.5" y="5.5" width="3.5" height="5" rx=".75" />
      <rect x="12.5" y="6" width="2" height="4" rx=".5" />
    </ControlIcon>
  )
}
