import { MainPageHeader } from '~/components/MainPageHeader'
import { TRANSFER_TYPE_DISPLAY } from '../../utils/display'

export function HeaderWithDescription() {
  return (
    <MainPageHeader description={TRANSFER_TYPE_DISPLAY.burnAndMint.description}>
      Burn & Mint Protocols
    </MainPageHeader>
  )
}
