import { staticUrl } from '../../common/manifest'

interface HomeProps {
  city: string
  letter: string
  products: number[]
}

export function HomePage(props: HomeProps) {
  return (
    <div>
      <h1 className="bg-blue-500">City: {props.city}</h1>
      <p>Letter: {props.letter}</p>
      <img src={staticUrl('/static/logo.png')} width={50} height={50} />
      {props.products.map((p) => (
        <div key={p}>
          <a href={`/product/${p}`}>/product/{p}</a>
        </div>
      ))}
    </div>
  )
}
