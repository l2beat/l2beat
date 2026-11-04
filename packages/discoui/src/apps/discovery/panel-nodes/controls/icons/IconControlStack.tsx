import { ControlIcon } from './ControlIcon'

// Stack layout places nodes in columns by depth, so the icon is a tree that
// grows to the right.
export function IconControlStack(props: { className?: string }) {
  return (
    <ControlIcon {...props}>
      <rect x="1.5" y="6.25" width="4" height="3.5" rx=".75" />
      <rect x="10.5" y="2" width="4" height="3.5" rx=".75" />
      <rect x="10.5" y="10.5" width="4" height="3.5" rx=".75" />
      <path d="M5.5 8H8M8 3.75v8.5M8 3.75h2.5M8 12.25h2.5" />
    </ControlIcon>
  )
}
