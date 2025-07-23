interface Props {
  title: string
  icon: string | undefined
}

export function ProjectHeader(props: Props) {
  return (
    <h1 className="flex items-center justify-start gap-3">
      {props.icon && (
        <img
          width={32}
          height={32}
          className="size-8 md:size-10"
          src={props.icon}
          alt={`${props.title} logo`}
        />
      )}
      <span className="font-bold text-3xl leading-none! md:text-4xl">
        {props.title}
      </span>
    </h1>
  )
}
