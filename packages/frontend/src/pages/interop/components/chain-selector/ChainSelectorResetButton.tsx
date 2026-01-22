import { useInteropSelectedChains } from '../../utils/InteropSelectedChainsContext'

export function ChainSelectorResetButton() {
  const { reset } = useInteropSelectedChains()

  return (
    <button
      className="h-12 w-full max-w-[340px] rounded bg-brand font-semibold text-label-value-16 text-white"
      onClick={reset}
    >
      Reset selection to default
    </button>
  )
}
