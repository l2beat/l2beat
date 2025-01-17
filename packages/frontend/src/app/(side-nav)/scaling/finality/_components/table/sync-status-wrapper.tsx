import { GrayedOut } from './grayed-out'

interface Props {
  isSynced: boolean | undefined
  children: React.ReactNode
}
export function SyncStatusWrapper({ isSynced, children }: Props) {
  if (isSynced) {
    return children
  }

  return <GrayedOut>{children}</GrayedOut>
}
