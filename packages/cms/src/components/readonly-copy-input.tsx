'use client'

import { Copy } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from './ui/button'
import { Input } from './ui/input'

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
          void navigator.clipboard.writeText(value)
          toast.success('Copied to clipboard')
        }}
      >
        <Copy className="size-4" />
      </Button>
    </div>
  )
}
