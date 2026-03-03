import { MainPageHeader } from '~/components/MainPageHeader'
import { interopDescriptions } from '~/pages/interop/descriptions'

export function HeaderWithDescription() {
  return (
    <MainPageHeader description={interopDescriptions.nonMinting}>
      Non-minting Protocols
    </MainPageHeader>
  )
}
