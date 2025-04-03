import { readFileSync, writeFileSync } from 'fs'
import { posix } from 'path'
// TODO(radomski): To be removed
import {
  ConfigReader,
  type EntryParameters,
  TemplateService,
  getDiscoveryPaths,
} from '@l2beat/discovery'
import { flatteningHash } from '@l2beat/discovery/dist/flatten/utils'
import { assert } from '@l2beat/shared-pure'
import { command } from 'cmd-ts'

interface Contract {
  chain: string
  address: string
}

interface Match {
  templateId: string
  shapeHash: string
  shapeFilePath: string
  contract?: Contract
}

interface Shape {
  hash: string
  path: string
}

interface NewShapeEntry {
  hash: string
  description: string
  address: string
  chain: string
  blockNumber: number
}

const blockNumbers: Record<string, number> = {
  ethereum: 22188285,
  arbitrum: 322488866,
  base: 28446407,
  optimism: 134041720,
  ink: 10183769,
  unichain: 12933871,
  zksync2: 58599111,
}

const hashLookup: Record<string, Contract> = {
  '0xfcfd8e9eb9d6ec1518326de5385476d4d26b0682d70267add0084193ae403652': {
    chain: 'ethereum',
    address: '0xB6846927447e4764acd53b0b354BEd939f9220d7',
  },
  '0x95275ddb3e393113e19b284d6806675c79ab6698047f0cf6bdf7bb5ca1568c6d': {
    chain: 'ethereum',
    address: '0xF27d54dB0587442b01d6036C0F7f67CDaaBa1743',
  },
  '0x665ede6663477caf46bd510bb4ba7de3f2a6d8f51f840d058bad706018c67453': {
    chain: 'ethereum',
    address: '0xE7Fd68F6a389DE7D7C9cFCfCE15486885abeDD44',
  },
  '0xef6480951f06efac6ba95f0530ca0340d138c7208111550c58acbd6481520d79': {
    chain: 'ethereum',
    address: '0x485858BA818aab8744f2932A4982bfB0E7Db0005',
  },
  '0xdec3a533c2d2004adafb78bf9d2e3f16e42a1c061ac62c31795c3e0bd006426b': {
    chain: 'ethereum',
    address: '0x0D736853812A12F085DE867aDF4eA4ABA9521Fc0',
  },
  '0xa461f73f68673cc277f554dc5888d74dc47e1f756d93f9c3f2813f801fb1c269': {
    chain: 'ethereum',
    address: '0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8',
  },
  '0xb454745206bc5cace3c49dc78acf2be6af8602f7cf48f15a340a0ce854317389': {
    chain: 'ethereum',
    address: '0x6F8C5bA3F59ea3E76300E3BEcDC231D656017824',
  },
  '0xe548a802866b09c90c208e0f77018c9cdafa34ab07c071eac1e68c0a46d384b9': {
    chain: 'ethereum',
    address: '0xb6738A8E7793D44c5895B6A6F2a62F6bF86Ba8d2',
  },
  '0x6a8cfd738d026b64f2e5aaaf5faac411dcdc8c0d8ef834587d82144340812a2c': {
    chain: 'ethereum',
    address: '0xA6f3DFdbf4855a43c529bc42EDE96797252879af',
  },
  '0x3a72e01a50e4baf0c333aa3ad2413675a95c2fc68a18d8a95b3a65179e98ccbc': {
    chain: 'ethereum',
    address: '0xA4ba8bd753695B6121722CBB7cd81c71BCFBCA28',
  },
  '0x2f020370d4312debb7d9c97dbf80a48a0a0ee81d261d6d239d6b01d0dd076c81': {
    chain: 'ethereum',
    address: '0xaaF7FCc7252eb739E0001D8727800deAE04A84f1',
  },
  '0x8d871731877bb6dfe48e64a821acb08680fe17b500908486a34315093c236d0b': {
    chain: 'ethereum',
    address: '0x436e9FC7894e26718637f086d42B4a06439C8ae0',
  },
  '0x347fa20f8dfc82ef7433b3eb7915a248528d908fc77907c0d879f96a00106732': {
    chain: 'ethereum',
    address: '0xc5b17F1DF579D033DB17174B837fe4D2dF05b050',
  },
  '0x6aa2de634fc13396d9ea0b7d9d0869633db9d2bfc5b834f530fdc61ab1184bf6': {
    chain: 'ethereum',
    address: '0x050ed6F6273c7D836a111E42153BC00D0380b87d',
  },
  '0x9388575e8cf83880125e7770a596c83a0ad9c191b71f1990544987cbd0dbd4c0': {
    chain: 'ethereum',
    address: '0xde8B916B972cE3c27C21157Fc2b107c413062b9d',
  },
  '0xbeae5546b3ade5af5df9bfc3c26b178639a7c992a8d59b98a3fbb46dfe0c3a2c': {
    chain: 'ethereum',
    address: '0xb4c61d092eCf1b69F1965F9D8DE639148ea26a40',
  },
  '0xbe473240e6de093ae7120378ade4c19b5ab4bbe69143651df5cc3fe66c33c3eb': {
    chain: 'ethereum',
    address: '0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF',
  },
  '0x4a3316e3eb418f807ad2271f24b4764f4069731c7be4041cf2574e66ee2b20cc': {
    chain: 'ethereum',
    address: '0x6cB3EE90C50a38A0e4662bB7e7E6e40B91361BF6',
  },
  '0x9ae32beaa5dc29055f75d3cd08fbec35ed3eee3e2ff35de263a78f7d63c610f9': {
    chain: 'ethereum',
    address: '0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a',
  },
  '0xe521f6bd6250a2c92af323768ad8a2274cc334725b5ed8960d8421f063fc3285': {
    chain: 'ethereum',
    address: '0xaD193aDe635576d8e9f7ada71Af2137b16c64075',
  },
  '0xd272def5b4e3f0a68e3019d7d40675ca6d3e3fc35500e9aafe864bce8c697de2': {
    chain: 'ethereum',
    address: '0xE60E94fCCb18a81D501a38959E532C0A85A1be89',
  },
  '0x419cee160f60572fc9189007ec7c1e3c13e54d80bf1e78f837bc8fa001519685': {
    chain: 'ethereum',
    address: '0xCDB6228b616EEf8Df47D69A372C4f725C43e718C',
  },
  '0x46ab6472330f39b5dde71de5fc30609f34ecfa68c11673e09438f6db607279ea': {
    chain: 'ethereum',
    address: '0xaD193aDe635576d8e9f7ada71Af2137b16c64075',
  },
  '0xe59fe71de493915d874d4d22b4637434d86b42759b4d5fd2dddf4f25cfdd1544': {
    chain: 'ethereum',
    address: '0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897',
  },
  '0xb36dfb10be7530bb56af796b85f6c84bf90513603fe59c2f7f0d78fc2a9a9235': {
    chain: 'ethereum',
    address: '0x70F3FBf8a427155185Ec90BED8a3434203de9604',
  },
  '0xe185bff4846e41d1ea1bffd2a1905568a7206a93b2923a300f9b61990293218b': {
    chain: 'ethereum',
    address: '0x642F04899B6cA155c2a5eAdD4e4ed634f1B07Dd7',
  },
  '0xd3e96d9fb623969bd9cc3e5fed6779ce42c5de753b49fc73da783863d4043a2f': {
    chain: 'ethereum',
    address: '0x594cCaDF93F860dc42Cf9fd7bCea47Ff4d135D7A',
  },
  '0x47106a5b62610ed3e17aeaa5e041a4fcea8b1f14fea096ed2697d3e382077da7': {
    chain: 'ethereum',
    address: '0x20718EfbC25Dba60FD51c2c81362b83f7C411A6D',
  },
  '0x3fca66122127ad88c1effb0da1dd14d847ab5efee9ee02c4be5d458b61dbf71f': {
    chain: 'ethereum',
    address: '0x1C207dabc46902dF9028b27D6d301c3849b2D12c',
  },
  '0xf82396d0cffcb5c92e0fe02e163c71e8fcc7d63bc7fc1df34540bae85dfd7fbb': {
    chain: 'ethereum',
    address: '0x0f27c8532457b66D6037141DEB0ed479Dad04B3c',
  },
  '0x24b66df82f92b1b0453e29e73d9693a2671b512379ccba03e3ea38cf35ffbc3c': {
    chain: 'ethereum',
    address: '0x020082A7a9c2510e1921116001152DEE4da81985',
  },
  '0x6a270bc5c82591f8a8adb6765201cc65b04ed37a9509b2703970f74d1ee9534f': {
    chain: 'ethereum',
    address: '0x1175E4CFd6a73A4c1F1f2c1400a08D88554FA62e',
  },
  '0x4c921a754523a7496c7a7b47d0a0b6bd773d71028cf77f6301757bdcaf3c469e': {
    chain: 'ethereum',
    address: '0x06f9817a91595E1B595F789Fb91529e8651da9B8',
  },
  '0x6b4c769c7b59108373c42add32bce68be08c2c8095dcb0919d25cd9b4542102c': {
    chain: 'ethereum',
    address: '0x057152DB365B47851B0A0bd431644b8eE21fE1b4',
  },
  '0x0a632a2beeac9d8c3a57905d419850c6bb531ccc97efca28cfe666847026992a': {
    chain: 'ethereum',
    address: '0x45A103142585bdFc49cdb137f2a45D1AE7F84b6b',
  },
  '0x8f8568ffa012634ccf826a95dde2d995cc8c0fb07ea6662639e4e41983a00643': {
    chain: 'ethereum',
    address: '0x50f6631B377be52E132DF35a2F05eA54fda882ac',
  },
  '0xa9fa40d9d26de86fa9869be555593dd3b95cc40442206b8c0725a24d1809cc7f': {
    chain: 'ethereum',
    address: '0x21377fe476Fb8587CbAFd47155093597Fa4df45E',
  },
  '0x4f46bb4ccf89fb70d097b085ff91815ba6ed930b5ce6b451f0dbf068006eeab2': {
    chain: 'ethereum',
    address: '0x0238d2C272f17CF11AEDB08CDE515d56ED25E2E4',
  },
  '0x847be59cd2db802e5662b649bac8ff82c5d602b59f0d57a38d33d066aac1ba5f': {
    chain: 'ethereum',
    address: '0xA81f4AB595dE5C14759245DE5ce9899D380FeFda',
  },
  '0xb4f2982da610e459869524c6366a4b364337b95f231f4109941deb2cc5afa258': {
    chain: 'ethereum',
    address: '0x72427dA7EFBa1585E94F30C72221d8d394aE3Bb7',
  },
  '0x4c5ff062896caf72eb8999dc0f839adca5dbec7dd71c1aa6d0b1defce8ee6046': {
    chain: 'ethereum',
    address: '0x27e7a3A81741B9fcc5Ad7edCBf9F8a72a5c00428',
  },
  '0x0c3feee8ba16b88486431df7d8867f64bc50ea12410ff83491b8020bdc49a9fd': {
    chain: 'ethereum',
    address: '0xdfdA04f980bE6A64E3607c95Ca26012Ab9aA46d3',
  },
  '0x5dbde25ce90571f7dd8e189ec68615bd76cab9ddb0ba7690b721e9e03c70b6ed': {
    chain: 'ethereum',
    address: '0x1066CEcC8880948FE55e427E94F1FF221d626591',
  },
  '0x6014bf86ee4c408054ad942b00365111c902b30d650ad8ed97b0cd56ca1d1e20': {
    chain: 'ethereum',
    address: '0x5aED5f8A1e3607476F1f81c3d8fe126deB0aFE94',
  },
  '0xc90d60d6db95e55c93637eee14d0d8f4034a14d5f50fc0e8561e389073c9816a': {
    chain: 'ethereum',
    address: '0x0eA7372338a589e7f0b00E463a53AA464ef04e17',
  },
  '0x9f764f06f42aed913df011cc8dc09d70319d488074f11885eed5edbb66c6f5b4': {
    chain: 'ethereum',
    address: '0x7439d8d4F3b9d9B6222f3E9760c75a47e08a7b3f',
  },
  '0xcb5aa9193bb40ce04bdf027377926cf735cd52ee9823923cb55fce302ad76513': {
    chain: 'ethereum',
    address: '0x806421D09cDb253aa9d128a658e60c0B95eFFA01',
  },
  '0xabf06072746c465404cbb92f513666e15a5409faccce7f76f4880a9b125b8a2e': {
    chain: 'ethereum',
    address: '0x72f193d0F305F532C87a4B9D0A2F407a3F4f585f',
  },
  '0x714cd478f69088c5274871f1be4e27736aedacf59858caeb9dbea9e47d23d213': {
    chain: 'ethereum',
    address: '0xA0Ed0562629D45B88A34a342f20dEb58c46C15ff',
  },
  '0x0bb7cd360bb26d8a487130df151eb05ce4afe4fd3452fcdbdd3cfa432e17cbb5': {
    chain: 'ethereum',
    address: '0x31DA64D19Cd31A19CD09F4070366Fe2144792cf7',
  },
  '0xc6fc9d901cf59527db2a86ff96ebd61f6a469b56100f1a94498e2f068a91f50b': {
    chain: 'ethereum',
    address: '0x100524b68fe88035623F1309Bb3Db9b64e924724',
  },
  '0x7c44d7be0909b7d0aaf2c476c9c337b43f59f311d40469f3e0cc99dc46308b56': {
    chain: 'arbitrum',
    address: '0xa8968d1dbA3F93FB7412d15F4139C0f63537e9E2',
  },
  '0x970ba596f805bae56173fc8c6865317fd90b24c1871f324ff19f0fc8a8b81069': {
    chain: 'ethereum',
    address: '0x103388f5661d224F4aFb555C7E4a8FB52d0b752d',
  },
  '0x397ec6a954a442e44c9ca54398210cdd9b24211f3488cd6cfc0693407a4041a2': {
    chain: 'ethereum',
    address: '0x6e2BC597F1e83F9fC7c1f69157F2C12476873971',
  },
  '0x00a6e4c29d4f4c792c4f6c43b197f95b24d626a94e6faf8ee81bc9320d579d7e': {
    chain: 'ethereum',
    address: '0x86dF12f51E3531689e0615bb2F739ddf01337715',
  },
  '0x081a1805983e86cd6a80ed48c012c26bf9a39473c0f1e69b357afff240f027a0': {
    chain: 'ethereum',
    address: '0x90C0A0a63d7ff47BfAA1e9F8fa554dabc986504a',
  },
  '0xdf47c6cd4fcffcfa4a670e1544e2391acc365cd7fd9b8e7583d58b28dff50c40': {
    chain: 'ethereum',
    address: '0xBB13642F795014E0EAC2b0d52ECD5162ECb66712',
  },
  '0x981d4f2ae5949ab33c6ba83f6446595d3b853bf6f7157884304445d70b185374': {
    chain: 'ethereum',
    address: '0x81754d2E48e3e553ba6Dfd193FC72B3A0c6076d9',
  },
  '0x91db58e4059dfed7357e56dac17d2963c6f9cfb540f527988ed25172251a2584': {
    chain: 'ethereum',
    address: '0x5575218cECd370E1d630d1AdB03c254B0B376821',
  },
  '0x9276015f2765194b8fc3bda15ecb50e1dacb7d171c9fd9dc4902b05944d949b0': {
    chain: 'ethereum',
    address: '0x8e2961B885E7Ede5fEDf3eE90Bb2648c81A2C43A',
  },
  '0xb1fe1fe741a2a22eb0e195e6bbd15f2f8de06e5586318a57ca82cbb6386f82e3': {
    chain: 'ethereum',
    address: '0x96326f628d3E4DdA2645D4b8b6f337fC4B72aEB7',
  },
  '0xe2afd35e21cefc5b6eda770f7082c3916b8353d50c158a857cfc2ada89027f5b': {
    chain: 'ethereum',
    address: '0x3d20b96e5635CfCFF58c9CE66017F2240313B47C',
  },
  '0x3703a67e457793b9a26cf1ac8548b5ea17dd768da63011587bb1af5c1f7c1d99': {
    chain: 'ethereum',
    address: '0x2B11300E3A6eaBA8C7AF4Fae8A92589eA417D7eE',
  },
  '0xe25c80e0504b1ab9202b66f81f2f479e695d2440a0b5fe1ad31a300a75e64f2a': {
    chain: 'ethereum',
    address: '0x9711256c6F2dFFabff9671dBaf1B4A3F7FB3Cffb',
  },
  '0x3190c62a59b62169498d1f61c08c5c722c70cc0a6aaa37b185fd3f8014941b96': {
    chain: 'ethereum',
    address: '0x98DFF0828C8f870c31E209f35dF7ed22d194Ea9B',
  },

  // Missing after rebase
  '0x568d6f26c34f7da5f4ac55957f99d9e66cbf967d550fa27ec431fb66bbd36a0b': {
    chain: 'ethereum',
    address: '0x0029e562c0b54C0b88cB22adF4346DbfEC87400c',
  },
  '0x23ebe4dfc517328a5acc1f6f8aa84be593be5db9d6357fcdcd69c62ca60853f7': {
    chain: 'ethereum',
    address: '0xF5A14DCdde1143443f06033200D345c2a2828A99',
  },
  '0x07105095c7b0ff20b0cdd1e3754255aa6189aa79719f6d09fdd8e20df48bed44': {
    chain: 'ethereum',
    address: '0xD5e9D3d483a93d03D8d604CC79dC9f2F4B78C604',
  },
  '0x2322249822d1ffda838f7005dd4137d161f15f2cc3553e9bffba7c04a44d9226': {
    chain: 'ethereum',
    address: '0xb39B175a5E0945F2FB6A7F31764c0e31D9cF5b75',
  },
  '0xa148b7dcb3095dbb66f26d1428d50a59e1cd1384c80b0efe88efead152e6ebe2': {
    chain: 'ethereum',
    address: '0x6c7a05e0AE641c6559fD76ac56641778B6eCd776',
  },
}

