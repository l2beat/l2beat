import React from 'react'

import { HeartIcon } from '../../icons/symbols/HeartIcon'
import { GovernanceCard, GovernanceCardHeader } from '../GovernanceCard'

interface Props {
  className?: string
}

export function OurMissionSection({ className }: Props) {
  return (
    <GovernanceCard as="section" mobileFull className={className}>
      <GovernanceCardHeader>Our mission</GovernanceCardHeader>
      <p className="mt-6 text-base md:text-sm">
        At L2BEAT we believe that crypto is the new infrastructure for the
        future financial system. As such, we believe that in order for it to be
        successful, it needs to be:
        <ul className="ml-6 mt-2 list-disc text-base md:text-sm">
          <li>
            Permissionless, no one should need a third party's permission to
            join the network,
          </li>
          <li>
            Censorship resistant, everyone should be free from arbitrary
            censorship,
          </li>
          <li>
            Trustless, it's all about cryptographic proofs and consensus, not
            trusting a central party,
          </li>
          <li>
            Decentralized, power and control should be spread across many
            participants,
          </li>
          <li>
            Transparent, everyone should be able to verify and account for
            transactions, even if they're private,
          </li>
          <li>
            Secure and safe, user safety and security come first, not relying on
            anyone acting honestly.
          </li>
          <li>
            Open-source, we live by "don't trust, verify," so if we can't see
            the code, we can't trust it.
          </li>
        </ul>
      </p>
      <div className="mt-6 flex gap-3 rounded-lg bg-[#F7DEEB] p-4 dark:bg-[#3A1929]">
        <HeartIcon className="shrink-0" />
        <span className="text-balance text-base font-medium md:text-sm">
          We believe that right now the best ecosystem where those values could
          be represented and cherished is Ethereum together with its L2s. While
          we respect and value other blockchains and people building on top of
          them, we chose to be selective with our focus.
        </span>
      </div>
    </GovernanceCard>
  )
}
