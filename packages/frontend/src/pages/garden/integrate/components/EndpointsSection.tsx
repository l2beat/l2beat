import type { ReactNode } from 'react'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { SectionHeading } from '../../components/SectionHeading'
import { SproutIcon } from '../../components/SproutIcon'
import type { CropsApiEndpoint } from '../content'
import {
  API_NOTES,
  CROPS_API_DOCS_URL,
  CROPS_API_SPEC_URL,
  CROPS_API_URL,
} from '../content'
import type {
  IntegrateExample,
  IntegrateExamples,
} from '../getIntegrateExamples'
import { CodeSnippet, RequestHeader } from './CodeSnippet'
import { JsonView } from './JsonView'
import { Code, Markup } from './Markup'

export function EndpointsSection({
  endpoints,
  examples,
}: {
  endpoints: CropsApiEndpoint[]
  examples: IntegrateExamples
}) {
  return (
    <section className="mt-6 md:mt-8">
      <SectionHeading
        title="Endpoints"
        description={`Static JSON files on ${CROPS_API_URL}, regenerated on every change to the reviews.`}
      />
      <ApiNotes />
      <div className="mt-4 flex flex-col gap-4 md:mt-6 md:gap-6">
        {endpoints.map((endpoint) => (
          <EndpointCard
            key={endpoint.key}
            endpoint={endpoint}
            example={examples[endpoint.key]}
          />
        ))}
      </div>
    </section>
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
  endpoint: CropsApiEndpoint
  example: IntegrateExample
}) {
  return (
    <PrimaryCard className="max-md:mx-4 md:p-8">
      <Code>{endpoint.path}</Code>
      <h3 className="mt-3 font-bold text-heading-20">{endpoint.summary}</h3>
      <p className="mt-1 max-w-3xl text-paragraph-14 text-secondary md:text-paragraph-16">
        <Markup text={endpoint.description} />
      </p>
      {endpoint.params.length > 0 && (
        <dl className="mt-4 flex flex-col gap-2">
          {endpoint.params.map((param) => (
            <Term key={param.name} name={param.name}>
              {param.description}
            </Term>
          ))}
          {endpoint.notFound && <Term name="404">{endpoint.notFound}</Term>}
        </dl>
      )}
      <CodeSnippet
        className="mt-4"
        header={<RequestHeader url={example.request} />}
        copy={example.request}
        copyText="Copy URL"
      />
      <CodeSnippet className="mt-3" label="response">
        <JsonView value={example.response} />
      </CodeSnippet>
    </PrimaryCard>
  )
}

function Term({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div>
      <dt className="font-semibold text-paragraph-14">
        <Code>{name}</Code>
      </dt>
      <dd className="text-paragraph-14 text-secondary">{children}</dd>
    </div>
  )
}
