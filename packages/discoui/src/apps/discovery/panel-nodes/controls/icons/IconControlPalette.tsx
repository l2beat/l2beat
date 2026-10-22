import { ControlIcon } from './ControlIcon'

export function IconControlPalette(props: { className?: string }) {
  return (
    <ControlIcon {...props}>
      <path d="M8 14.67A6.67 6.67 0 1 1 8 1.33c3.68 0 6.67 2.68 6.67 6 0 1.84-1.5 3.34-3.34 3.34H9.83a1.17 1.17 0 0 0-.93 1.87l.2.26a1.17 1.17 0 0 1-.93 1.87z" />
      <circle cx="9" cy="4.33" r=".5" />
      <circle cx="11.67" cy="7" r=".5" />
      <circle cx="4.33" cy="8.33" r=".5" />
      <circle cx="5.67" cy="5" r=".5" />
    </ControlIcon>
  )
}
