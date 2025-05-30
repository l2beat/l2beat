import { MainPageHeader } from '~/components/main-page-header'
import { bridgeWarningContext } from '~/pages/bridges/project/components/bridges-mvp-warning'

export function BridgesHeader({ children }: { children: string }) {
  return (
    <MainPageHeader warning={bridgeWarningContext}>{children}</MainPageHeader>
  )
}
