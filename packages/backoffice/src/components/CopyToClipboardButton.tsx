import { CheckIcon, CopyIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '~/components/core/Button'

interface CopyToClipboardButtonProps {
  value: string
  label: string
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
}

export function CopyToClipboardButton({
  value,
  label,
  size = 'sm',
  disabled = false,
}: CopyToClipboardButtonProps) {
  const [isCopied, setIsCopied] = useState(false)
  const timeoutRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== undefined) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleCopy = async () => {
    try {
      await copyText(value)
      setIsCopied(true)
      if (timeoutRef.current !== undefined) {
        window.clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = window.setTimeout(() => {
        setIsCopied(false)
      }, 1_500)
      toast.success(`Copied ${label}`)
    } catch (error) {
      toast.error(`Failed to copy ${label}`, {
        description: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  return (
    <Button
      variant="outline"
      size={size}
      onClick={() => void handleCopy()}
      disabled={disabled}
    >
      {isCopied ? <CheckIcon /> : <CopyIcon />}
      {isCopied ? 'Copied' : `Copy ${label}`}
    </Button>
  )
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()

  const copied = document.execCommand('copy')
  document.body.removeChild(textarea)

  if (!copied) {
    throw new Error('Clipboard API unavailable')
  }
}
