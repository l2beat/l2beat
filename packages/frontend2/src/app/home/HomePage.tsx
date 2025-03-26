interface HomeProps {
  city: string
  letter: string
  products: number[]
}

export function HomePage(props: HomeProps) {
  return (
    <div>
      <h1>City: {props.city}</h1>
      <p>Letter: {props.letter}</p>
      {/* <img src={logo} width={50} height={50} /> */}
      {props.products.map((p) => (
        <div key={p}>
          <a href={`/product/${p}`}>/product/{p}</a>
        </div>
      ))}
    </div>
  )
}
