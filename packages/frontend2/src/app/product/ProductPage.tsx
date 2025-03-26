export interface ProductProps {
  id: number
  name: string
}

export function ProductPage(props: ProductProps) {
  if (props.id === 2) {
    throw new Error('foo')
  }
  return (
    <div>
      <h1>Product: {props.name}</h1>
      <a href="/">Home</a>
    </div>
  )
}