export const Migrate = command({
  name: 'migrate',
  description: 'Replaces drag-and-drop shapes with implementation address',
  args: {},
  handler: () => {
    const paths = getDiscoveryPaths()
    const configReader = new ConfigReader(paths.discovery)
    const sourceHashMap = getSourceHashMap(configReader)
    const templateService = new TemplateService(paths.discovery)

    const [matching, notMatching] = matchUpShapes(
      templateService,
      sourceHashMap,
    )

    const groupedByTemplateId = groupBy(matching, 'templateId')
    for (const templateId in groupedByTemplateId) {
      const newShapeFile: NewShapeEntry[] = []
      const matches = groupedByTemplateId[templateId]
      for (const match of matches) {
        assert(match.contract !== undefined)

        const newShapeEntry: NewShapeEntry = {
          hash: match.shapeHash,
          description: posix.parse(posix.basename(match.shapeFilePath)).name,
          address: match.contract.address,
          chain: match.contract.chain,
          blockNumber: blockNumbers[match.contract.chain],
        }
        newShapeFile.push(newShapeEntry)
      }

      const newShapeFilePath = posix.join(
        paths.discovery,
        '_templates',
        templateId,
        'shapes.json',
      )
      writeFileSync(newShapeFilePath, JSON.stringify(newShapeFile, null, 2))
      console.log(`[${templateId}] has ${matches.length} matches`)
    }

    console.log(`We have found ${matching.length} matching templates`)
    console.log(`We failed to match ${notMatching.length} templates`)
  },
})

