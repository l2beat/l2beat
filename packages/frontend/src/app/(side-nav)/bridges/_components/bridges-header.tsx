import { bridgeWarningContext } from '~/app/(top-nav)/bridges/projects/[slug]/_components/bridges-mvp-warning'
import { MainPageHeader } from '~/components/main-page-header'

export function BridgesHeader({ children }: { children: string }) {
  return (
    <MainPageHeader warning={bridgeWarningContext}>{children}</MainPageHeader>
  )
}
