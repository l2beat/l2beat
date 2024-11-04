import Link from 'next/link'

export default function Page() {
  return (
    <div>
      <div>Internal L2BEAT tools:</div>
      <ul className="list-inside list-disc">
        <li>
          <Link href="/tools/logo-generator">Logo Generator</Link>
        </li>
      </ul>
    </div>
  )
}
