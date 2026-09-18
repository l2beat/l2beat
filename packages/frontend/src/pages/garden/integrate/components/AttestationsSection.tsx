import type { ReactNode } from 'react'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
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
        description={describeAttestation(attestations)}
      />
      <PrimaryCard className="max-md:mx-4 md:p-8">
        <dl className="grid gap-x-8 gap-y-3 md:grid-cols-[auto_1fr]">
          <Constant label="Network">
            {attestations.network} (chain id {attestations.chainId})
          </Constant>
          <Constant label="EAS contract">{attestations.eas}</Constant>
          <Constant label="Schema uid">{attestations.schemaUid}</Constant>
          <Constant label="Attester">{attestations.attester}</Constant>
          <Constant label="Attestation">
            {current ? (
              <a
                href={current.explorerUrl}
                className="underline underline-offset-2"
                target="_blank"
                rel="noreferrer"
              >
                {current.uid}
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
        <ol className="mt-5 flex list-decimal flex-col gap-3 pl-5">
          {VERIFY_STEPS.map((step) => (
            <li
              key={step}
              className="text-paragraph-14 text-secondary md:text-paragraph-16"
            >
              <Markup text={step} />
            </li>
          ))}
        </ol>
      </PrimaryCard>
    </section>
  )
}

// Says the same thing as the OpenAPI description: the set is attested, the ratings are not.
function describeAttestation(attestations: CropsAttestationsMeta): string {
  const where = attestations.isTestnet
    ? `It currently lives on the ${attestations.network} testnet.`
    : `It lives on ${attestations.network}.`
  return `One attestation on Ethereum Attestation Service names every protocol we have reviewed. ${where} It proves the set we named, not the ratings: ratings change as protocols change and are served by the API without a transaction.`
}

function Constant({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <dt className="font-semibold text-subtitle-12 uppercase tracking-wider md:pt-0.5">
        {label}
      </dt>
      <dd className="break-all font-mono text-paragraph-13 md:text-paragraph-14">
        {children}
      </dd>
    </>
  )
}