function matchUpShapes(
  templateService: TemplateService,
  sourceHashMap: Map<string, Contract>,
): [Match[], Match[]] {
  const allTemplates = templateService.listAllTemplates()
  const shapes: Record<string, Shape[]> = {}
  for (const [templateId, shapeFilePaths] of Object.entries(allTemplates)) {
    shapes[templateId] = shapeFilePaths.paths.map((p) => {
      const hash = flatteningHash(readFileSync(p, 'utf8'))
      return { hash, path: p }
    })
  }

  const matching: Match[] = []
  const notMatching: Match[] = []
  for (const templateId in shapes) {
    for (const shape of shapes[templateId]) {
      if (sourceHashMap.has(shape.hash)) {
        matching.push({
          templateId,
          shapeHash: shape.hash,
          shapeFilePath: shape.path,
          contract: sourceHashMap.get(shape.hash),
        })
      } else {
        notMatching.push({
          templateId,
          shapeHash: shape.hash,
          shapeFilePath: shape.path,
        })
      }
    }
  }

  return [matching, notMatching]
}

function getSourceHashMap(configReader: ConfigReader): Map<string, Contract> {
  const sourceHashMap: Map<string, Contract> = new Map()

  for (const hash in hashLookup) {
    sourceHashMap.set(hash, hashLookup[hash])
  }

  const chains = configReader.readAllChains()
  for (const chain of chains) {
    const projects = configReader.readAllProjectsForChain(chain)
    for (const project of projects) {
      const discovery = configReader.readDiscovery(project, chain)
      for (const entry of discovery.entries) {
        const implementationAddress = getImplementationAddress(entry)
        const sourceHash = getSourceHash(entry)
        if (implementationAddress.length === sourceHash.length) {
          const zipped = zip(implementationAddress, sourceHash)
          for (const [impl, src] of zipped) {
            if (!sourceHashMap.has(src)) {
              sourceHashMap.set(src, {
                chain,
                address: impl,
              })
            }
          }
        }
      }
    }
  }

  return sourceHashMap
}

