import { MainPageHeader } from '~/components/MainPageHeader'
import { bridgeWarningContext } from '~/pages/bridges/project/components/BridgesMvpWarning'

export function BridgesHeader({ children }: { children: string }) {
  return (
    <MainPageHeader warning={bridgeWarningContext}>{children}</MainPageHeader>
  )
}
