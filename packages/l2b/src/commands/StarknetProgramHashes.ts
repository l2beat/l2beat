import { command, option, positional } from 'cmd-ts'
import { EthereumTransactionAnalyzer } from '../implementations/starknetProgramHashes'
import { Hash256Value, HttpUrl } from './types'

export const StarknetProgramHashes = command({
  name: 'starknet-program-hashes',
  description: 'Extract program hashes from the calldata given tx hash.',
  args: {
    txHash: positional({ type: Hash256Value, displayName: 'txHash' }),
    rpcUrl: option({
      type: HttpUrl,
      env: 'L2B_RPC_URL',
      long: 'rpc-url',
      short: 'u',
      defaultValue: () => 'https://eth.drpc.org',
      defaultValueIsSerializable: true,
    }),
  },
  handler: async (args) => {
    const knownProgramHashes: Record<string, string> = {
      // from our discovery: names are just project names that are using this progHash
      '15787695375210609250491147414005894154890873413229882671403677761527504080':
        'Starknet Aggregator (since v0.13.3)',
      '2397984267054479079853548842566103781972463965746662494980785692480538410509':
        'StarkNet OS (Starknet)',
      '853638403225561750106379562222782223909906501242604214771127703946595519856':
        'StarkNet OS (Paradex)',
      '3383082961563516565935611087683915026448707331436034043529592588079494402084':
        'StarkNet OS (old Paradex, old StarkNet)',
      '3485280386001712778192330279103973322645241679001461923469191557000342180556':
        'StarkEx Spot v3.0 (ImutableX, Layer2FinanceZK)',
      '770346231394331402493200980986217737662224545740427952627288191358999988146':
        'ApeX-USDT',
      '3174901404014912024702042974619036870715605532092680335571201877913899936957':
        'StarkEx Spot v4.0 (RhinoFi, Sorare)',
      '16830627573509542901909952446321116535677491650708854009406762893086223513':
        'StarkEx Spot v4.5 (Brine, Canvasconnect, Myria, ReddioEX)',
      '3114724292040200590153042023978438629733352741898912919152162079752811928849':
        'StarkEx Perp v2.0 ApeX-USDC',
      '217719352201300445998518619904782191262194843262573339166404641663770051805':
        'StarkNet (old)',
      '3003515909324298587247571665454372831319437787162989623104387385306791861180':
        'StarkNet (old)',
      '1161178844461337253856226043908368523817098764221830529880464854589141231910':
        'StarkNet Aggregator (old)',
      '1921772108187713503530008849184725638117898887391063185252422808224349294626':
        'StarkNet (old)',
      '3258367057337572248818716706664617507069572185152472699066582725377748079373':
        'StarkNet (old)',
      '407700941260678649793204927710478760533239334662847444187959202896452163393':
        'StarkNet (old)',
      '1865367024509426979036104162713508294334262484507712987283009063059134893433':
        'StarkNet (old)',
      '54878256403880350656938046611252303365750679698042371543935159963667935317':
        'StarkNet (old)',
      '2479841346739966073527450029179698923866252973805981504232089731754042431018':
        'StarkNet (old)',
      '109586309220455887239200613090920758778188956576212125550190099009305121410':
        'StarkNet (old)',
    }

    const analyzer = new EthereumTransactionAnalyzer(
      args.rpcUrl,
      knownProgramHashes,
    )
    await analyzer.analyzeProgramHashes(args.txHash.toString())
  },
})
