export default async function Page({
  params: { address },
}: {
  params: { address: string }
}) {
  return (
    <main>
      <h1>Hello {address}!</h1>
    </main>
  )
}
