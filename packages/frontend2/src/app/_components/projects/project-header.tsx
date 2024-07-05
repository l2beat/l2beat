import Image from 'next/image'

interface Props {
  title: string
  src: string | undefined
}

export function ProjectHeader(props: Props) {
  return (
    <h1 className="flex items-center justify-start gap-3">
      {props.src && (
        <Image
          className="max-md:size-8"
          width={40}
          height={40}
          src={props.src}
          alt={`${props.title} logo`}
        />
      )}
      <span className="font-bold text-3xl md:text-4xl !leading-none">
        {props.title}
      </span>
    </h1>
  )
}
