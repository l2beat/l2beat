import type { ReactNode } from 'react'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { CustomLinkIcon } from '~/icons/Outlink'
import type { CropsAttestationsMeta } from '~/server/features/garden/getAttestationsMeta'
import { SectionHeading } from '../../components/SectionHeading'
import { VERIFY_STEPS } from '../content'
import { CodeSnippet } from './CodeSnippet'
import { Markup } from './Markup'

export function AttestationsSection({
  attestations,
}: {
  attestations: CropsAttestationsMeta
}) {
  const current = attestations.current
  return (
    <section className="mt-8 md:mt-12">
      <SectionHeading
        title="Verifying the set onchain"
        size="md"
        description={ATTESTATION_DESCRIPTION}
      />
      <PrimaryCard className="max-md:mx-4 max-md:rounded-xl md:p-8">
        <dl className="grid gap-x-8 gap-y-1 md:grid-cols-[auto_1fr] md:gap-y-3">
          <Constant label="Network">
            {attestations.network} (chain id {attestations.chainId})
          </Constant>
          <Constant label="EAS contract">{attestations.eas}</Constant>
          <Constant label="Schema uid">{attestations.schemaUid}</Constant>
          <Constant label="Attester">
            {attestations.attester ?? 'not set yet'}
          </Constant>
          <Constant label="Attestation">
            {current ? (
              <a
                href={current.explorerUrl}
                className="text-link"
                target="_blank"
                rel="noreferrer"
              >
                {current.uid}
                {/* Sized to the 14 px mono line, so the row keeps its label's baseline. */}
                <CustomLinkIcon className="ml-1 inline-block size-3.5 fill-current align-baseline" />
              </a>
            ) : (
              'not published yet'
            )}
          </Constant>
          {current && (
            <Constant label="Covers">
              revision {current.revision} &middot; {current.projectIds.length}{' '}
              projects
            </Constant>
          )}
        </dl>
        <CodeSnippet
          className="mt-4"
          label="schema"
          copy={attestations.schema}
          copyText="Copy schema"
          wrap
        >
          {attestations.schema}
        </CodeSnippet>
        {/* Safari drops the list role from a list without markers. */}
        <ol role="list" className="mt-5 flex flex-col gap-2.5">
          {VERIFY_STEPS.map((step, index) => (
            <li
              key={step}
              className="flex gap-2.5 text-pretty text-paragraph-14 text-secondary md:text-paragraph-16"
            >
              {/* The 16 px marker slot of the sprout lists, so every list shares one indent. */}
              <span className="w-4 shrink-0 font-semibold text-primary tabular-nums">
                {index + 1}.
              </span>
              <span>
                <Markup text={step} />
              </span>
            </li>
          ))}
        </ol>
      </PrimaryCard>
    </section>
  )
}

// Says the same thing as the OpenAPI description: the set is attested, the ratings are not.
const ATTESTATION_DESCRIPTION =
  'One attestation on Ethereum Attestation Service, on Ethereum, names every protocol we have reviewed. It proves the set we named, not the ratings: ratings change as protocols change and are served by the API without a transaction.'

function Constant({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <dt className="font-semibold text-secondary text-subtitle-12 uppercase tracking-wider md:pt-0.5">
        {label}
      </dt>
      {/* On phone each value stacks under its label: 4 px inside a pair, 12 px between pairs. */}
      <dd className="break-all font-mono text-paragraph-13 max-md:mb-2 max-md:last:mb-0 md:text-paragraph-14">
        {children}
      </dd>
    </>
  )
}
