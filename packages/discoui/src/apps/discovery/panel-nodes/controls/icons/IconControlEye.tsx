import { ControlIcon } from './ControlIcon'

export function IconControlEye(props: { className?: string }) {
  return (
    <ControlIcon {...props}>
      <path d="M1.75 8C3.15 5.35 5.45 4 8 4c2.55 0 4.85 1.35 6.25 4-1.4 2.65-3.7 4-6.25 4-2.55 0-4.85-1.35-6.25-4z" />
      <circle cx="8" cy="8" r="2" />
    </ControlIcon>
  )
}
