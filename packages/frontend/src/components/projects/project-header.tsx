import Image from 'next/image'

interface Props {
  title: string
  slug: string
}

export function ProjectHeader(props: Props) {
  return (
    <h1 className="flex items-center justify-start gap-3">
      {props.slug && (
        <Image
          className="max-md:size-8"
          width={40}
          height={40}
          src={`/icons/${props.slug}.png`}
          alt={`${props.title} logo`}
        />
      )}
      <span className="text-3xl font-bold !leading-none md:text-4xl">
        {props.title}
      </span>
    </h1>
  )
}
