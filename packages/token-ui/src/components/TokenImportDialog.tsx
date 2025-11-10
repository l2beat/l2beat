import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '~/components/core/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/core/Dialog'
import { Textarea } from '~/components/core/TextArea'

interface TokenImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (tokens: { chain: string; address: string }[]) => void
}

export function TokenImportDialog({
  open,
  onOpenChange,
  onImport,
}: TokenImportDialogProps) {
  const [csvInput, setCsvInput] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleImport() {
    try {
      setError(null)
      if (!csvInput.trim()) {
        setError('Please enter at least one token')
        return
      }

      const tokens = parseCSV(csvInput)
      if (tokens.length === 0) {
        setError('No valid tokens found')
        return
      }

      toast.success(`Successfully imported ${tokens.length} token(s) to queue`)
      onImport(tokens)
      setCsvInput('')
      setError(null)
      onOpenChange(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to parse CSV'
      setError(message)
    }
  }

  function handleCancel() {
    setCsvInput('')
    setError(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Import Tokens</DialogTitle>
          <DialogDescription>
            Paste tokens in CSV format (chain,address). One token per line.
            <br />
            Example:
            <br />
            <code className="text-xs">
              ethereum,0x1234567890123456789012345678901234567890
              <br />
              arbitrum,0xabcdefabcdefabcdefabcdefabcdefabcdefabcd
            </code>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Textarea
            value={csvInput}
            onChange={(e) => {
              setCsvInput(e.target.value)
              setError(null)
            }}
            placeholder="ethereum,0x1234567890123456789012345678901234567890&#10;arbitrum,0xabcdefabcdefabcdefabcdefabcdefabcdefabcd"
            rows={10}
            className="font-mono text-sm"
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleImport}>Import</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
function parseCSV(csv: string): { chain: string; address: string }[] {
  const lines = csv.trim().split('\n')
  const tokens: { chain: string; address: string }[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]?.trim()
    if (!line) continue // Skip empty lines

    const parts = line.split(',').map((part) => part.trim())
    if (parts.length !== 2) {
      throw new Error(
        `Line ${i + 1}: Expected format "chain,address", got "${line}"`,
      )
    }

    const [chain, address] = parts
    if (!chain || !address) {
      throw new Error(`Line ${i + 1}: Both chain and address are required`)
    }

    tokens.push({ chain, address })
  }

  return tokens
}
