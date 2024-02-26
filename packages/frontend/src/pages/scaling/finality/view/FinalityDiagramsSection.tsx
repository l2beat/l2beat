import React from 'react'

import { Logo } from '../../../../components'

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
    <section className={className}>
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
      <img
        loading="lazy"
        alt={`${diagram.name} diagram`}
        src={diagram.src.dark.desktop}
        className="mx-auto hidden w-[calc(100%-190px)] dark:md:block"
      />
      <img
        loading="lazy"
        alt={`${diagram.name} diagram`}
        src={diagram.src.dark.mobile}
        className="hidden size-full dark:block md:!hidden"
      />
      <img
        loading="lazy"
        alt={`${diagram.name} diagram`}
        src={diagram.src.light.desktop}
        className="mx-auto hidden w-[calc(100%-190px)] dark:hidden md:block"
      />
      <img
        loading="lazy"
        alt={`${diagram.name} diagram`}
        src={diagram.src.light.mobile}
        className="size-full dark:hidden md:hidden"
      />
      <Logo className="scale-75 md:hidden" animated={false} />
    </div>
  )
}
