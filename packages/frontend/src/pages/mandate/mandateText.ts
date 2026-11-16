// The mandate's wording, split into the parts the page lays out. Edit the words
// here; MandatePage decides how each part looks.

export interface MandateSource {
  title: string
  href: string
}

/** One of the harms intermediaries do, with the cases that show it. */
interface MandateHarm {
  claim: string
  sources: MandateSource[]
}

/** One of the four things we do: `before` + `verb` + `after` is the sentence. */
interface MandateVerb {
  name: string
  before: string
  verb: string
  after: string
}

const custody: MandateSource[] = [
  {
    title: 'FTX customer funds stolen',
    href: 'https://www.justice.gov/usao-sdny/pr/samuel-bankman-fried-sentenced-25-years-prison',
  },
  {
    title: 'Celsius fraud and withdrawal freeze',
    href: 'https://www.justice.gov/usao-sdny/pr/founder-celsius-sentenced-12-years-fraud-and-market-manipulation',
  },
  {
    title: 'QuadrigaCX customer funds misappropriated',
    href: 'https://www.osc.gov.on.ca/quadrigacxreport/',
  },
  {
    title: 'Cyprus bank deposits frozen and converted into equity',
    href: 'https://www.centralbank.cy/images/media/pdf/BES_CBC%20Working%20Paper%202018_1.pdf',
  },
  {
    title: 'Canadian protest-related bank account freezes',
    href: 'https://www.ourcommons.ca/DocumentViewer/en/11629827',
  },
  {
    title: 'Paxos freezes gold-backed tokens on Ethereum',
    href: 'https://www.paxos.com/blog/paxos-freezes-paxg-tokens-related-to-ftx',
  },
]

const payments: MandateSource[] = [
  {
    title: 'PayPal blocks WikiLeaks donations',
    href: 'https://wikileaks.org/PayPal-freezes-WikiLeaks-donations-482.html',
  },
  {
    title: 'PayPal freezes Proton Mail crowdfunding funds',
    href: 'https://proton.me/blog/paypal-freezes-protonmail-campaign-funds',
  },
  {
    title: 'Payment processors restrict adult content on itch.io',
    href: 'https://itch.io/t/5149036/reindexing-adult-nsfw-content',
  },
  {
    title: 'Infura mistakenly blocks Venezuelan users',
    href: 'https://www.coindesk.com/policy/2022/03/03/metamask-infura-block-certain-areas-amid-crypto-sanctions-fury',
  },
  {
    title: 'DeFi frontends block users over Tornado Cash exposure',
    href: 'https://cryptoslate.com/defi-protocols-aave-uniswap-balancer-ban-users-following-ofac-sanctions-on-tornado-cash/',
  },
  {
    title: 'Ethereum MEV relays filter sanctioned transactions',
    href: 'https://collective.flashbots.net/t/flashbots-transparency-report-october-2022/721',
  },
]

const personalData: MandateSource[] = [
  {
    title: 'Yahoo account data used to identify and imprison a journalist',
    href: 'https://cpj.org/2005/09/yahoo-gave-email-account-data-used-to-imprison-jou/',
  },
  {
    title: 'Twitter employee supplies private user data to Saudi officials',
    href: 'https://www.justice.gov/opa/pr/former-twitter-employee-sentenced-42-months-federal-prison-acting-foreign-agent',
  },
  {
    title: 'X-Mode sells sensitive location data',
    href: 'https://www.ftc.gov/news-events/news/press-releases/2024/01/ftc-order-prohibits-data-broker-x-mode-social-outlogic-selling-sensitive-location-data',
  },
  {
    title: 'Stolen Coinbase customer data used in targeted scams',
    href: 'https://www.coinbase.com/en-de/blog/protecting-our-customers-standing-up-to-extortionists',
  },
  {
    title: 'Kroll breach exposes crypto creditors’ data amid phishing attacks',
    href: 'https://krebsonsecurity.com/2023/08/kroll-employee-sim-swapped-for-crypto-investor-data/',
  },
  {
    title: 'Celsius bankruptcy filings expose customer names and transactions',
    href: 'https://blockworks.com/news/celsius-exposes-user-information-in-public-court-docs',
  },
]

export const MANDATE = {
  belief:
    'We believe disintermediation is one of the most effective ways to protect individual freedom.',
  problem: {
    opening:
      'Intermediaries concentrate power, which tempts them to abuse it and makes them targets for anyone who wants to use it against you.',
    harms: [
      {
        claim: 'Custodians and issuers can steal or freeze your funds',
        sources: custody,
      },
      {
        claim:
          'Payment processors and frontends can cut off your ability to transact',
        sources: payments,
      },
      {
        claim:
          'Services that hold your personal information can leak it, sell it, or hand it over',
        sources: personalData,
      },
    ] satisfies MandateHarm[],
    closing:
      'Even an honest intermediary is a single point of failure and a single point of pressure.',
  },
  ethereum:
    'Blockchains and cryptography are our strongest tools for reducing this dependence. Ethereum is built for distributed verification: people can run full nodes locally, on consumer hardware, with open source and independently developed clients and tooling. Its public specifications and open governance process allow anyone to scrutinize the protocol and shape its future. But that alone does not eliminate intermediaries. Anyone can build on Ethereum, including applications that recreate the old dependencies.',
  mission:
    'As L2BEAT, we spent years exposing these dependencies across rollups, bridges, and data availability layers, and pushing projects to remove them. ETHBEAT brings the same scrutiny to the parts of Ethereum that benefit the most: where people depend on these guarantees, and where better options exist or are within reach. Our mission is to help people understand and reduce their dependence on intermediaries.',
  verbs: [
    {
      name: 'Research',
      before: 'We ',
      verb: 'research',
      after:
        ' how systems actually work and track how their guarantees change. We explain whom users must trust, what those parties can do, and whether users can still get out if everyone else walks away.',
    },
    {
      name: 'Recognize',
      before: 'We ',
      verb: 'recognize',
      after:
        ' applications that uphold censorship resistance, open source, privacy, and security, so that people can find them and builders who preserve these properties gain users and support.',
    },
    {
      name: 'Develop standards',
      before: 'We ',
      verb: 'develop standards',
      after:
        ' with researchers, builders, and users, both for assessing systems and for building them better.',
    },
    {
      name: 'Build',
      before: 'And because cypherpunks write code, we ',
      verb: 'build',
      after: ' open source tools that put these principles into practice.',
    },
  ] satisfies MandateVerb[],
  promise: {
    pledge: 'We don’t want to become another intermediary you have to trust.',
    terms:
      'Our funding sources are public, and no one can pay for a more favourable assessment. We publish our methods, evidence, and reasoning so that anyone can check our work, challenge it, and build on it. We hold ourselves to the same scrutiny we apply to others.',
  },
}