function getImplementationAddress(entry: EntryParameters): string[] {
  const implementation = entry.values?.['$implementation']
  if (implementation !== undefined) {
    if (Array.isArray(implementation)) {
      return implementation as string[]
    }

    return [implementation as string]
  }

  if (entry.proxyType === 'immutable') {
    return [entry.address]
  }

  return []
}

function getSourceHash(entry: EntryParameters): string[] {
  if (entry.sourceHashes === undefined) {
    return []
  }

  if (entry.sourceHashes.length === 1) {
    return [entry.sourceHashes[0]]
  }

  return entry.sourceHashes.slice(1)
}

function groupBy<T>(
  collection: T[],
  iteratee: ((value: T) => string | number) | keyof T,
): Record<string, T[]> {
  return collection.reduce(
    (acc, item) => {
      const key = String(
        typeof iteratee === 'function'
          ? iteratee(item)
          : item[iteratee as keyof T],
      )
      ;(acc[key] ||= []).push(item)
      return acc
    },
    {} as Record<string, T[]>,
  )
}

function zip<T extends unknown[][]>(
  ...arrays: T
): { [K in keyof T]: T[K] extends (infer U)[] ? U : never }[] {
  const maxLength = Math.max(...arrays.map((arr) => arr.length))
  return Array.from({ length: maxLength }, (_, i) =>
    arrays.map((arr) => arr[i]),
  ) as { [K in keyof T]: T[K] extends (infer U)[] ? U : never }[]
}
