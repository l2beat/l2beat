import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const freetunnel: BaseProject = {
  id: ProjectId('freetunnel'),
  slug: 'freetunnel',
  name: 'Free Tunnel',
  shortName: 'Free',
  addedAt: UnixTime(1774434398),
  interopConfig: {
    plugins: [
      {
        plugin: 'meson',
        // the branding is chaotic, free used to be the frontend while meson was the protocol,
        // but free.tech is down and replaced with https://free-tunnel.meson.fi/
        bridgeType: 'burnAndMint',
      },
    ],
    type: 'multichain', // we track the multichain part, but there is also lock-minting on the esoteric source chains
  },
  isInteropProtocol: true,
}
