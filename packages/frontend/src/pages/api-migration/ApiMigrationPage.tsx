import type { ReactNode } from 'react'
import { buttonVariants } from '~/components/core/Button'
import { MainPageHeader } from '~/components/MainPageHeader'
import { Markdown } from '~/components/markdown/Markdown'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { cn } from '~/utils/cn'
import type {
  ApiMigrationGuide,
  EndpointGuide,
  FieldChange,
  GuideNote,
} from './apiMigrationGuide'
import { GONE, NEW_FIELD } from './fieldLabels'

interface Props extends AppLayoutProps {
  guide: ApiMigrationGuide
}

export function ApiMigrationPage({ guide, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>{guide.title}</MainPageHeader>
        <main className="flex flex-col max-md:divide-y max-md:divide-divider md:gap-4">
          <Overview guide={guide} />
          <Migration migration={guide.migration} />
          <Brownouts brownouts={guide.brownouts} />
          <EndpointMap endpoints={guide.endpoints} />
          <div className="grid max-md:divide-y max-md:divide-divider md:gap-4 xl:grid-cols-2">
            <ProjectIds ids={guide.ids} />
            <GeneralChanges general={guide.general} />
          </div>
          {guide.endpoints.map((endpoint) => (
            <EndpointSection key={endpoint.id} endpoint={endpoint} />
          ))}
        </main>
      </SideNavLayout>
    </AppLayout>
  )
}

function Overview({ guide }: { guide: ApiMigrationGuide }) {
  return (
    <PrimaryCard>
      <Eyebrow>API upgrade</Eyebrow>
      {/* MainPageHeader shows its title on desktop only */}
      <h1 className="mt-1 font-bold text-2xl lg:hidden">{guide.title}</h1>
      <Text className="mt-2 text-lg leading-7">{guide.lede}</Text>
      <div className="mt-4 flex flex-wrap gap-2">
        {guide.links.map((link, i) => (
          <a
            key={link.url}
            href={link.url}
            className={buttonVariants({
              variant: i === 0 ? 'fill' : 'outline',
              // The primary action is white on pink in both themes
              className: i === 0 ? 'text-white' : undefined,
            })}
          >
            {link.label}
          </a>
        ))}
      </div>
      <h2 className={cn(HEADING, 'mt-7')}>{guide.benefits.title}</h2>
      <ul className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {guide.benefits.notes.map((note) => (
          <li
            key={note.title}
            className="rounded-lg bg-surface-secondary px-4 py-3"
          >
            {note.title && <Text className="font-bold">{note.title}</Text>}
            <Text className="mt-1 text-sm leading-5">{note.text}</Text>
          </li>
        ))}
      </ul>
    </PrimaryCard>
  )
}

