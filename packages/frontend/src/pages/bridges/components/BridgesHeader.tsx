import { MainPageHeader } from '~/components/MainPageHeader'
import { BridgesMvpWarning } from '../project/components/BridgesMvpWarning'

export function BridgesHeader({ children }: { children: string }) {
  return (
    <>
      <MainPageHeader>{children}</MainPageHeader>
      <BridgesMvpWarning className="max-md:rounded-none max-md:border-x-0 max-md:border-t-0 md:mb-3" />
    </>
  )
}
