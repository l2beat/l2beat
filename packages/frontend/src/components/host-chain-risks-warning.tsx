import { type ScalingProjectDisplay } from '@l2beat/config'
import Image from 'next/image'
import Link from 'next/link'

export type HostChainRisksWarningProps = {
  hostChain: ScalingProjectDisplay
  riskCount?: number
}

export function HostChainRisksWarning({
  hostChain,
  riskCount,
}: HostChainRisksWarningProps) {
  const text = riskCount
    ? 'There are ' + riskCount + ' additional risks coming from the hostchain '
    : 'The section considers only the L3 properties. For more details please refer to '

  return (
    <div className="flex w-full items-center rounded-lg bg-gray-200 px-4 py-2 text-xs font-medium dark:bg-zinc-800">
      <div>
        {text}{' '}
        <span className="inline-block">
          <Image
            className="mr-1 inline-block size-5"
            src={`/icons/${hostChain.slug}.png`}
            width={20}
            height={20}
            alt={`${hostChain.name} logo`}
          />
          <Link
            href={`/scaling/projects/${hostChain.slug}`}
            className="inline-block text-xs font-medium text-blue-700 underline hover:text-blue-550 dark:text-blue-500 dark:hover:text-blue-550"
          >
            {hostChain.name}
          </Link>
        </span>
      </div>
    </div>
  )
}
