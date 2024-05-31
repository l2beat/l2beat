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
        className="border bg-gray-100 dark:bg-zinc-900 border-[#C0C1C7] rounded-md pl-4 pr-10 py-2 w-[min(45vw,450px)] outline-none placeholder:text-zinc-500 dark:placeholder:text-white/50 focus:border-gray-500 dark:focus:border-white duration-100 transition-colors"
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
