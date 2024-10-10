'use client'

import { Copy } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { toast } from 'sonner'

export function ReadonlyCopyInput({ value }: { value: string }) {
  return (
    <div className="relative">
      <Input
        value={value}
        readOnly
        onSelect={(e) => (e.target as HTMLInputElement).select()}
        className="pr-8"
      />
      <Button
        size="icon"
        variant="ghost"
        className="absolute right-0 top-1/2 -translate-y-1/2"
        onClick={() => {
          navigator.clipboard.writeText(value)
          toast.success('Copied to clipboard')
        }}
      >
        <Copy className="w-4 h-4" />
      </Button>
    </div>
  )
}
