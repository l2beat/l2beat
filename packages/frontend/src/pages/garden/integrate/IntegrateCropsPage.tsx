import type { ReactNode } from 'react'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { CropsAttestationsMeta } from '~/server/features/garden/getCropsProjects'
import { GardenPageHeader } from '../components/GardenPageHeader'
import { SectionHeading } from '../components/SectionHeading'
import { SproutIcon } from '../components/SproutIcon'
import { GARDEN_PATH } from '../submit/links'
import { BadgeStudio } from './components/BadgeStudio'
import { CodeSnippet, RequestHeader } from './components/CodeSnippet'
import { WalletMock } from './components/WalletMock'
import {
  API_NOTES,
  BADGE_RULES,
  CROPS_API_DOCS_URL,
  CROPS_API_SPEC_URL,
  CROPS_API_URL,
  ENDPOINTS,
  type EndpointDoc,
  VERIFY_STEPS,
} from './content'
import type {
  IntegrateExample,
  IntegrateExamples,
} from './getIntegrateExamples'

export interface IntegrateCropsPageProps extends AppLayoutProps {
  attestations: CropsAttestationsMeta
  examples: IntegrateExamples
}

const CONSUMERS_ID = 'for-apps'
const PROTOCOLS_ID = 'for-protocols'

// Pasted into other sites, so it must link to production even from a preview.
const BADGE_HREF = `https://l2beat.com${GARDEN_PATH}`

export function IntegrateCropsPage({
  attestations,
  examples,
  ...props
}: IntegrateCropsPageProps) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <div className="flex grow flex-col pb-24">
          <GardenPageHeader title="Integrate CROPS" />
          <main>
            <AudiencePicker />
            <ConsumerSections attestations={attestations} examples={examples} />
            <ProtocolSection />
          </main>
        </div>
        <ScrollToTopButton />
      </SideNavLayout>
    </AppLayout>
  )
}

function AudiencePicker() {
  return (
    <section className="mt-6 grid gap-4 max-md:px-4 md:mt-8 md:grid-cols-2 md:gap-6">
      <AudienceCard
        href={`#${CONSUMERS_ID}`}
        eyebrow="For wallets, explorers and interfaces"
        title="Show the crops"
        description="Get the crops for a protocol based on id or a contract address."
        cta="Read the API"
        art={<WalletMock />}
      />
      <AudienceCard
        href={`#${PROTOCOLS_ID}`}
        eyebrow="For reviewed protocols"
        title="Wear the badge"
        description="If we have reviewed you and named you in the onchain set, you can say so on your own site."
        cta="Get the badge"
        art={<BadgeArt />}
      />
    </section>
  )
}

function AudienceCard({
  href,
  eyebrow,
  title,
  description,
  cta,
  art,
}: {
  href: string
  eyebrow: string
  title: string
  description: string
  cta: string
  art: ReactNode
}) {
  return (
    <a
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-divider bg-surface-primary transition-colors hover:border-garden-accent/60"
    >
      <div className="flex min-h-[220px] items-center justify-center bg-gradient-to-b from-garden-tint to-surface-primary px-6 py-8">
        {art}
      </div>
      <div className="flex grow flex-col border-divider border-t p-5 md:p-6">
        <span className="font-semibold text-garden-accent text-subtitle-12 uppercase tracking-wider">
          {eyebrow}
        </span>
        <h2 className="mt-1.5 font-bold text-heading-20 md:text-heading-24">
          {title}
        </h2>
        <p className="mt-2 grow text-paragraph-14 text-secondary md:text-paragraph-15">
          {description}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 font-semibold text-paragraph-14 group-hover:underline">
          {cta}
          <span aria-hidden>&rarr;</span>
        </span>
      </div>
    </a>
  )
}

function BadgeArt() {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="inline-flex items-center gap-2.5 rounded-xl border border-garden-border bg-white px-3.5 py-2.5 shadow-[0_10px_30px_-14px_rgba(16,32,20,.5)] dark:bg-[#17181a]">
        <SproutIcon className="size-5 text-crop-good-ink" />
        <span className="flex flex-col leading-tight">
          <span className="font-bold text-[13px] text-crop-good-ink tracking-wide">
            CROPS
          </span>
          <span className="text-[11px] text-secondary">
            Reviewed &amp; attested onchain
          </span>
        </span>
        <span className="self-stretch border-divider border-l" />
        <span className="font-semibold text-[11px] text-secondary tracking-widest">
          L2BEAT
        </span>
      </span>
      <span className="inline-flex items-center gap-2 rounded-full border border-garden-border bg-white px-3 py-1.5 dark:bg-[#17181a]">
        <SproutIcon className="size-3.5 text-crop-good-ink" />
        <span className="font-bold text-[12px] text-crop-good-ink tracking-wide">
          CROPS
        </span>
        <span className="text-[12px] text-secondary">attested</span>
      </span>
    </div>
  )
}

