'use client'

import { type VariantProps, cva } from 'class-variance-authority'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { http, createPublicClient, isAddress } from 'viem'
import { mainnet } from 'viem/chains'
import { normalize } from 'viem/ens'
import { LensIcon } from '~/icons/lens'
import { cn } from '~/utils/cn'
import { Input } from './input'

const walletInputVariants = cva('pr-10', {
  variants: {
    size: {
      sm: 'pl-4',
      md: 'pl-5',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

type Props = VariantProps<typeof walletInputVariants> & {
  className?: string
}

export function WalletInput({ size, className }: Props) {
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
    <div className="relative">
      <Input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            void handleWallet()
          }
        }}
        placeholder="Input address or ENS name"
        error={error}
        size={size}
        className={cn(
          'peer',
          walletInputVariants({
            size,
          }),
          className,
        )}
      />
      <button
        className="absolute inset-y-0 right-[18px] peer-focus:[&>svg]:fill-white"
        onClick={() => handleWallet()}
      >
        <LensIcon className="fill-[#74749F] transition-colors duration-200" />
      </button>
    </div>
  )
}
