import { GrayedOut } from '../app/(side-nav)/scaling/finality/_components/table/grayed-out'

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
