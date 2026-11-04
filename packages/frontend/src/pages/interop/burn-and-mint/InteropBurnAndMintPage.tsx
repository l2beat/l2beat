import {
  InteropTransferTypePage,
  type InteropTransferTypePageProps,
} from '../components/InteropTransferTypePage'

export function InteropBurnAndMintPage(props: InteropTransferTypePageProps) {
  return <InteropTransferTypePage {...props} type="burnAndMint" />
}
