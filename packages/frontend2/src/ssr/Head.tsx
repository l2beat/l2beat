export interface HeadProps {
  title: string
  description: string
}

export function Head(props: HeadProps) {
  return (
    <>
      <title>{props.title}</title>
      <meta name="description" content={props.description} />
    </>
  )
}
