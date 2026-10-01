import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AddressLandingPage } from '../../components/AddressLandingPage'
import {
  type ChainAddress,
  ChainAddressField,
} from '../../components/ChainAddressField'
import { AVAILABLE_CHAINS } from '../../config/chains'
import { IconSwap } from '../../icons/IconSwap'
import { isValidEthereumAddress } from '../../utils/isValidEthereumAddress'

// biome-ignore lint/style/noNonNullAssertion: We know it's there
const DEFAULT_CHAIN_SHORT_NAME = AVAILABLE_CHAINS[0]!.shortName

export function AddressSelectionPage() {
  const navigate = useNavigate()
  const [before, setBefore] = useState<ChainAddress>({
    chain: DEFAULT_CHAIN_SHORT_NAME,
    address: '',
  })
  const [after, setAfter] = useState<ChainAddress>({
    chain: DEFAULT_CHAIN_SHORT_NAME,
    address: '',
  })
  const [submitted, setSubmitted] = useState(false)

  function changeBefore(next: ChainAddress) {
    if (after.address.trim() === '' && after.chain === before.chain) {
      setAfter({ ...after, chain: next.chain })
    }
    setBefore(next)
  }

  function swap() {
    setBefore(after)
    setAfter(before)
  }

  function diff() {
    setSubmitted(true)
    const beforeAddress = before.address.trim()
    const afterAddress = after.address.trim()
    if (!isValidEthereumAddress(beforeAddress)) {
      document.getElementById('before')?.focus()
      return
    }
    if (!isValidEthereumAddress(afterAddress)) {
      document.getElementById('after')?.focus()
      return
    }
    navigate(
      `/diff/${before.chain}:${beforeAddress}/${after.chain}:${afterAddress}`,
    )
  }

  return (
    <AddressLandingPage
      title="Diff - address selection"
      heading={
        <img className="h-12" src="/diffovery-logo.svg" alt="DIFFOVERY" />
      }
      description="Compare the flattened, verified source of two contracts."
      submitLabel="Compare"
      alternative={{ to: '/address', label: 'View a single contract instead' }}
      onSubmit={diff}
    >
      <ChainAddressField
        id="before"
        label="Before"
        value={before}
        submitted={submitted}
        autoFocus
        onChange={changeBefore}
      />
      <div className="-my-3 flex items-center gap-3">
        <div className="h-px flex-1 bg-coffee-600" />
        <button
          type="button"
          title="Swap before and after"
          aria-label="Swap before and after"
          onClick={swap}
          className="border border-coffee-600 p-1.5 text-coffee-400 transition-colors hover:border-coffee-400 hover:text-coffee-200"
        >
          <IconSwap className="size-4 rotate-90" />
        </button>
        <div className="h-px flex-1 bg-coffee-600" />
      </div>
      <ChainAddressField
        id="after"
        label="After"
        value={after}
        submitted={submitted}
        onChange={setAfter}
      />
    </AddressLandingPage>
  )
}
