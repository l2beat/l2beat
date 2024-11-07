'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { http, createPublicClient, isAddress } from 'viem'
import { mainnet } from 'viem/chains'
import { normalize } from 'viem/ens'
import { LensIcon } from '~/icons/lens'
import { cn } from '~/utils/cn'

const inputVariants = cva(
  'peer w-full border border-[#32326A] bg-[#1F1F38] font-medium text-white outline-none transition-colors duration-200 placeholder:text-[#74749F] focus:border-[#5959B1]',
  {
    variants: {
      size: {
        sm: 'h-10 rounded-full py-2 pl-4 pr-10',
        md: 'h-14 rounded-[28px] py-5 pl-5 pr-10',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
)

type Props = VariantProps<typeof inputVariants> & {
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
          inputVariants({
            size,
          }),
          className,
          error && 'placeholder:text-red-600',
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
