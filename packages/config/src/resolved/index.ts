import { UnixTime } from '@l2beat/shared-pure'
import superjson from 'superjson'
import { ChainConfig } from '../common'
import { Bridge, DaLayer, Layer2, Layer3, ZkCatalogProject } from '../projects'
import bridges from './bridges.json'
import chains from './chains.json'
import daLayers from './daLayers.json'
import layer2s from './layer2s.json'
import layer3s from './layer3s.json'
import zkCatalogProjects from './zkCatalogProjects.json'

superjson.registerCustom<UnixTime, string>(
  {
    isApplicable: (value) => value instanceof UnixTime,
    serialize: (value) => value.toString(),
    deserialize: (value) => new UnixTime(parseInt(value)),
  },
  'UnixTime',
)

const resolvedLayer2s = superjson.parse<Layer2[]>(JSON.stringify(layer2s))
const resolvedLayer3s = superjson.parse<Layer3[]>(JSON.stringify(layer3s))
const resolvedBridges = superjson.parse<Bridge[]>(JSON.stringify(bridges))
const resolvedDaLayers = superjson.parse<DaLayer[]>(JSON.stringify(daLayers))
const resolvedZkCatalogProjects = superjson.parse<ZkCatalogProject[]>(
  JSON.stringify(zkCatalogProjects),
)
const resolvedChains = superjson.parse<ChainConfig[]>(JSON.stringify(chains))

export {
  resolvedLayer2s,
  resolvedLayer3s,
  resolvedBridges,
  resolvedDaLayers,
  resolvedZkCatalogProjects,
  resolvedChains,
}
