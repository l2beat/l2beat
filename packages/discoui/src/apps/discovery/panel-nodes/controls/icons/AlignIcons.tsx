import { ControlIcon } from './ControlIcon'

// Alignment icons follow Excalidraw's visual language: a guide line on the
// edge the nodes snap to, plus two differently sized blocks resting on it.

export function IconAlignLeft(props: { className?: string }) {
  return (
    <ControlIcon {...props}>
      <path d="M2 2v12" />
      <rect x="4.5" y="3.5" width="9" height="3" rx=".75" />
      <rect x="4.5" y="9.5" width="5" height="3" rx=".75" />
    </ControlIcon>
  )
}

export function IconAlignRight(props: { className?: string }) {
  return (
    <ControlIcon {...props}>
      <path d="M14 2v12" />
      <rect x="2.5" y="3.5" width="9" height="3" rx=".75" />
      <rect x="6.5" y="9.5" width="5" height="3" rx=".75" />
    </ControlIcon>
  )
}

export function IconAlignTop(props: { className?: string }) {
  return (
    <ControlIcon {...props}>
      <path d="M2 2h12" />
      <rect x="3.5" y="4.5" width="3" height="9" rx=".75" />
      <rect x="9.5" y="4.5" width="3" height="5" rx=".75" />
    </ControlIcon>
  )
}

export function IconAlignBottom(props: { className?: string }) {
  return (
    <ControlIcon {...props}>
      <path d="M2 14h12" />
      <rect x="3.5" y="2.5" width="3" height="9" rx=".75" />
      <rect x="9.5" y="6.5" width="3" height="5" rx=".75" />
    </ControlIcon>
  )
}

export function IconDistributeHorizontal(props: { className?: string }) {
  return (
    <ControlIcon {...props}>
      <rect x="1.5" y="3.5" width="2.5" height="9" rx=".75" />
      <rect x="6.75" y="3.5" width="2.5" height="9" rx=".75" />
      <rect x="12" y="3.5" width="2.5" height="9" rx=".75" />
    </ControlIcon>
  )
}

export function IconDistributeVertical(props: { className?: string }) {
  return (
    <ControlIcon {...props}>
      <rect x="3.5" y="1.5" width="9" height="2.5" rx=".75" />
      <rect x="3.5" y="6.75" width="9" height="2.5" rx=".75" />
      <rect x="3.5" y="12" width="9" height="2.5" rx=".75" />
    </ControlIcon>
  )
}
