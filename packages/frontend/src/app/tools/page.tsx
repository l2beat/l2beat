import Link from 'next/link'

export default function Page() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Internal L2BEAT tools:</h1>
      <ul className="list-inside list-disc">
        <li>
          <Link href="/tools/logo-generator">Logo Generator</Link>
        </li>
        <li>
          <a href="https://calldata.l2beat.com/">Transaction Decoder</a>
        </li>
        <li>
          <a href="https://protocolbeat.l2beat.com/">ProtocolBeat</a>
        </li>
        <li>
          <a href="https://uops.l2beat.com/">User Operations Analyzer</a>
        </li>
      </ul>
    </div>
  )
}
