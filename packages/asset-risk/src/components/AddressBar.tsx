'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function AddressBar() {
  const [address, setAddress] = useState('')
  const router = useRouter()

  const handleWallet = () => {
    if (!address.startsWith('0x')) return
    router.push(`/wallet/${address}`)
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Input address"
        className="border border-pink-900 rounded-md p-3 w-3/4 md:w-96 bg-zinc-900 focus:active:ring-0 outline-none placeholder:text-white/50 font-medium focus:ring-1 duration-100 ring-pink-900 transition-all"
      />
      <button
        onClick={handleWallet}
        className="bg-pink-900 text-white h-12 px-4 py-2 rounded-md w-24 hover:bg-pink-800"
      >
        Search
      </button>
    </div>
  )
}
