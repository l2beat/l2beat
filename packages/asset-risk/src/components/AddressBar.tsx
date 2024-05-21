'use client'

import { ConnectKitButton, useModal } from 'connectkit'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { http, createPublicClient, isAddress } from 'viem'
import { mainnet } from 'viem/chains'
import { normalize } from 'viem/ens'
import { useDisconnect } from 'wagmi'
import { LensIcon } from '~/app/assets/LensIcon'
import { cn } from '~/utils/cn'

export function AddressBar() {
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(),
  })

  const { disconnect } = useDisconnect()

  useModal({
    onConnect: ({ address }) => {
      router.push(`/wallet/${address}`)
    },
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
    <div className="flex flex-col w-[min(60vw,320px)] gap-2 max-w-[488px]">
      <ConnectKitButton.Custom>
        {({ isConnected, show, truncatedAddress, address, ensName }) => {
          return isConnected ? (
            <div className="w-full flex flex-row gap-2">
              <Link
                href={`/wallet/${address}`}
                className="w-3/4 bg-pink-900 text-white font-medium text-base h-14 px-4 rounded-lg transition-colors flex items-center justify-center text-center"
              >
                View report for {ensName ?? truncatedAddress}
              </Link>
              <button
                onClick={() => disconnect()}
                className="w-1/4 bg-pink-900 text-white font-medium text-2xs h-14 px-4 rounded-lg transition-colors flex items-center justify-center text-center"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={show}
              className="w-full bg-pink-900 text-white font-medium text-base h-14 px-4 rounded-lg transition-colors"
            >
              Connect a wallet
            </button>
          )
        }}
      </ConnectKitButton.Custom>
      <div className="flex flex-row w-full items-center">
        <div className="bg-gray-50 h-px flex-1" />
        <div className="text-xs text-gray-50 px-2">OR</div>
        <div className="bg-gray-50 h-px flex-1" />
      </div>
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
            'border border-gray-50 outline-none rounded-lg',
            'text-gray-500 placeholder:text-gray-50 font-medium',
          )}
        />
        <div
          className="absolute right-[18px] top-[18px] text-gray-50"
          onClick={() => handleWallet()}
        >
          <LensIcon className="fill-gray-50" />
        </div>
        {error && <span className="text-brand-red">{error}</span>}
      </div>
    </div>
  )
}
