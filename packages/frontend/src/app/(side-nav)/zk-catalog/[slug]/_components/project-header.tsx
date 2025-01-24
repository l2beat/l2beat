import Image from 'next/image'

interface Props {
  title: string
  icon: string | undefined
}

export function ProjectHeader(props: Props) {
  return (
    <h1 className="flex items-center justify-start gap-3">
      {props.icon && (
        <Image
          width={32}
          height={32}
          className="size-8 md:size-10"
          src={props.icon}
          alt={`${props.title} logo`}
        />
      )}
      <span className="text-3xl font-bold !leading-none md:text-4xl">
        {props.title}
      </span>
    </h1>
  )
}
