import { useEffect, useState } from 'react'
import { SUPPORTED_CHAINS } from '@/chains'
import type {
  BlockWithChain,
  CountedBlock,
  UserOperationsApiRequest,
} from '@/types'
import { postApi } from '@/utils/postApi'
import { BlockNumberInput } from './blockNumberInput'
import { ChainDropdown } from './chainDropdown'
import { ErrorModal } from './errorModal'
import { SubmitButton } from './submitButton'

export function BlockForm({
  onComplete,
}: {
  onComplete: (block: BlockWithChain | undefined) => void
}) {
  const [chainId, setChain] = useState<string>('ethereum')
  const [blockNumber, setBlockNumber] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const chainParam = urlParams.get('chain')
    const blockParam = urlParams.get('block')

    if (chainParam && blockParam) {
      setChain(chainParam)
      setBlockNumber(blockParam)
      getBlock(chainParam, blockParam)
    }
  }, [])

  const handleSetChain = (chain: string) => {
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

    const params = new URLSearchParams(window.location.search)
    params.set('chain', chainId)
    params.set('block', blockNumber)
    window.history.replaceState(null, '', `?${params.toString()}`)
  }

  const getBlock = async (chainId: string, blockNumber: string) => {
    setIsLoading(true)
    try {
      const chain = SUPPORTED_CHAINS.find((c) => c.id === chainId)
      if (!chain) {
        throw new Error(`Unsupported chain: ${chainId}`)
      }

      const request: UserOperationsApiRequest = {
        chainId,
        blockNumber: Number(blockNumber),
      }
      const block = await postApi<CountedBlock>('uops', request)
      onComplete({ ...block, chain })
    } catch (err) {
      console.log(err)
      setErrorMessage((err as Error).message)
    }
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-sm px-2">
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
