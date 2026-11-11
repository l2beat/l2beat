import {
  InteropTransferTypePage,
  type InteropTransferTypePageProps,
} from '../components/InteropTransferTypePage'

export function InteropLockAndMintPage(props: InteropTransferTypePageProps) {
  return <InteropTransferTypePage {...props} type="lockAndMint" />
}
