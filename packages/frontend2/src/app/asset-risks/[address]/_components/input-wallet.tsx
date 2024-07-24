'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { http, createPublicClient, isAddress } from 'viem'
import { mainnet } from 'viem/chains'
import { normalize } from 'viem/ens'
import LensIcon from '~/icons/lens.svg'

export function InputWallet() {
  const [address, setAddress] = useState('')
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
      setAddress('')
    } else if (!isAddress(address)) {
      return
    } else {
      router.push(`/asset-risks/${address}`)
    }
  }

  return (
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
        className="w-[min(45vw,450px)] rounded-md border border-[#C0C1C7] bg-gray-100 py-2 pl-4 pr-10 outline-none transition-colors duration-100 placeholder:text-zinc-500 focus:border-gray-500 dark:bg-zinc-900 dark:placeholder:text-white/50 dark:focus:border-white"
      />
      <div
        className="absolute right-2.5 top-3 cursor-pointer"
        onClick={() => handleWallet()}
      >
        <LensIcon />
      </div>
    </div>
  )
}
