import {
  InteropTransferTypePage,
  type InteropTransferTypePageProps,
} from '../components/InteropTransferTypePage'

export function InteropNonMintingPage(props: InteropTransferTypePageProps) {
  return <InteropTransferTypePage {...props} type="nonMinting" />
}
