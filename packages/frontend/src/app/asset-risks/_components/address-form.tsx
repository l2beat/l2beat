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
  const [error, setError] = useState<string | undefined>(undefined)
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
    <div className="flex w-full max-w-[560px] flex-col">
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
          // TODO: Probably use sonner for this
          placeholder={error ?? 'Input address or ENS name'}
          className={cn(
            'peer h-14 w-full py-5 pl-5 pr-10',
            'bg-[#1F1F38] font-medium text-white',
            error ? 'placeholder:text-red-600' : 'placeholder:text-[#74749F]',
            'rounded-[28px] border border-[#32326A] outline-none transition-colors duration-200 focus:border-[#5959B1]',
          )}
        />
        <button
          className="absolute right-[18px] top-[18px] peer-focus:[&>svg]:fill-white"
          onClick={() => handleWallet()}
        >
          <LensIcon className="fill-[#74749F] transition-colors duration-200" />
        </button>
      </div>
    </div>
  )
}
