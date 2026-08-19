import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { cn } from '~/utils/cn'
import { SectionHeading } from '../components/SectionHeading'
import { GARDEN_ANIMATIONS_CSS, GARDEN_SURFACES_CSS } from '../gardenCss'
import {
  ENDPOINTS,
  type EndpointDoc,
  VERIFY_STEPS,
  VOCABULARY_NOTES,
} from './content'

export interface IntegrateCropsAttestations {
  network: string
  chainId: number
  isTestnet: boolean
  eas: string
  schemaUid: string
  schema: string
  attester: string | null
}

export interface IntegrateCropsPageProps extends AppLayoutProps {
  attestations: IntegrateCropsAttestations
}

export function IntegrateCropsPage({
  attestations,
  ...props
}: IntegrateCropsPageProps) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <style>{PAGE_CSS}</style>
        <div className="relative flex grow flex-col pb-24">
          <h1 className="pt-5 font-bold text-2xl max-md:px-4 lg:hidden">
            Integrate CROPS
          </h1>
          <MainPageHeader>Integrate CROPS</MainPageHeader>
          <main>
            <IntroSection />
            <EndpointsSection />
            <VocabularySection />
            <AttestationsSection attestations={attestations} />
          </main>
        </div>
        <ScrollToTopButton />
      </SideNavLayout>
    </AppLayout>
  )
}

function IntroSection() {
  return (
    <section className="mt-6 md:mt-8">
      <SectionHeading
        title="The CROPS evaluations, as data"
        description="Every evaluation in The Infinite Garden is available over a plain JSON API. There is no API key, no signup and no rate limit to negotiate: the endpoints are open and send Access-Control-Allow-Origin: *, so a wallet or a block explorer can call them straight from the browser."
      />
      <PrimaryCard className="max-md:mx-4 md:p-8">
        <p className="text-paragraph-15 md:text-paragraph-16">
          The most useful entry point for a wallet is{' '}
          <Code>/api/garden/lookup</Code>. Give it the contracts a user is about
          to interact with and it tells you which reviewed protocol they belong
          to, so you can show the four crops at the moment it matters rather
          than asking anyone to look a protocol up by name.
        </p>
        <p className="mt-3 text-paragraph-15 text-secondary md:text-paragraph-16">
          Please attribute the evaluations to L2BEAT and link back to the
          protocol page, so a user can read the reasoning rather than only the
          colour.
        </p>
      </PrimaryCard>
    </section>
  )
}

function EndpointsSection() {
  return (
    <section className="mt-8 md:mt-12">
      <SectionHeading title="Endpoints" />
      <div className="flex flex-col gap-4 md:gap-6">
        {ENDPOINTS.map((endpoint) => (
          <EndpointCard key={endpoint.path} endpoint={endpoint} />
        ))}
      </div>
    </section>
  )
}

function EndpointCard({ endpoint }: { endpoint: EndpointDoc }) {
  return (
    <PrimaryCard className="max-md:mx-4 md:p-8">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="rounded bg-surface-tertiary px-2 py-0.5 font-semibold text-subtitle-12 uppercase tracking-wider">
          get
        </span>
        <Code>{endpoint.path}</Code>
      </div>
      <h3 className="mt-3 font-bold text-heading-20">{endpoint.summary}</h3>
      <p className="mt-1 max-w-3xl text-paragraph-14 text-secondary md:text-paragraph-16">
        {endpoint.description}
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
      <CodeBlock>{endpoint.example}</CodeBlock>
    </PrimaryCard>
  )
}

function VocabularySection() {
  return (
    <section className="mt-8 md:mt-12">
      <SectionHeading
        title="Reading a crop"
        description="Four crops, two independent axes. These are the rules the garden itself follows, so an integration that follows them will always agree with our pages."
      />
      <PrimaryCard className="max-md:mx-4 md:p-8">
        <ul className="flex flex-col gap-3">
          {VOCABULARY_NOTES.map((note) => (
            <li
              key={note}
              className="text-paragraph-14 text-secondary md:text-paragraph-16"
            >
              <Markup text={note} />
            </li>
          ))}
        </ul>
      </PrimaryCard>
    </section>
  )
}

function AttestationsSection({
  attestations,
}: {
  attestations: IntegrateCropsAttestations
}) {
  return (
    <section className="mt-8 md:mt-12">
      <SectionHeading
        title="Verifying a rating onchain"
        description="Each evaluation is also published as an Ethereum Attestation Service attestation, so you do not have to take an HTTP response on trust. The ratings are in the attestation as plain strings: reading one needs no lookup table and no call back to us."
      />
      {attestations.isTestnet && (
        <div className="mb-4 rounded-lg border border-[#efd9a6] bg-[#fdf7ea] p-4 text-paragraph-14 max-md:mx-4 md:text-paragraph-16 dark:border-[#ffc107]/50 dark:bg-[#ffc107]/10">
          <span className="font-bold">
            These attestations are on {attestations.network}, a testnet.
          </span>{' '}
          They exist so integrators can build against the real thing, and are
          not yet production claims. Treat the API as the current source of
          truth until this says mainnet - the{' '}
          <Code>attestations.isTestnet</Code> field in every response says the
          same thing, so you can gate on it in code.
        </div>
      )}
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
        </dl>
        <CodeBlock wrap>{attestations.schema}</CodeBlock>
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

function Constant({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
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

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-surface-tertiary px-1.5 py-0.5 font-mono text-paragraph-13">
      {children}
    </code>
  )
}

function CodeBlock({
  children,
  wrap,
}: {
  children: string
  /** For a single long line, like the schema, where indentation carries nothing. */
  wrap?: boolean
}) {
  return (
    <pre
      className={cn(
        'mt-4 rounded-lg bg-surface-tertiary p-4 font-mono text-paragraph-13 leading-relaxed',
        wrap ? 'whitespace-pre-wrap break-all' : 'overflow-x-auto',
      )}
    >
      {children}
    </pre>
  )
}

/** Renders the `backticks` the content uses, and nothing else. */
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

const PAGE_CSS = GARDEN_SURFACES_CSS + GARDEN_ANIMATIONS_CSS
