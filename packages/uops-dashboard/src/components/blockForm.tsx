import { type ChainId, SUPPORTED_CHAINS } from '@/chains'
import type {
  ApiError,
  Block,
  BlockWithChain,
  UserOperationsApiRequest,
} from '@/types'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BlockNumberInput } from './blockNumberInput'
import { ChainDropdown } from './chainDropdown'
import { ErrorModal } from './errorModal'
import { SubmitButton } from './submitButton'

export function BlockForm({
  onComplete,
}: { onComplete: (block: BlockWithChain | undefined) => void }) {
  const [chainId, setChain] = useState<ChainId>(SUPPORTED_CHAINS[0].id)
  const [blockNumber, setBlockNumber] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  useEffect(() => {
    // useSearchParams return empty values on first render
    const urlParams = new URLSearchParams(window.location.search)
    const chainParam = urlParams.get('chain')
    const blockParam = urlParams.get('block')

    if (chainParam && blockParam) {
      setChain(chainParam as ChainId)
      setBlockNumber(blockParam)
      getBlock(chainParam as ChainId, blockParam)
    }
  }, [])

  const handleSetChain = (chain: ChainId) => {
    setChain(chain)
    setBlockNumber('')
    onComplete(undefined)
  }

  const handleSetBlockNumber = (blockNumber: string) => {
    setBlockNumber(blockNumber)
    onComplete(undefined)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    getBlock(chainId, blockNumber)

    const params = new URLSearchParams(searchParams)
    params.set('chain', chainId)
    params.set('block', blockNumber)
    replace(`${pathname}?${params.toString()}`)
  }

  const getBlock = async (chainId: ChainId, blockNumber: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`${window.location.origin}/api/uops`, {
        method: 'POST',
        body: JSON.stringify({
          chainId,
          blockNumber: Number(blockNumber),
        } as UserOperationsApiRequest),
      })

      const body = await res.json()
      if (res.status === 200) {
        const block = body as Block
        const chain = SUPPORTED_CHAINS.find((c) => c.id === chainId)

        if (!chain) {
          throw new Error(`Unsupported chain: ${chain}`)
        }

        onComplete({
          ...block,
          chain,
        })
      } else {
        const error = body as ApiError
        setErrorMessage(error.message)
      }
    } catch (err) {
      console.log(err)
    }
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-sm">
      <ChainDropdown chain={chainId} setChain={handleSetChain} />
      <BlockNumberInput
        value={blockNumber}
        chain={chainId}
        setBlockNumber={handleSetBlockNumber}
        setErrorMessage={setErrorMessage}
      />
      <SubmitButton isLoading={isLoading} />
      {errorMessage && (
        <ErrorModal
          errorMessage={errorMessage}
          onClose={() => setErrorMessage('')}
        />
      )}
    </form>
  )
}