function ConsumerSections({
  attestations,
  examples,
}: {
  attestations: CropsAttestationsMeta
  examples: IntegrateExamples
}) {
  return (
    <>
      <SectionDivider id={CONSUMERS_ID} label="For wallets and interfaces" />
      <section className="mt-6 md:mt-8">
        <SectionHeading
          title="Endpoints"
          description={`Static JSON files on ${CROPS_API_URL}, regenerated on every change to the reviews.`}
        />
        <ApiNotes />
        <div className="mt-4 flex flex-col gap-4 md:mt-6 md:gap-6">
          {ENDPOINTS.map((endpoint) => (
            <EndpointCard
              key={endpoint.key}
              endpoint={endpoint}
              example={examples[endpoint.key]}
            />
          ))}
        </div>
      </section>

      <AttestationsSection attestations={attestations} />
    </>
  )
}

function ApiNotes() {
  return (
    <PrimaryCard className="max-md:mx-4 md:p-8">
      <ul className="flex flex-col gap-3">
        {API_NOTES.map((note) => (
          <li
            key={note}
            className="flex gap-3 text-paragraph-14 text-secondary md:text-paragraph-16"
          >
            <SproutIcon className="mt-1 size-4 shrink-0 text-garden-accent" />
            <span>
              <Markup text={note} />
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-paragraph-14 text-secondary md:text-paragraph-16">
        Browse the{' '}
        <ExternalLink href={CROPS_API_DOCS_URL}>interactive docs</ExternalLink>{' '}
        or read the{' '}
        <ExternalLink href={CROPS_API_SPEC_URL}>OpenAPI spec</ExternalLink>.
      </p>
    </PrimaryCard>
  )
}

function ExternalLink({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <a
      href={href}
      className="underline underline-offset-2"
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  )
}

function EndpointCard({
  endpoint,
  example,
}: {
  endpoint: EndpointDoc
  example: IntegrateExample
}) {
  return (
    <PrimaryCard className="max-md:mx-4 md:p-8">
      <Code>{endpoint.path}</Code>
      <h3 className="mt-3 font-bold text-heading-20">{endpoint.summary}</h3>
      <p className="mt-1 max-w-3xl text-paragraph-14 text-secondary md:text-paragraph-16">
        <Markup text={endpoint.description} />
      </p>
      {endpoint.params && (
        <dl className="mt-4 flex flex-col gap-2">
          {endpoint.params.map((param) => (
            <div key={param.name}>
              <dt className="font-semibold text-paragraph-14">
                <Code>{param.name}</Code>
              </dt>
              <dd className="text-paragraph-14 text-secondary">
                {param.description}
              </dd>
            </div>
          ))}
        </dl>
      )}
      <CodeSnippet
        className="mt-4"
        language="text"
        code=""
        header={<RequestHeader url={example.request} />}
        copy={example.request}
        copyText="Copy URL"
      />
      <CodeSnippet
        className="mt-3"
        language="json"
        code={example.response}
        label="response"
      />
    </PrimaryCard>
  )
}

function AttestationsSection({
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
          <Constant label="Attester">
            {attestations.attester ?? 'not published yet'}
          </Constant>
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
          language="text"
          code={attestations.schema}
          label="schema"
          copy={attestations.schema}
          copyText="Copy schema"
          wrap
        />
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

function ProtocolSection() {
  return (
    <>
      <SectionDivider id={PROTOCOLS_ID} label="For reviewed protocols" />
      <section className="mt-6 md:mt-8">
        <SectionHeading
          title="Wear the badge"
          description="If your project is in the attested set, the badge is yours to use. It is one anchor tag with inline styles - no script, no stylesheet, and no image served from our domain, so it cannot slow your page down or break when we deploy."
        />
        <div className="max-md:mx-4">
          <BadgeStudio href={BADGE_HREF} />
        </div>
      </section>

      <section className="mt-8 md:mt-12">
        <SectionHeading title="Using it fairly" size="md" />
        <PrimaryCard className="max-md:mx-4 md:p-8">
          <ul className="flex flex-col gap-3">
            {BADGE_RULES.map((rule) => (
              <li
                key={rule}
                className="flex gap-3 text-paragraph-14 text-secondary md:text-paragraph-16"
              >
                <SproutIcon className="mt-1 size-4 shrink-0 text-garden-accent" />
                <span>
                  <Markup text={rule} />
                </span>
              </li>
            ))}
          </ul>
        </PrimaryCard>
      </section>
    </>
  )
}

function SectionDivider({ id, label }: { id: string; label: string }) {
  return (
    <div id={id} className="mt-12 flex items-center gap-4 max-md:px-4 md:mt-16">
      <span className="h-px grow bg-divider" />
      <span className="font-semibold text-secondary text-subtitle-12 uppercase tracking-[0.14em]">
        {label}
      </span>
      <span className="h-px grow bg-divider" />
    </div>
  )
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

function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-surface-tertiary px-1.5 py-0.5 font-mono text-paragraph-13">
      {children}
    </code>
  )
}

/** Renders the `backticks` the content uses. */
function Markup({ text }: { text: string }) {
  return (
    <>
      {text
        .split('`')
        .map((part, index) =>
          index % 2 === 1 ? (
            <Code key={index}>{part}</Code>
          ) : (
            <span key={index}>{part}</span>
          ),
        )}
    </>
  )
}
