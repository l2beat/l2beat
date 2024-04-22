'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function AddressBar() {
  const [address, setAddress] = useState('')
  const router = useRouter()

  return (
    <div className="flex flex-row gap-2">
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button onClick={() => router.push(`/wallet/${address}`)}>Submit</button>
    </div>
  )
}
