import { ControlIcon } from './ControlIcon'

// Drawn on a 24 grid; a 1.5 stroke renders as the 1px line of the 16 grid.
export function IconControlUngroup(props: { className?: string }) {
  return (
    <ControlIcon viewBox="0 0 24 24" strokeWidth="1.5" {...props}>
      <rect width="8" height="6" x="5" y="4" rx="1" />
      <rect width="8" height="6" x="11" y="14" rx="1" />
    </ControlIcon>
  )
}
