// The rename announcement's wording, split into the parts the page lays out.
// Edit the words here; NewNamePage decides how each part looks.

/** One of the ways L2BEAT tested L2s' promises. */
interface Practice {
  name: string
  text: string
}

/** One of the practical notes: a short title, then the detail. */
export interface Note {
  lead: string
  text: string
  link?: { label: string; href: string }
}

export const NEW_NAME = {
  title: 'L2BEAT is now ETHBEAT',
  lede: 'Our work has grown well beyond layer\u00a02s, and our new name and mandate reflect that.',

  history: {
    heading: 'Five years of L2BEAT',
    opening: [
      'L2BEAT started more than five years ago with one goal: to shed some light on a new and quickly developing category of products built on top of Ethereum, the Layer 2s.',
      'Times were different back then. We were just past DeFi Summer and ahead of the NFT craze. Ethereum was having its comeback moment, but it faced scaling issues: gas prices during network congestion were crippling broader adoption.',
    ],
    question:
      "That's where L2s came in, promising to scale Ethereum while inheriting its security guarantees. But did they?",
    practicesIntro: 'We tried to answer that question in many different ways:',
    practices: [
      {
        name: 'Tracking adoption',
        text: 'We built dashboards to track the growth of L2s, starting with TVL, later reframed as Total Value Secured (TVS), and expanding into activity and other metrics.',
      },
      {
        name: 'Understanding how systems actually work',
        text: 'We examined the source code of deployed smart contracts to explain how projects implemented their promises onchain. We surfaced the gaps between those promises and the guarantees users actually received - the “training wheels” introduced to work around unresolved technical challenges.',
      },
      {
        name: 'Developing and maintaining standards',
        text: 'Through our risk assessments and the Stages Framework, we made the tradeoffs of using L2s more visible. We tracked progress toward removing training wheels and pushed for higher standards across the ecosystem.',
      },
      {
        name: 'Monitoring changes',
        text: 'We built a monitoring system to detect changes to the smart contracts behind the projects we cover. Our researchers review and classify those changes, keeping assessments up to date as the systems evolve.',
      },
      {
        name: 'Participating in governance',
        text: 'We took part in L2 DAO governance, at times as one of the largest and most active delegates in the Optimism Collective, Arbitrum DAO, ZK Nation, Scroll DAO, and others, helping shape decisions about how these systems are developed and governed.',
      },
      {
        name: 'Bringing people together',
        text: 'We organized conferences focused on the development of the L2 ecosystem, including Layer Two Amsterdam, L2Warsaw, and L2DAYS Istanbul, alongside smaller meetups and gatherings.',
      },
      {
        name: 'Contributing to research and development',
        text: 'Last but not least, we were active in R&D, joining various working groups and, most notably, driving the research on native rollups.',
      },
    ] satisfies Practice[],
    closing:
      'Over those years, we became a central reference point for Ethereum L2 development, keeping the space accountable and pushing it to live up to its "scaling Ethereum" claims.',
  },

  change: {
    heading: 'But Ethereum has changed',
    paragraphs: [
      'Scaling is now being addressed directly at the L1 protocol level, and Layer 2s are finding product-market fit outside of scaling Ethereum, offering specialized onchain products that go beyond what a credibly neutral base layer can provide.',
      'Meanwhile, more and more solutions are being built on Ethereum across privacy, interop, DeFi, and beyond. Users are asking the same questions about them that they once asked about L2s:',
    ],
    questions: [
      "Which of Ethereum's core properties do these solutions inherit?",
      'Which claims are real, and which are just marketing?',
      'Whom do they actually have to trust?',
    ],
    after: [
      "We've been asking those questions too, gradually expanding what we cover: first ZK components through our ZK Catalog, then interop, privacy solutions, tokens, blob usage, and more to come.",
      "We haven't been focused solely on Layer 2s for quite some time, so it only makes sense for our name to reflect that. This doesn't mean we're leaving L2s behind. Our coverage isn't going anywhere, and we'll keep monitoring them as closely as ever. They're just no longer our main focus.",
      "We're excited about the future of Ethereum, and we want to work alongside other Ethereum-focused organizations to bring the transparency and scrutiny we're known for in the L2 space to the broader ecosystem.",
    ],
  },

  coverage: {
    heading: 'What we cover today',
    areas: [
      { label: 'Ethereum', href: '/projects/ethereum' },
      { label: 'Privacy', href: '/privacy/summary' },
      { label: 'ZK Catalog', href: '/zk-catalog' },
      { label: 'Interop', href: '/interop/summary' },
      { label: 'Layer 2s', href: '/layer2s/summary' },
      { label: 'Tokens', href: '/tokens' },
      { label: 'Blobs', href: '/blobs' },
    ],
  },

  mandate: {
    text: "To make clear what this means in practice, we've set out our plans and scope in a mandate that will guide our next steps.",
    link: 'Read the mandate',
  },

  practical: {
    heading: 'What this means for you',
    changed: [
      {
        lead: 'The name and the logo',
        text: 'ETHBEAT, with a new hand\u2011lettered heart.',
      },
      {
        lead: 'The address',
        text: 'The site now lives at ethbeat.org. Every l2beat.com link redirects permanently to the same page there.',
      },
      {
        lead: 'Link previews',
        text: 'Pages shared on X, Telegram and elsewhere show new preview images. Platforms cache previews, so older posts may show the old ones for a while.',
      },
      {
        lead: 'Social accounts',
        text: 'On X we are now @ethbeat_org. Our other accounts will follow.',
        link: { label: '@ethbeat_org', href: 'https://x.com/ethbeat_org' },
      },
    ] satisfies Note[],
    unchanged: [
      {
        lead: 'The team and our independence',
        text: 'The same people do the research, funded in the open as a public good.',
        link: { label: 'How we are funded', href: '/donate' },
      },
      {
        lead: 'The methodology',
        text: 'Our risk frameworks, the Stages framework and every assessment are unchanged. No project was re\u2011scored because of the rename.',
      },
      {
        lead: 'The data',
        text: 'Every project page, chart and history is where it was, under the same path.',
      },
      {
        lead: 'Open source',
        text: 'The code and every project config stay at github.com/l2beat/l2beat.',
        link: {
          label: 'github.com/l2beat/l2beat',
          href: 'https://github.com/l2beat/l2beat',
        },
      },
    ] satisfies Note[],
    links: {
      heading: 'Old links keep working',
      text: 'Only the domain changes. Everything after it stays the same, and the redirects stay indefinitely.',
      examples: [
        '/layer2s/summary',
        '/layer2s/projects/arbitrum',
        '/api/scaling/summary',
        '/llms.txt',
      ],
      notes: [
        {
          lead: 'The API',
          text: 'Same endpoints, same responses. Point your clients at ethbeat.org when you can: most HTTP clients follow redirects, some do not.',
        },
        {
          lead: 'Badges',
          text: 'CROPS badges keep loading from their old URLs and now show the new name. A badge pasted as inline markup keeps its old text until you copy the markup again.',
        },
        {
          lead: 'Forum, Disco and tools',
          text: 'They move to ethbeat.org later on launch day, and their l2beat.com addresses redirect there too.',
        },
        {
          lead: 'Citing us',
          text: '"ETHBEAT (formerly L2BEAT)" helps readers who know the old name.',
        },
      ] satisfies Note[],
    },
    questions: {
      text: 'Questions? Ask on the',
      link: { label: 'forum', href: 'https://forum.l2beat.com' },
    },
  },
} as const
