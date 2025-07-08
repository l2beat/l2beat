import { HeartIcon } from '~/icons/Heart'
import { GovernanceCard } from '../GovernanceCard'

interface Props {
  className?: string
}

export function OurMissionSection({ className }: Props) {
  return (
    <GovernanceCard mobileFull className={className}>
      <div className="text-heading-24 md:text-heading-32">Our mission</div>
      <div className="mt-6 text-paragraph-16 md:text-paragraph-15">
        At L2BEAT we believe that crypto is the new infrastructure for the
        future financial system. As such, we believe that in order for it to be
        successful, it needs to be:
        <ul className="mt-2 ml-6 list-disc text-paragraph-16 md:text-paragraph-15">
          <li>
            Permissionless, no one should need a third party&apos;s permission
            to join the network,
          </li>
          <li>
            Censorship resistant, everyone should be free from arbitrary
            censorship,
          </li>
          <li>
            Trustless, it&apos;s all about cryptographic proofs and consensus,
            not trusting a central party,
          </li>
          <li>
            Decentralized, power and control should be spread across many
            participants,
          </li>
          <li>
            Transparent, everyone should be able to verify and account for
            transactions, even if they&apos;re private,
          </li>
          <li>
            Secure and safe, user safety and security come first, not relying on
            anyone acting honestly.
          </li>
          <li>
            Open-source, we live by &quot;don&apos;t trust, verify,&quot; so if
            we can&apos;t see the code, we can&apos;t trust it.
          </li>
        </ul>
      </div>
      <div className="mt-6 flex gap-3 rounded-lg bg-[#F7DEEB] p-4 dark:bg-[#3A1929]">
        <HeartIcon className="shrink-0" />
        <span className="text-balance font-medium text-paragraph-16 md:text-paragraph-15">
          We believe that right now the best ecosystem where those values could
          be represented and cherished is Ethereum together with its L2s. While
          we respect and value other blockchains and people building on top of
          them, we chose to be selective with our focus.
        </span>
      </div>
    </GovernanceCard>
  )
}
