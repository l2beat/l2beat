export function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Hero */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-text-primary">About DeFiScan</h1>
      </div>

      {/* Our Mission */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-text-primary">Our Mission</h2>
        <p className="mt-4 text-text-secondary leading-relaxed">
          DeFiScan is dedicated to increasing transparency and trust in the decentralized finance (DeFi) ecosystem. We provide comprehensive analysis and ratings of DeFi protocols, helping users make informed decisions about their participation in various protocols.
        </p>
        <p className="mt-4 text-text-secondary leading-relaxed">
          Our goal is to evaluate and track the decentralization progress of DeFi protocols across multiple dimensions, including governance, autonomy, accessibility, and operational decentralization. By providing clear, objective assessments, we aim to promote higher standards and better practices across the entire DeFi space.
        </p>
      </section>

      {/* Open Source */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-text-primary">
          Open Source & Public Good
        </h2>
        <p className="mt-4 text-text-secondary leading-relaxed">
          DeFiScan is a public good. All reviews are freely available, and the
          tooling is open source. Our analysis framework builds on{' '}
          <a
            href="https://l2beat.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-800 transition-colors"
          >
            L2BEAT
          </a>
          's battle-tested contract discovery engine, extending it with
          DeFi-focused capabilities.
        </p>
        <p className="mt-4 text-text-secondary leading-relaxed">
          Anyone can inspect our methodology, reproduce our findings, or
          contribute to the project. Transparency in our own process is just as
          important as the transparency we seek to bring to DeFi.
        </p>
      </section>

      {/* The DeFi Collective */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-text-primary">
          The DeFi Collective
        </h2>
        <p className="mt-4 text-text-secondary leading-relaxed">
          DeFiScan is an initiative by{' '}
          <a
            href="https://deficollective.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-800 transition-colors"
          >
            The DeFi Collective
          </a>
          , a Zug-based non-profit association dedicated to fostering a
          transparent and resilient decentralized finance ecosystem. The
          Collective brings together researchers, developers, and DeFi
          practitioners who share a commitment to user protection and protocol
          accountability.
        </p>
        <p className="mt-4 text-text-secondary leading-relaxed">
          DeFiScan is funded through grants from the Ethereum Foundation,
          community donations, and support from The DeFi Collective. This
          funding model ensures that our reviews remain independent and free
          from conflicts of interest.
        </p>
      </section>

      {/* Support Us */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-text-primary">Support Us</h2>
        <p className="mt-4 text-text-secondary leading-relaxed">
          DeFiScan is free for everyone. If you find our
          reviews useful, consider supporting our mission with a donation. Your
          contribution helps us cover infrastructure costs, fund our researchers, and
          expand our coverage to more protocols.
        </p>
        <p className="mt-4 text-text-secondary leading-relaxed">
          You can donate directly to{' '}
          <a
            href="https://etherscan.io/address/0xDc6f869d2D34E4aee3E89A51f2Af6D54F0F7f690"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-purple-600 hover:text-purple-800 bg-bg-muted px-2 py-0.5 rounded transition-colors"
          >
            grantsfortheants.eth
          </a>
          . Every contribution, no matter the size, makes a difference.
        </p>
      </section>
    </div>
  )
}

function DimensionCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      <p className="mt-2 text-sm text-text-secondary leading-relaxed">
        {description}
      </p>
    </div>
  )
}
