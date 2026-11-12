/**
 * One entry of the privacy methodology's tool lists: an outside app or system
 * our advice steps tell the user to get.
 */
export interface PrivacyTool {
  /**
   * `route` entries pass the IP-hiding route checks and list under Routes, the
   * others under Tools.
   */
  kind: 'route' | 'tool'
  /** Id of the entry on the methodology page, which steps link. */
  anchor: string
  /**
   * The names steps use for it. A step that prints one links the entry, which
   * a config test checks.
   */
  names: string[]
  /** Markdown head of the entry, with the official download of each app. */
  head: string
  /**
   * Markdown after the head: the effort first, then what it does, why we
   * chose it over the alternatives, and what the user must know.
   */
  text: string
}

/**
 * Every outside app our advice names, in the order the methodology lists
 * them: routes by the effort they take, then the other tools. An app joins
 * with the reason we chose it, and a step links its entry, never the vendor.
 */
export const PRIVACY_TOOLS = {
  torBrowser: {
    kind: 'route',
    anchor: 'tool-tor-browser',
    names: ['Tor Browser'],
    head: '[Tor Browser](https://www.torproject.org/download/)',
    text: 'a free install. Websites, each site on its own circuit.',
  },
  nymVpn: {
    kind: 'route',
    anchor: 'tool-nymvpn',
    names: ['NymVPN'],
    head: '[NymVPN](https://nym.com/download) with the Random profile',
    text: 'a paid install. All traffic on desktop and mobile, UDP included. Its exits accept only listed ports. Its default and mixnet profiles pick gateways near the user, which fails the second check in some regions. It sends network statistics under a persistent id until Anonymous network stats is turned off in its settings.',
  },
  orbot: {
    kind: 'route',
    anchor: 'tool-orbot',
    names: ['Orbot'],
    head: "[Orbot](https://orbot.app/en/download/)'s VPN mode",
    text: 'a free install on Android. All traffic through Tor, which carries no UDP.',
  },
  torSystems: {
    kind: 'route',
    anchor: 'tool-tor-systems',
    names: ['Tails', 'Whonix', 'Qubes OS'],
    head: '[Tails](https://tails.net/install/) or [Whonix](https://www.whonix.org/wiki/Download)',
    text: 'a second operating system. All traffic through Tor. A local node must be reachable from inside it. [Qubes OS](https://www.qubes-os.org/downloads/) ships Whonix.',
  },
  ipfsDesktop: {
    kind: 'tool',
    anchor: 'tool-ipfs-desktop',
    names: ['IPFS Desktop'],
    head: '[IPFS Desktop](https://docs.ipfs.tech/install/ipfs-desktop/)',
    text: 'a free install. An IPFS node with a window, which loads an app by its hash without a public gateway. We chose it over Kubo, the same node run from the command line.',
  },
  ublockOrigin: {
    kind: 'tool',
    anchor: 'tool-ublock-origin',
    names: ['uBlock Origin'],
    head: '[uBlock Origin](https://addons.mozilla.org/firefox/addon/ublock-origin/)',
    text: "a free browser add-on. Blocks an app's requests to a host the step names, in place of an edit to system files. It is open source, and the blocker our traces ran.",
  },
  ethereumNode: {
    kind: 'tool',
    anchor: 'tool-ethereum-node',
    names: ['Ethereum node'],
    head: '[Ethereum node](https://ethereum.org/run-a-node/)',
    text: "a computer that stays online, with 16 GB of memory and a 4 TB SSD by ethereum.org's minimum. It answers an app's reads from its own copy of the chain. No single install sets one up, so we link ethereum.org's guide and name no client. Dappnode needs no command line but a machine of its own. From a website, the node must run on the same computer. A light client like Helios verifies answers it still fetches from a provider, which sees every address looked up. Our traces ran against a test node, not against these setups.",
  },
  aztecNode: {
    kind: 'tool',
    anchor: 'tool-aztec-node',
    names: ['Aztec node'],
    head: '[Aztec node](https://docs.aztec.network/operate/operators/full-node/overview)',
    text: "command-line work. Aztec's guide sets it up with Docker Compose on 8 cores, 8 GB of memory and a 1 TB SSD, next to an Ethereum node it reads from. It answers the wallet's reads and takes its transactions in place of the operator's node. Its peers see the IP that sends each transaction, so our steps use it against the operator only. Our traces ran against a stand-in, not a synced node.",
  },
} as const satisfies Record<string, PrivacyTool>

export type PrivacyToolId = keyof typeof PRIVACY_TOOLS