function Migration({
  migration,
}: {
  migration: ApiMigrationGuide['migration']
}) {
  return (
    <PrimaryCard>
      <Eyebrow>Action needed</Eyebrow>
      <h2 className={cn(HEADING, 'mt-1')}>{migration.title}</h2>
      <dl className="grid gap-2 md:grid-cols-3">
        {migration.facts.map((fact) => (
          <div
            key={fact.label}
            className="rounded-lg bg-surface-secondary px-4 py-3"
          >
            <dt className={LABEL}>{fact.label}</dt>
            <dd className="mt-1 font-bold text-xl">{fact.value}</dd>
            <dd className="text-sm">
              <Text>{fact.detail}</Text>
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex flex-col gap-3">
        {migration.intro.map((paragraph) => (
          <Text key={paragraph}>{paragraph}</Text>
        ))}
      </div>
    </PrimaryCard>
  )
}

function Brownouts({
  brownouts,
}: {
  brownouts: ApiMigrationGuide['brownouts']
}) {
  return (
    <PrimaryCard>
      <h2 className={HEADING}>{brownouts.title}</h2>
      <div className="grid gap-x-8 gap-y-4 xl:grid-cols-2">
        <div className="flex flex-col gap-3">
          {brownouts.text.map((paragraph) => (
            <Text key={paragraph}>{paragraph}</Text>
          ))}
        </div>
        <DataTable header={['Day (UTC)', 'First window', 'Second window']}>
          {brownouts.days.map(({ day, windows }) => (
            <tr key={day} className={ROW}>
              <td className={cn(CELL, 'whitespace-nowrap')}>{day}</td>
              {windows.map((window) => (
                <td
                  key={window}
                  className={cn(CELL, 'whitespace-nowrap tabular-nums')}
                >
                  {window}
                </td>
              ))}
            </tr>
          ))}
        </DataTable>
      </div>
    </PrimaryCard>
  )
}

function EndpointMap({ endpoints }: { endpoints: EndpointGuide[] }) {
  return (
    <PrimaryCard>
      <h2 className={HEADING}>Old and new endpoints</h2>
      <DataTable header={['Endpoint', 'Old', 'New']}>
        {endpoints.map((endpoint) => (
          <tr key={endpoint.id} className={ROW}>
            <td className={CELL}>
              <a
                href={`#${endpoint.id}`}
                className="whitespace-nowrap font-medium text-link underline"
              >
                {endpoint.name}
              </a>
            </td>
            <td className={CELL}>
              <Code>{endpoint.oldPath}</Code>
            </td>
            <td className={CELL}>
              <Code>{endpoint.newPath}</Code>
            </td>
          </tr>
        ))}
      </DataTable>
    </PrimaryCard>
  )
}

function ProjectIds({ ids }: { ids: ApiMigrationGuide['ids'] }) {
  return (
    <PrimaryCard>
      <h2 className={HEADING}>{ids.title}</h2>
      <div className="flex flex-col gap-3">
        {ids.text.map((paragraph) => (
          <Text key={paragraph}>{paragraph}</Text>
        ))}
      </div>
      <DataTable header={['Project', 'Slug', 'Id']} className="mt-4">
        {ids.examples.map((example) => (
          <tr key={example.slug} className={ROW}>
            <td className={CELL}>{example.project}</td>
            <td className={CELL}>
              <Code>{example.slug}</Code>
            </td>
            <td className={CELL}>
              <Code>{example.id}</Code>
            </td>
          </tr>
        ))}
      </DataTable>
    </PrimaryCard>
  )
}

function GeneralChanges({
  general,
}: {
  general: ApiMigrationGuide['general']
}) {
  return (
    <PrimaryCard>
      <h2 className={HEADING}>{general.title}</h2>
      <Notes notes={general.notes} />
    </PrimaryCard>
  )
}

function EndpointSection({ endpoint }: { endpoint: EndpointGuide }) {
  return (
    <PrimaryCard id={endpoint.id} className="scroll-mt-4">
      <Eyebrow>Endpoint</Eyebrow>
      <h2 className={cn(HEADING, 'mt-1')}>{endpoint.name}</h2>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg bg-surface-secondary px-4 py-3">
        <PathLabel label="Old">{endpoint.oldPath}</PathLabel>
        <ArrowRightIcon className="size-4 shrink-0 fill-current max-md:hidden" />
        <PathLabel label="New">{endpoint.newPath}</PathLabel>
      </div>
      <p className="mt-3">
        Try it:{' '}
        <a
          href={endpoint.exampleUrl}
          className="break-all font-medium text-link underline"
        >
          {endpoint.exampleUrl}
        </a>
      </p>
      {endpoint.text.map((paragraph) => (
        <Text key={paragraph} className="mt-3">
          {paragraph}
        </Text>
      ))}
      {endpoint.fields && (
        <>
          <h3 className={SUBHEADING}>{endpoint.fields.title}</h3>
          <DataTable header={['Old', 'New', 'Notes']} lastColumnFromMd>
            {endpoint.fields.changes.map((change) => (
              <FieldRow
                key={`${change.before}${change.after}`}
                change={change}
              />
            ))}
          </DataTable>
        </>
      )}
      {endpoint.differences.length > 0 && (
        <>
          <h3 className={SUBHEADING}>Differences in the numbers</h3>
          <Notes notes={endpoint.differences} />
        </>
      )}
    </PrimaryCard>
  )
}

/** On phones the note gets a row of its own, so it is read without scrolling sideways. */
function FieldRow({ change }: { change: FieldChange }) {
  const note = change.note && <Text>{change.note}</Text>
  return (
    <>
      <tr className={cn(ROW, note && 'max-md:border-b-0')}>
        <td className={cn(CELL, 'w-1/2 md:w-1/4')}>
          {change.before ? (
            <Text>{change.before}</Text>
          ) : (
            <Tag>{NEW_FIELD}</Tag>
          )}
        </td>
        <td className={cn(CELL, 'w-1/2 md:w-1/4')}>
          {change.after ? <Text>{change.after}</Text> : <Tag>{GONE}</Tag>}
        </td>
        <td className={cn(CELL, 'max-md:hidden')}>{note}</td>
      </tr>
      {note && (
        <tr className={cn(ROW, 'md:hidden')}>
          <td colSpan={2} className={cn(CELL, 'pt-0')}>
            {note}
          </td>
        </tr>
      )}
    </>
  )
}

function Notes({ notes }: { notes: GuideNote[] }) {
  return (
    <ul className="divide-y divide-divider">
      {notes.map((note) => (
        <li key={note.title ?? note.text} className="py-3 first:pt-0 last:pb-0">
          {note.title && (
            <Text className="font-bold leading-6">{note.title}</Text>
          )}
          <Text className="leading-6">{note.text}</Text>
        </li>
      ))}
    </ul>
  )
}

function DataTable(props: {
  header: string[]
  /** The last column is left out on phones, where its cells move below their row. */
  lastColumnFromMd?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn('-mx-4 overflow-x-auto md:mx-0', props.className)}>
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-divider border-b">
            {props.header.map((label, i) => (
              <th
                key={label}
                className={cn(
                  CELL,
                  LABEL,
                  'py-2',
                  props.lastColumnFromMd &&
                    i === props.header.length - 1 &&
                    'max-md:hidden',
                )}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{props.children}</tbody>
      </table>
    </div>
  )
}

function PathLabel(props: { label: string; children: string }) {
  return (
    <span className="flex min-w-0 items-baseline gap-2">
      <span className={LABEL}>{props.label}</span>
      <code className="break-all font-mono font-semibold text-sm">
        {props.children}
      </code>
    </span>
  )
}

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="text-brand-deep text-subtitle-12 uppercase">{children}</p>
  )
}

function Tag({ children }: { children: string }) {
  return (
    <span className="rounded bg-surface-secondary px-1.5 py-0.5 font-medium text-2xs uppercase">
      {children}
    </span>
  )
}

function Code({ children }: { children: string }) {
  return <code className="break-all font-mono text-sm">{children}</code>
}

/** A text of the guide: inline markdown, so `code` and links render. */
function Text(props: { children: string; className?: string }) {
  return (
    <Markdown inline ignoreGlossary className={cn('block', props.className)}>
      {props.children}
    </Markdown>
  )
}

const HEADING = 'mb-3 font-bold text-xl'
const SUBHEADING = 'mt-6 mb-2 font-bold text-base'
const LABEL = 'font-medium text-2xs uppercase tracking-wide'
const ROW = 'border-divider border-b last:border-b-0 align-top'
const CELL = 'px-4 py-2.5 md:px-3 md:first:pl-0 md:last:pr-0'
