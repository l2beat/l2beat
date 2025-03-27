interface HomeProps {
  city: string
  logoImg: {
    src: string
    width: number
    height: number
  }
  letter: string
  products: number[]
}

export function HomePage(props: HomeProps) {
  return (
    <div>
      <h1 className="bg-blue-500">City: {props.city}</h1>
      <p>Letter: {props.letter}</p>
      <img {...props.logoImg} className="size-16" />
      {props.products.map((p) => (
        <div key={p}>
          <a href={`/product/${p}`}>/product/{p}</a>
        </div>
      ))}
    </div>
  )
}
