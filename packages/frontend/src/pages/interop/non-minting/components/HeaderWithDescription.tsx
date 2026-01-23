import { MainPageHeader } from '~/components/MainPageHeader'

export function HeaderWithDescription() {
  return (
    <MainPageHeader
      description="In-light risk only. Tokens are therefore first bridged using a different
          minting bridge that needs to be separately assessed."
    >
      Non-minting Protocols
    </MainPageHeader>
  )
}
