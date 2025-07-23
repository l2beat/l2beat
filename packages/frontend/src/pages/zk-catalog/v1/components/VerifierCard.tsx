import { EtherscanLink } from '~/components/EtherscanLink'
import type { ZkCatalogViewEntry } from '../../types'
import { LastUsedCell } from '../project/components/LastUsedCell'
import { SubVerifiersTable } from '../project/components/SubVerifiersTable'
import { VerifiedCell } from '../project/components/VerifiedCell'
import { DetailsItem } from './DetailsItem'

export function VerifierCard({
  verifier,
}: {
  verifier: ZkCatalogViewEntry['verifiers'][number]
}) {
  return (
    <div className="border-divider border-t px-5 py-4 max-md:first:border-t-0 md:rounded-lg md:border md:first:mt-7">
      <div className="grid space-y-2 lg:grid-cols-4 lg:space-y-0">
        <DetailsItem title="Name">{verifier.name}</DetailsItem>
        <DetailsItem title="Verifier">
          <EtherscanLink
            href={verifier.url}
            address={verifier.contractAddress.toString()}
          />
        </DetailsItem>
        <DetailsItem title="Verification status">
          <VerifiedCell {...verifier} />
        </DetailsItem>
        <DetailsItem title="Last used" className="lg:pl-10">
          <LastUsedCell days={verifier.lastUsedDaysAgo} />
        </DetailsItem>
      </div>
      <SubVerifiersTable
        verifier={verifier}
        className="mt-7 w-[calc(100vw-78px)] md:w-[calc(100vw-188px)]"
      />
    </div>
  )
}
