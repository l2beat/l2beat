import Image from 'next/image'
import { Logo } from '~/components/logo'

export interface FinalityDiagram {
  name: string
  src: {
    dark: {
      desktop: string | undefined
      mobile: string | undefined
    }
    light: {
      desktop: string | undefined
      mobile: string | undefined
    }
  }
}

interface Props {
  diagrams: FinalityDiagram[]
  className?: string
}

export function FinalityDiagramsSection({ diagrams, className }: Props) {
  if (diagrams.length === 0) return null

  return (
    // TODO: re-enable section once diagrams are ready
    <section className={className} style={{ display: 'none' }}>
      <h2 className="mb-6 text-3xl font-bold">Finality diagrams</h2>
      <div className="flex flex-col gap-4">
        {diagrams.map((diagram) => (
          <Diagram key={diagram.name} diagram={diagram} />
        ))}
      </div>
    </section>
  )
}

function Diagram({ diagram }: { diagram: FinalityDiagram }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border-2 border-gray-50 bg-[#F1F3F7] p-4 dark:border-zinc-500 dark:bg-zinc-900 md:flex-row md:gap-0 md:p-8">
      <div className="flex flex-col justify-between md:w-[190px]">
        <h3 className="whitespace-pre-line text-xl font-bold leading-tight dark:text-[#F27935]">
          {diagram.name}
        </h3>
        <Logo className="hidden scale-75 md:block" animated={false} />
      </div>
      {diagram.src.dark.desktop && (
        <Image
          loading="lazy"
          width={0}
          height={0}
          sizes="100vw"
          alt={`${diagram.name} diagram`}
          src={diagram.src.dark.desktop}
          className="mx-auto hidden w-[calc(100%-190px)] dark:md:block"
        />
      )}

      {diagram.src.dark.mobile && (
        <Image
          loading="lazy"
          width={0}
          height={0}
          sizes="100vw"
          alt={`${diagram.name} diagram`}
          src={diagram.src.dark.mobile}
          className="hidden size-full dark:block md:!hidden"
        />
      )}

      {diagram.src.light.desktop && (
        <Image
          loading="lazy"
          width={0}
          height={0}
          sizes="100vw"
          alt={`${diagram.name} diagram`}
          src={diagram.src.light.desktop}
          className="mx-auto hidden w-[calc(100%-190px)] dark:hidden md:block"
        />
      )}

      {diagram.src.light.mobile && (
        <Image
          loading="lazy"
          width={0}
          height={0}
          sizes="100vw"
          alt={`${diagram.name} diagram`}
          src={diagram.src.light.mobile}
          className="size-full dark:hidden md:hidden"
        />
      )}
      <Logo className="scale-75 md:hidden" animated={false} />
    </div>
  )
}
