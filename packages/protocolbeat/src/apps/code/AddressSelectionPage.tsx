import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Title } from '../../components/Title'
import { AVAILABLE_CHAINS } from '../../config/chains'
import { isValidEthereumAddress } from '../../utils/isValidEthereumAddress'

// biome-ignore lint/style/noNonNullAssertion: We know it's there
const DEFAULT_CHAIN_SHORT_NAME = AVAILABLE_CHAINS[0]!.shortName

export function AddressSelectionPage() {
  const navigate = useNavigate()
  const [address, setAddress] = useState('')
  const [chain, setChain] = useState(DEFAULT_CHAIN_SHORT_NAME)
  const [errors, setErrors] = useState({ addressA: '' })

  const handleShow = () => {
    const trimmedA = address.trim()

    const newErrors = {
      addressA: isValidEthereumAddress(trimmedA)
        ? ''
        : 'Invalid Ethereum address',
    }

    setErrors(newErrors)

    if (!newErrors.addressA) {
      navigate(`/address/${chain}:${trimmedA}`)
    }
  }

  return (
    <>
      <Title title="Code - address selection" />
      <div className="flex min-h-screen flex-col items-center justify-center bg-coffee-900 p-4">
        <h1 className="my-8 flex justify-center">
          <img className="w-[200px] md:w-[400px]" src="/logo.svg" alt="CODE" />
        </h1>

        <div className="w-full max-w-2xl space-y-6 rounded-xl bg-coffee-800 p-6 text-coffee-200 shadow-lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex-1">
              <label
                htmlFor="addressA"
                className="mb-1 block font-medium text-sm"
              >
                Address A
              </label>
              <input
                id="addressA"
                type="text"
                placeholder="Enter address (0x...)"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value)
                  if (errors.addressA) {
                    setErrors((prev) => ({ ...prev, addressA: '' }))
                  }
                }}
                className={`w-full rounded-lg border ${
                  errors.addressA ? 'border-aux-red' : 'border-coffee-600'
                } bg-coffee-700 px-4 py-2 transition selection:bg-autumn-300 selection:text-coffee-900 placeholder:text-coffee-400 focus:ring-2 focus:ring-autumn-300`}
              />
              {errors.addressA && (
                <p className="mt-1 text-aux-red text-sm">{errors.addressA}</p>
              )}

              <select
                className="mt-2 w-full rounded-lg border border-coffee-600 bg-coffee-700 px-4 py-1 transition selection:bg-autumn-300 selection:text-coffee-900 placeholder:text-coffee-200 focus:ring-2 focus:ring-autumn-300"
                name="chainId"
                id="chainId"
                value={chain}
                onChange={(e) => {
                  setChain(e.target.value)
                }}
              >
                {AVAILABLE_CHAINS.map((c) => (
                  <option key={c.chainId} value={c.shortName}>
                    {c.chainId}: {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleShow}
            className="w-full rounded-lg bg-aux-blue px-4 py-3 font-medium shadow-md transition hover:bg-aux-purple focus:outline-none focus:ring-2 focus:ring-autumn-300 focus:ring-offset-2"
          >
            SHOW
          </button>
        </div>
      </div>
    </>
  )
}
