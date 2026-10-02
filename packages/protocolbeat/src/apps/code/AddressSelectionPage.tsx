import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AddressLandingPage } from '../../components/AddressLandingPage'
import {
  type ChainAddress,
  ChainAddressField,
  parseChainAddress,
} from '../../components/ChainAddressField'
import { AVAILABLE_CHAINS } from '../../config/chains'

// biome-ignore lint/style/noNonNullAssertion: We know it's there
const DEFAULT_CHAIN_SHORT_NAME = AVAILABLE_CHAINS[0]!.shortName

export function AddressSelectionPage() {
  const navigate = useNavigate()
  const [target, setTarget] = useState<ChainAddress>({
    chain: DEFAULT_CHAIN_SHORT_NAME,
    address: '',
  })
  const [submitted, setSubmitted] = useState(false)

  function show() {
    setSubmitted(true)
    const address = parseChainAddress(target)
    if (address === undefined) {
      document.getElementById('address')?.focus()
      return
    }
    navigate(`/address/${address}`)
  }

  return (
    <AddressLandingPage
      title="Code - address selection"
      heading={<span className="font-bold text-4xl tracking-tight">Code</span>}
      description="Read the flattened, verified source of a contract."
      submitLabel="Show code"
      alternative={{ to: '/diff', label: 'Compare two contracts instead' }}
      onSubmit={show}
    >
      <ChainAddressField
        id="address"
        label="Contract"
        value={target}
        submitted={submitted}
        autoFocus
        onChange={setTarget}
      />
    </AddressLandingPage>
  )
}
