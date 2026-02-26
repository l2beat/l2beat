import { MainPageHeader } from '~/components/MainPageHeader'
import { interopDescriptions } from '~/pages/interop/descriptions'

export function HeaderWithDescription() {
  return (
    <MainPageHeader description={interopDescriptions.burnAndMint}>
      Burn & Mint Protocols
    </MainPageHeader>
  )
}
