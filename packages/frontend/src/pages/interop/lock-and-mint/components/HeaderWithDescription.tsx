import { MainPageHeader } from '~/components/MainPageHeader'
import { interopDescriptions } from '~/pages/interop/descriptions'

export function HeaderWithDescription() {
  return (
    <MainPageHeader description={interopDescriptions.lockAndMint}>
      Lock & Mint Protocols
    </MainPageHeader>
  )
}
