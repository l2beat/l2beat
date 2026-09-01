import { Icon } from '../../../../../icons/Icon'

// Alignment icons follow Excalidraw's visual language: a guide bar on the
// edge the nodes snap to, plus two differently sized blocks resting on it.

export function IconAlignLeft(props: { className?: string }) {
  return (
    <Icon fill="currentColor" {...props}>
      <rect x="1.5" y="2" width="1.2" height="12" rx="0.4" />
      <rect x="4" y="3.5" width="9" height="3.2" rx="0.6" />
      <rect x="4" y="9.3" width="5" height="3.2" rx="0.6" />
    </Icon>
  )
}

export function IconAlignRight(props: { className?: string }) {
  return (
    <Icon fill="currentColor" {...props}>
      <rect x="13.3" y="2" width="1.2" height="12" rx="0.4" />
      <rect x="3" y="3.5" width="9" height="3.2" rx="0.6" />
      <rect x="7" y="9.3" width="5" height="3.2" rx="0.6" />
    </Icon>
  )
}

export function IconAlignTop(props: { className?: string }) {
  return (
    <Icon fill="currentColor" {...props}>
      <rect x="2" y="1.5" width="12" height="1.2" rx="0.4" />
      <rect x="3.5" y="4" width="3.2" height="9" rx="0.6" />
      <rect x="9.3" y="4" width="3.2" height="5" rx="0.6" />
    </Icon>
  )
}

export function IconAlignBottom(props: { className?: string }) {
  return (
    <Icon fill="currentColor" {...props}>
      <rect x="2" y="13.3" width="12" height="1.2" rx="0.4" />
      <rect x="3.5" y="3" width="3.2" height="9" rx="0.6" />
      <rect x="9.3" y="7" width="3.2" height="5" rx="0.6" />
    </Icon>
  )
}

export function IconDistributeHorizontal(props: { className?: string }) {
  return (
    <Icon fill="currentColor" {...props}>
      <rect x="1.5" y="3" width="2.5" height="10" rx="0.6" />
      <rect x="6.75" y="3" width="2.5" height="10" rx="0.6" />
      <rect x="12" y="3" width="2.5" height="10" rx="0.6" />
    </Icon>
  )
}

export function IconDistributeVertical(props: { className?: string }) {
  return (
    <Icon fill="currentColor" {...props}>
      <rect x="3" y="1.5" width="10" height="2.5" rx="0.6" />
      <rect x="3" y="6.75" width="10" height="2.5" rx="0.6" />
      <rect x="3" y="12" width="10" height="2.5" rx="0.6" />
    </Icon>
  )
}
