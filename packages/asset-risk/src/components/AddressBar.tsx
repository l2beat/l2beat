'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createPublicClient, http, isAddress } from 'viem'
import { mainnet } from 'viem/chains'
import { normalize } from 'viem/ens'

export function AddressBar() {
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(),
  })

  const handleWallet = async () => {
    const ensAddress = await publicClient.getEnsAddress({
      name: normalize(address),
    })
    if (ensAddress) {
      router.push(`/wallet/${ensAddress}`)
    } else if (!isAddress(address)) {
      setError('Invalid address')
      return
    } else {
      router.push(`/wallet/${address}`)
    }
  }

  return (
    <div className="flex flex-col items-start h-20">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              void handleWallet()
            }
          }}
          placeholder="Input address or ENS name"
          className="border border-pink-900 rounded-md p-3 w-3/4 md:w-96 bg-gray-100 dark:bg-zinc-900 focus:active:ring-0 outline-none placeholder:text-black/50 dark:placeholder:text-white/50 font-medium focus:ring-1 duration-100 ring-pink-900 transition-all"
        />
        <button
          onClick={handleWallet}
          className="bg-pink-900 text-white h-12 px-4 py-2 rounded-md w-24 hover:bg-pink-800"
        >
          Search
        </button>
      </div>
      {error && <span className="text-red-300">{error}</span>}
    </div>
  )
}
