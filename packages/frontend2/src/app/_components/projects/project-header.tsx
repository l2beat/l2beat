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
      <span className="text-3xl font-bold md:text-4xl">{props.title}</span>
    </h1>
  )
}
