import { CheckIcon, PlayIcon, XIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { api } from '~/react-query/trpc'
import { cn } from '~/utils/cn'
import { Button } from '../core/Button'
import { Spinner } from '../core/Spinner'

type ApiType = 'rpc' | 'blockscout' | 'etherscan'

export function TestApiButton({
  type,
  url,
  chainId,
}: {
  type: ApiType
  url: string | undefined
  chainId: number | undefined
}) {
  const [result, setResult] = useState<boolean | undefined>()
  const { mutate: testApi, isPending: isTesting } =
    api.chains.testApi.useMutation({
      onSuccess: (response) => {
        setResult(response.success)
        if (response.error) {
          toast.error(response.error)
        }
      },
      onError: () => {
        setResult(false)
        toast.error('Failed to test API')
      },
    })

  const testFn =
    type === 'etherscan' && chainId !== undefined
      ? () => testApi({ type, chainId })
      : type !== 'etherscan' && url !== undefined
        ? () => testApi({ type, url })
        : undefined

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={testFn}
      disabled={isTesting || !testFn}
      className={cn(
        'gap-2',
        result === true && 'border-green-500 bg-green-50 text-green-700',
        result === false && 'border-red-500 bg-red-50 text-red-700',
      )}
    >
      {isTesting ? (
        <Spinner className="size-4" />
      ) : result !== undefined ? (
        result === true ? (
          <CheckIcon className="size-4" />
        ) : (
          <XIcon className="size-4" />
        )
      ) : (
        <PlayIcon className="size-4" />
      )}
    </Button>
  )
}
