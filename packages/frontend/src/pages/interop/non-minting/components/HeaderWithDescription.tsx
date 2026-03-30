import { MainPageHeader } from '~/components/MainPageHeader'
import { TRANSFER_TYPE_DISPLAY } from '../../utils/display'

export function HeaderWithDescription() {
  return (
    <MainPageHeader description={TRANSFER_TYPE_DISPLAY.nonMinting.description}>
      Non-minting Protocols
    </MainPageHeader>
  )
}
