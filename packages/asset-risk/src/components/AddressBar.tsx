'use client'

import { ConnectKitButton, useModal } from 'connectkit'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createPublicClient, http, isAddress } from 'viem'
import { mainnet } from 'viem/chains'
import { normalize } from 'viem/ens'
import { useDisconnect } from 'wagmi'

import { Skeleton } from './Skeleton'

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
    <div className="flex flex-col gap-8 items-center">
      <h1 className="text-center font-bold text-5xl">
        Get your Asset Risk Report
      </h1>
      <div>
        <div>
          <div className="max-w-[488px] relative">
            <Skeleton className="w-full h-12 rounded-md" />
            <ConnectKitButton.Custom>
              {({ isConnected, show, truncatedAddress, address, ensName }) => {
                return isConnected ? (
                  <div className="absolute top-0 w-full flex flex-row gap-2 bg-neutral-900">
                    <Link
                      href={`/wallet/${address}`}
                      className="w-full leading-8 text-center bg-brand-red-dark text-white h-12 px-4 py-2 rounded-md hover:bg-brand-red transition-colors text-ellipsis whitespace-nowrap overflow-hidden"
                    >
                      View report for {ensName ?? truncatedAddress}
                    </Link>
                    <button
                      onClick={() => disconnect()}
                      className="bg-brand-red-dark/50 text-white h-12 px-4 py-2 rounded-md hover:bg-brand-red transition-colors"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={isConnected ? () => disconnect() : show}
                    className="absolute top-0 w-full bg-brand-red-dark text-white h-12 px-4 py-2 rounded-md hover:bg-brand-red transition-colors"
                  >
                    {isConnected ? address : 'Connect a wallet'}
                  </button>
                )
              }}
            </ConnectKitButton.Custom>
          </div>
        </div>
        <div className="flex flex-row w-full items-center py-4">
          <div className="bg-neutral-700 h-px flex-1" />
          <div className="text-xs px-2">or</div>
          <div className="bg-neutral-700 h-px flex-1" />
        </div>
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
            className="border border-brand-red-dark rounded-md p-3 w-3/4 md:w-96 bg-gray-100 dark:bg-zinc-900 focus:active:ring-0 outline-none placeholder:text-black/50 dark:placeholder:text-white/50 font-medium focus:ring-1 duration-100 ring-brand-red transition-all"
          />
          <button
            onClick={handleWallet}
            className="bg-brand-red-dark text-white h-12 px-4 py-2 rounded-md w-24 hover:bg-brand-red transition-colors"
          >
            Search
          </button>
        </div>
        {error && <span className="text-brand-red">{error}</span>}
      </div>
    </div>
  )
}
