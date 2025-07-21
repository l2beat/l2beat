// biome-ignore lint/style/noNonNullAssertion: We know it's there
const DEFAULT_CHAIN_SHORT_NAME = AVAILABLE_CHAINS[0]!.shortName

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AVAILABLE_CHAINS } from '../common/chains'
import { Title } from '../common/Title'
import { IconSwap } from '../icons/IconSwap'

function isValidEthereumAddress(address: string) {
  const trimmed = address.trim()
  const regex = /^0x[a-fA-F0-9]{40}$/
  return regex.test(trimmed)
}

export function AddressSelectionPage() {
  const navigate = useNavigate()
  const [addressA, setAddressA] = useState('')
  const [addressB, setAddressB] = useState('')
  const [chainA, setChainA] = useState(DEFAULT_CHAIN_SHORT_NAME)
  const [chainB, setChainB] = useState(DEFAULT_CHAIN_SHORT_NAME)
  const [errors, setErrors] = useState({ addressA: '', addressB: '' })

  const handleDiff = () => {
    const trimmedA = addressA.trim()
    const trimmedB = addressB.trim()

    const newErrors = {
      addressA: isValidEthereumAddress(trimmedA)
        ? ''
        : 'Invalid Ethereum address',
      addressB: isValidEthereumAddress(trimmedB)
        ? ''
        : 'Invalid Ethereum address',
    }

    setErrors(newErrors)

    if (!newErrors.addressA && !newErrors.addressB) {
      navigate(`/diff/${chainA}:${trimmedA}/${chainB}:${trimmedB}`)
    }
  }

  return (
    <>
      <Title title="Diff - address selection" />
      <div className="flex min-h-screen flex-col items-center justify-center bg-coffee-900 p-4">
        <h1 className="my-8 flex justify-center">
          <img
            className="w-[200px] md:w-[400px]"
            src="/diffovery-logo.svg"
            alt="DIFFOVERY"
          />
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
                placeholder="Enter left address (0x...)"
                value={addressA}
                onChange={(e) => {
                  setAddressA(e.target.value)
                  if (errors.addressA) {
                    setErrors((prev) => ({ ...prev, addressA: '' }))
                  }
                }}
                className={`w-full rounded-lg border ${
                  errors.addressA ? 'border-aux-red' : 'border-coffee-600'
                } bg-coffee-700 px-4 py-2 transition selection:bg-autumn-300 selection:text-coffee-900 placeholder:text-coffee-200 placeholder:text-coffee-400 focus:ring-2 focus:ring-autumn-300`}
              />
              {errors.addressA && (
                <p className="mt-1 text-aux-red text-sm">{errors.addressA}</p>
              )}

              <select
                className="mt-2 w-full rounded-lg border border-coffee-600 bg-coffee-700 px-4 py-1 transition selection:bg-autumn-300 selection:text-coffee-900 placeholder:text-coffee-200 focus:ring-2 focus:ring-autumn-300"
                name="chainId"
                id="chainId"
                value={chainA}
                onChange={(e) => {
                  if (chainA === chainB) {
                    setChainB(e.target.value)
                  }
                  setChainA(e.target.value)
                }}
              >
                {AVAILABLE_CHAINS.map((c) => (
                  <option key={c.chainId} value={c.shortName}>
                    {c.chainId}: {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                const temp = addressA
                setAddressA(addressB)
                setAddressB(temp)

                const { addressA: tempA, addressB: tempB } = errors
                setErrors({ addressA: tempB, addressB: tempA })
              }}
              className="self-center rounded-full p-2 transition-colors hover:bg-coffee-700 sm:mt-7"
            >
              <IconSwap className="size-6" />
            </button>

            <div className="flex-1">
              <label
                htmlFor="addressB"
                className="mb-1 block font-medium text-sm"
              >
                Address B
              </label>
              <input
                id="addressB"
                type="text"
                placeholder="Enter right address (0x...)"
                value={addressB}
                onChange={(e) => {
                  setAddressB(e.target.value)
                  if (errors.addressB) {
                    setErrors((prev) => ({ ...prev, addressB: '' }))
                  }
                }}
                className={`w-full rounded-lg border ${
                  errors.addressB ? 'border-aux-red' : 'border-coffee-600'
                } bg-coffee-700 px-4 py-2 transition selection:bg-autumn-300 selection:text-coffee-900 placeholder:text-coffee-200 placeholder:text-coffee-400 focus:ring-2 focus:ring-autumn-300`}
              />
              {errors.addressB && (
                <p className="mt-1 text-aux-red text-sm">{errors.addressB}</p>
              )}

              <select
                className="mt-2 w-full rounded-lg border border-coffee-600 bg-coffee-700 px-4 py-1 transition selection:bg-autumn-300 selection:text-coffee-900 placeholder:text-coffee-200 focus:ring-2 focus:ring-autumn-300"
                name="chainId"
                id="chainId"
                value={chainB}
                onChange={(e) => setChainB(e.target.value)}
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
            onClick={handleDiff}
            className="w-full rounded-lg bg-aux-blue px-4 py-3 font-medium shadow-md transition hover:bg-aux-purple focus:outline-none focus:ring-2 focus:ring-autumn-300 focus:ring-offset-2"
          >
            DIFF
          </button>
        </div>
      </div>
    </>
  )
}
