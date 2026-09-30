import { useEffect, useState } from 'react'
import { SUPPORTED_CHAINS } from '@/chains'
import { API, type BlockWithChain } from '@/types'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { postApi } from '@/utils/postApi'
import { BlockNumberInput } from './BlockNumberInput'
import { ChainDropdown } from './ChainDropdown'
import { ErrorModal } from './ErrorModal'
import { SubmitButton } from './SubmitButton'

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
      void getBlock(chainParam, blockParam)
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
    void getBlock(chainId, blockNumber)

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

      const block = await postApi(API.uops, {
        chainId,
        blockNumber: Number(blockNumber),
      })
      onComplete({ ...block, chain })
    } catch (err) {
      console.log(err)
      setErrorMessage(getErrorMessage(err))
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
