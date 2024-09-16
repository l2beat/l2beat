'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { http, createPublicClient, isAddress } from 'viem'
import { mainnet } from 'viem/chains'
import { normalize } from 'viem/ens'
import { LensIcon } from '~/icons/lens'
import { cn } from '~/utils/cn'

export function AddressForm() {
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
      router.push(`/asset-risks/${ensAddress}`)
    } else if (!isAddress(address)) {
      setError('Invalid address')
      return
    } else {
      router.push(`/asset-risks/${address}`)
    }
  }

  return (
    <div className="flex w-full flex-col">
      <div className="relative">
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
          className={cn(
            'h-14 w-full py-5 pl-5 pr-10',
            'rounded-lg border border-gray-50 outline-none transition-colors duration-100',
            'font-medium text-gray-500 placeholder:text-gray-50',
            'focus:border-zinc-500 focus:bg-gray-100 focus:text-zinc-800 focus:placeholder:text-zinc-500',
          )}
        />
        <div
          className="absolute right-[18px] top-[18px] text-gray-50"
          onClick={() => handleWallet()}
        >
          <LensIcon className="fill-gray-50" />
        </div>
        {error && (
          <span className="text-xs font-medium text-red-600">{error}</span>
        )}
      </div>
    </div>
  )
}
