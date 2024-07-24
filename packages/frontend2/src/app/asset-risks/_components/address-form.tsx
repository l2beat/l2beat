'use client'

import { ConnectKitButton, useModal } from 'connectkit'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { http, createPublicClient, isAddress } from 'viem'
import { mainnet } from 'viem/chains'
import { normalize } from 'viem/ens'
import { useDisconnect } from 'wagmi'
import ClipboardIcon from '~/icons/clipboard.svg'
import LensIcon from '~/icons/lens.svg'
import { cn } from '~/utils/cn'

export function AddressForm() {
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
      router.push(`/asset-risks/${address}`)
    },
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
    <div className="flex w-full flex-col gap-2">
      <ConnectKitButton.Custom>
        {({ isConnected, show, truncatedAddress, address, ensName }) => {
          return isConnected ? (
            <div className="flex w-full flex-col gap-2 sm:flex-row">
              <div className="flex h-14 w-full items-center justify-between rounded-lg border border-pink-900 bg-purple-300 px-5 py-[14px] text-zinc-800 sm:w-3/5">
                <div className="flex flex-col">
                  <span className="text-3xs font-medium uppercase leading-[10px]">
                    Connected wallet
                  </span>
                  <span className="text-base font-bold">
                    {ensName ?? truncatedAddress}
                  </span>
                </div>
                <div className="cursor-pointer" onClick={() => disconnect()}>
                  <ClipboardIcon />
                </div>
              </div>
              <Link
                href={`/asset-risks/${address}`}
                className="flex h-14 w-full items-center justify-center rounded-lg bg-pink-900 px-4 text-base font-bold text-white transition-colors  sm:w-2/5"
              >
                View report
              </Link>
            </div>
          ) : (
            <button
              onClick={show}
              className="h-14 w-full rounded-lg bg-pink-900 px-4 text-base font-medium text-white transition-colors"
            >
              Connect a wallet
            </button>
          )
        }}
      </ConnectKitButton.Custom>
      <div className="flex w-full flex-row items-center">
        <div className="h-px flex-1 bg-gray-50" />
        <div className="px-2 text-xs text-gray-50">OR</div>
        <div className="h-px flex-1 bg-gray-50" />
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
