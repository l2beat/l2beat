'use client'
import Link from 'next/link'
import { useAccount, useEnsName } from 'wagmi'
import { formatAddress } from '~/utils/formatAddress'
import { ChangeWallet } from '../ChangeWallet'

export function WalletInfo() {
  const { isConnected, address } = useAccount()
  const { data: ensAddress } = useEnsName({
    address,
  })

  if (!isConnected) return null

  return (
    <div className="flex items-center gap-3">
      <Link
        className="font-medium text-sm text-black"
        href={`/wallet/${address}`}
      >
        {ensAddress
          ? ensAddress
          : address
            ? formatAddress('0x8aEb2A694589a6ACaD9716d23198ed3784d4C50e')
            : null}
      </Link>
      <ChangeWallet />
    </div>
  )
}
