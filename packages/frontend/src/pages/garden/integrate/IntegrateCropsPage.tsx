import { Button } from '~/components/core/Button'
import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { cn } from '~/utils/cn'
import { SectionHeading } from '../components/SectionHeading'
import { SproutIcon } from '../components/SproutIcon'
import { GARDEN_ANIMATIONS_CSS, GARDEN_SURFACES_CSS } from '../gardenCss'
import { GARDEN_PATH, SUBMIT_PROTOCOL_PATH } from '../submit/links'
import { BadgeStudio } from './components/BadgeStudio'
import { RequestLine } from './components/RequestLine'
import { WalletMock } from './components/WalletMock'
import {
  BADGE_RULES,
  ENDPOINTS,
  type EndpointDoc,
  VERIFY_STEPS,
} from './content'

export interface IntegrateCropsAttestations {
  network: string
  chainId: number
  eas: string
  schemaUid: string
  schema: string
  attester: string | null
  current: {
    uid: string
    revision: number
    reviewedAt: number
    projectIds: string[]
    explorerUrl: string
  } | null
}

export interface IntegrateCropsPageProps extends AppLayoutProps {
  attestations: IntegrateCropsAttestations
}

const CONSUMERS_ID = 'for-apps'
const PROTOCOLS_ID = 'for-protocols'

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
          <MainPageHeader description="Two ways in. Show your users what a protocol is made of, or show your users that we have looked at yours.">
            Integrate CROPS
          </MainPageHeader>
          <main>
            <AudiencePicker />
            <ConsumerSections attestations={attestations} />
            <ProtocolSection />
          </main>
        </div>
        <ScrollToTopButton />
      </SideNavLayout>
    </AppLayout>
  )
}

/* ------------------------------------------------------------------ split */

function AudiencePicker() {
  return (
    <section className="mt-6 grid gap-4 max-md:px-4 md:mt-8 md:grid-cols-2 md:gap-6">
      <AudienceCard
        href={`#${CONSUMERS_ID}`}
        eyebrow="For wallets, explorers and interfaces"
        title="Show the crops"
        description="Ask us what a contract belongs to and get back the four crops for that protocol, ready to render at the moment a user is about to sign. No key, no signup."
        cta="Read the API"
        art={<WalletMock />}
      />
      <AudienceCard
        href={`#${PROTOCOLS_ID}`}
        eyebrow="For reviewed protocols"
        title="Wear the badge"
        description="If we have reviewed you and named you in the onchain set, you can say so on your own site. Copy one line of HTML - no script, no image hosted by us."
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
  art: React.ReactNode
}) {
  return (
    <a
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-divider bg-surface-primary transition-colors hover:border-[#9ec98a] dark:hover:border-[#3d5230]"
    >
      <div className="flex min-h-[220px] items-center justify-center bg-gradient-to-b from-[#f4f9f0] to-surface-primary px-6 py-8 dark:from-[#151a12] dark:to-surface-primary">
        {art}
      </div>
      <div className="flex grow flex-col border-divider border-t p-5 md:p-6">
        <span className="font-semibold text-[#4a7a35] text-subtitle-12 uppercase tracking-wider dark:text-[#8fd06a]">
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

/** A still of the badge, for the card that leads to the badge studio. */
function BadgeArt() {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="inline-flex items-center gap-2.5 rounded-xl border border-[#d8e3cd] bg-white px-3.5 py-2.5 shadow-[0_10px_30px_-14px_rgba(16,32,20,.5)] dark:border-[#2c3a22] dark:bg-[#17181a]">
        <SproutIcon className="size-5 text-[#16863f] dark:text-[#3fe07f]" />
        <span className="flex flex-col leading-tight">
          <span className="font-bold text-[#16863f] text-[13px] tracking-wide dark:text-[#3fe07f]">
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
      <span className="inline-flex items-center gap-2 rounded-full border border-[#d8e3cd] bg-white px-3 py-1.5 dark:border-[#2c3a22] dark:bg-[#17181a]">
        <SproutIcon className="size-3.5 text-[#16863f] dark:text-[#3fe07f]" />
        <span className="font-bold text-[#16863f] text-[12px] tracking-wide dark:text-[#3fe07f]">
          CROPS
        </span>
        <span className="text-[12px] text-secondary">attested</span>
      </span>
    </div>
  )
}

/* -------------------------------------------------- for apps and wallets */

function ConsumerSections({
  attestations,
}: {
  attestations: IntegrateCropsAttestations
}) {
  return (
    <>
      <SectionDivider id={CONSUMERS_ID} label="For wallets and interfaces" />
      <section className="mt-6 md:mt-8">
        <SectionHeading title="Endpoints" description="" />
        <div className="flex flex-col gap-4 md:gap-6">
          {ENDPOINTS.map((endpoint) => (
            <EndpointCard key={endpoint.path} endpoint={endpoint} />
          ))}
        </div>
      </section>

      <AttestationsSection attestations={attestations} />
    </>
  )
}

function EndpointCard({ endpoint }: { endpoint: EndpointDoc }) {
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
      <RequestLine url={endpoint.request} />
      <CodeBlock>{endpoint.response}</CodeBlock>
    </PrimaryCard>
  )
}

function AttestationsSection({
  attestations,
}: {
  attestations: IntegrateCropsAttestations
}) {
  const current = attestations.current
  return (
    <section className="mt-8 md:mt-12">
      <SectionHeading
        title="Verifying the set onchain"
        description="One attestation on Ethereum Attestation Service names every protocol we have reviewed. Ask the API for details."
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

/* ------------------------------------------------ for reviewed protocols */

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
          <BadgeStudio href={`https://l2beat.com${GARDEN_PATH}`} />
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
                <SproutIcon className="mt-1 size-4 shrink-0 text-[#4a7a35] dark:text-[#8fd06a]" />
                <span>
                  <Markup text={rule} />
                </span>
              </li>
            ))}
          </ul>
        </PrimaryCard>
      </section>

      <section className="mt-8 md:mt-12">
        <SectionHeading
          title="Not reviewed yet?"
          description="The garden is open. Answer the submission questions and we will evaluate the protocol against the four crops; if it lands in the set, the badge above is yours."
          size="md"
        />
        <div className="max-md:mx-4">
          <Button asChild variant="fill" className="gap-2">
            <a href={SUBMIT_PROTOCOL_PATH}>
              <SproutIcon />
              Submit your protocol
            </a>
          </Button>
        </div>
      </section>
    </>
  )
}

/* ------------------------------------------------------------- primitives */

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
        'mt-3 rounded-lg bg-surface-tertiary p-4 font-mono text-paragraph-13 leading-relaxed',
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
