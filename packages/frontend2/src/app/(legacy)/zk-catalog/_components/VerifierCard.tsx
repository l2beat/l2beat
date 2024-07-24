import { EtherscanLink } from '~/app/_components/etherscan-link'
import { LastUsedCell } from '../[project]/_components/LastUsedCell'
import { SubVerifiersTable } from '../[project]/_components/SubVerifiersTable'
import { VerifiedCell } from '../[project]/_components/VerifiedCell'
import { getExplorerUrlByChainId } from '../_utils/getExplorerUrl'
import { type ZkCatalogViewEntry } from '../types'
import { DetailsItem } from './DetailsItem'

export function VerifierCard({
  verifier,
  askForVerificationLink,
}: {
  verifier: ZkCatalogViewEntry['verifiers'][number]
  askForVerificationLink: string
}) {
  return (
    <div className="border-t border-gray-300 px-5 py-4 dark:border-gray-800 md:rounded-lg md:border md:first:mt-7">
      <div className="grid space-y-2 lg:grid-cols-4 lg:space-y-0">
        <DetailsItem title="Name">{verifier.name}</DetailsItem>
        <DetailsItem title="Verifier">
          <EtherscanLink
            etherscanUrl={getExplorerUrlByChainId(verifier.chainId)}
            address={verifier.contractAddress.toString()}
          />
        </DetailsItem>
        <DetailsItem title="Verification status">
          <VerifiedCell
            verified={verifier.verified}
            askForVerificationLink={askForVerificationLink}
            performedBy={
              verifier.verified !== 'no' ? verifier.performedBy : undefined
            }
          />
        </DetailsItem>
        <DetailsItem title="Last used" className="lg:pl-10">
          <LastUsedCell days={verifier.lastUsedDaysAgo} />
        </DetailsItem>
      </div>
      <SubVerifiersTable
        verifier={verifier}
        className="mt-7 w-[calc(100vw_-_82px)] md:w-[calc(100vw_-_188px)]"
      />
    </div>
  )
}
