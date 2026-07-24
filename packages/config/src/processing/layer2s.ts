import { HOMEPAGE_MILESTONES } from '../global/milestones'
import type { ScalingProject } from '../internalTypes'
import { abstract } from '../projects/abstract/abstract'
import { adi } from '../projects/adi/adi'
import { aevo } from '../projects/aevo/aevo'
import { alephzero } from '../projects/alephzero/alephzero'
import { alienx } from '../projects/alienx/alienx'
import { ancient } from '../projects/ancient/ancient'
import { appchain } from '../projects/appchain/appchain'
import { arbitrum } from '../projects/arbitrum/arbitrum'
import { arenaz } from '../projects/arenaz/arenaz'
import { astarzkevm } from '../projects/astarzkevm/astarzkevm'
import { automata } from '../projects/automata/automata'
import { aztec } from '../projects/aztec/aztec'
import { aztecconnect } from '../projects/aztecconnect/aztecconnect'
import { aztecnetwork } from '../projects/aztecnetwork/aztecnetwork'
import { base } from '../projects/base/base'
import { blast } from '../projects/blast/blast'
import { bob } from '../projects/bob/bob'
import { bobanetwork } from '../projects/bobanetwork/bobanetwork'
import { brine } from '../projects/brine/brine'
import { canvasconnect } from '../projects/canvasconnect/canvasconnect'
import { capx } from '../projects/capx/capx'
import { cartesiprthoneypot } from '../projects/cartesi-prt-honeypot/cartesi-prt-honeypot'
import { cartesiprthoneypotv2 } from '../projects/cartesi-prt-honeypot-v2/cartesi-prt-honeypot-v2'
import { celo } from '../projects/celo/celo'
import { corn } from '../projects/corn/corn'
import { cronoszkevm } from '../projects/cronoszkevm/cronoszkevm'
import { cyber } from '../projects/cyber/cyber'
import { dbk } from '../projects/dbk/dbk'
import { degate } from '../projects/degate/degate'
import { degate2 } from '../projects/degate2/degate2'
import { degate3 } from '../projects/degate3/degate3'
import { deversifi } from '../projects/deversifi/deversifi'
import { dydx } from '../projects/dydx/dydx'
import { ebichain } from '../projects/ebichain/ebichain'
import { eclipse } from '../projects/eclipse/eclipse'
import { edgeless } from '../projects/edgeless/edgeless'
import { edgex } from '../projects/edgex/edgex'
import { ethernity } from '../projects/ethernity/ethernity'
import { ethscriptions } from '../projects/ethscriptions/ethscriptions'
import { everclear } from '../projects/everclear/everclear'
import { facet } from '../projects/facet/facet'
import { fluence } from '../projects/fluence/fluence'
import { fluent } from '../projects/fluent/fluent'
import { forknet } from '../projects/forknet/forknet'
import { form } from '../projects/form/form'
import { fraxtal } from '../projects/fraxtal/fraxtal'
import { fuel } from '../projects/fuel/fuel'
import { fuelv1 } from '../projects/fuelv1/fuelv1'
import { funki } from '../projects/funki/funki'
import { galxegravity } from '../projects/galxegravity/galxegravity'
import { gluon } from '../projects/gluon/gluon'
import { gmnetwork } from '../projects/gmnetwork/gmnetwork'
import { gnosis } from '../projects/gnosis/gnosis'
import { gpt } from '../projects/gpt/gpt'
import { grvt } from '../projects/grvt/grvt'
import { hashkey } from '../projects/hashkey/hashkey'
import { haust } from '../projects/haust/haust'
import { hemi } from '../projects/hemi/hemi'
import { hermez } from '../projects/hermez/hermez'
import { honeypot } from '../projects/honeypot/honeypot'
import { hychain } from '../projects/hychain/hychain'
import { hypr } from '../projects/hypr/hypr'
import { immutablex } from '../projects/immutablex/immutablex'
import { immutablezkevm } from '../projects/immutablezkevm/immutablezkevm'
import { ink } from '../projects/ink/ink'
import { jovay } from '../projects/jovay/jovay'
import { karak } from '../projects/karak/karak'
import { katana } from '../projects/katana/katana'
import { kinto } from '../projects/kinto/kinto'
import { kroma } from '../projects/kroma/kroma'
import { lachain } from '../projects/lachain/lachain'
import { lambda } from '../projects/lambda/lambda'
import { lasernet } from '../projects/lasernet/lasernet'
import { layer2finance } from '../projects/layer2finance/layer2finance'
import { layer2financezk } from '../projects/layer2financezk/layer2financezk'
import { lens } from '../projects/lens/lens'
import { lighter } from '../projects/lighter/lighter'
import { lightlink } from '../projects/lightlink/lightlink'
import { linea } from '../projects/linea/linea'
import { lisk } from '../projects/lisk/lisk'
import { loopring } from '../projects/loopring/loopring'
import { lumia } from '../projects/lumia/lumia'
import { lyra } from '../projects/lyra/lyra'
import { mantapacific } from '../projects/mantapacific/mantapacific'
import { mantle } from '../projects/mantle/mantle'
import { megaeth } from '../projects/megaeth/megaeth'
import { metal } from '../projects/metal/metal'
import { metis } from '../projects/metis/metis'
import { mint } from '../projects/mint/mint'
import { mode } from '../projects/mode/mode'
import { morph } from '../projects/morph/morph'
import { myria } from '../projects/myria/myria'
import { nillion } from '../projects/nillion/nillion'
import { nova } from '../projects/nova/nova'
import { oevnetwork } from '../projects/oevnetwork/oevnetwork'
import { omgnetwork } from '../projects/omgnetwork/omgnetwork'
import { optimism } from '../projects/optimism/optimism'
import { optopia } from '../projects/optopia/optopia'
import { orderly } from '../projects/orderly/orderly'
import { paradex } from '../projects/paradex/paradex'
import { parallel } from '../projects/parallel/parallel'
import { penchain } from '../projects/penchain/penchain'
import { pepeunchained } from '../projects/pepeunchained/pepeunchained'
import { pepeunchained2 } from '../projects/pepeunchained2/pepeunchained2'
import { phala } from '../projects/phala/phala'
import { plumenetwork } from '../projects/plumenetwork/plumenetwork'
import { polygonpos } from '../projects/polygon-pos/polygon-pos'
import { polygonzkevm } from '../projects/polygonzkevm/polygonzkevm'
import { polynomial } from '../projects/polynomial/polynomial'
import { powerloom } from '../projects/powerloom/powerloom'
import { publicgoodsnetwork } from '../projects/publicgoodsnetwork/publicgoodsnetwork'
import { r0ar } from '../projects/r0ar/r0ar'
import { race } from '../projects/race/race'
import { real } from '../projects/real/real'
import { reddioex } from '../projects/reddioex/reddioex'
import { redstone } from '../projects/redstone/redstone'
import { reya } from '../projects/reya/reya'
import { rise } from '../projects/rise/rise'
import { river } from '../projects/river/river'
import { robinhood } from '../projects/robinhood/robinhood'
import { roninNetwork } from '../projects/roninnetwork/roninnetwork'
import { rss3 } from '../projects/rss3/rss3'
import { scroll } from '../projects/scroll/scroll'
import { settlus } from '../projects/settlus/settlus'
import { shape } from '../projects/shape/shape'
import { shibarium } from '../projects/shibarium/shibarium'
import { silentData } from '../projects/silentdata/silentdata'
import { silicon } from '../projects/silicon/silicon'
import { snaxchain } from '../projects/snaxchain/snaxchain'
import { soneium } from '../projects/soneium/soneium'
import { soon } from '../projects/soon/soon'
import { sophon } from '../projects/sophon/sophon'
import { sorare } from '../projects/sorare/sorare'
import { starknet } from '../projects/starknet/starknet'
import { superlumio } from '../projects/superlumio/superlumio'
import { superseed } from '../projects/superseed/superseed'
import { swan } from '../projects/swan/swan'
import { swell } from '../projects/swell/swell'
import { sxnetwork } from '../projects/sxnetwork/sxnetwork'
import { syndicate } from '../projects/syndicate/syndicate'
import { taiko } from '../projects/taiko/taiko'
import { termstructure } from '../projects/termstructure/termstructure'
import { ternoa } from '../projects/ternoa/ternoa'
import { thebinaryholdings } from '../projects/thebinaryholdings/thebinaryholdings'
import { treasure } from '../projects/treasure/treasure'
import { unichain } from '../projects/unichain/unichain'
import { wirex } from '../projects/wirex/wirex'
import { witness } from '../projects/witness/witness'
import { wonder } from '../projects/wonder/wonder'
import { worldchain } from '../projects/worldchain/worldchain'
import { xchain } from '../projects/xchain/xchain'
import { xlayer } from '../projects/xlayer/xlayer'
import { xterio } from '../projects/xterio/xterio'
import { zeronetwork } from '../projects/zeronetwork/zeronetwork'
import { zircuit } from '../projects/zircuit/zircuit'
import { zkcandy } from '../projects/zkcandy/zkcandy'
import { zkfair } from '../projects/zkfair/zkfair'
import { zkspace } from '../projects/zkspace/zkspace'
import { zkswap } from '../projects/zkswap/zkswap'
import { zkswap2 } from '../projects/zkswap2/zkswap2'
import { zksync } from '../projects/zksync/zksync'
import { zksync2 } from '../projects/zksync2/zksync2'
import { zora } from '../projects/zora/zora'

export const layer2s: ScalingProject[] = [
  abstract,
  aevo,
  alephzero,
  alienx,
  adi,
  ancient,
  appchain,
  arbitrum,
  arenaz,
  astarzkevm,
  automata,
  aztecconnect,
  aztec,
  aztecnetwork,
  base,
  blast,
  bob,
  bobanetwork,
  canvasconnect,
  capx,
  cartesiprthoneypot,
  cartesiprthoneypotv2,
  celo,
  corn,
  cronoszkevm,
  cyber,
  dbk,
  degate,
  degate2,
  degate3,
  dydx,
  ebichain,
  eclipse,
  edgeless,
  edgex,
  ethernity,
  ethscriptions,
  everclear,
  facet,
  fluence,
  fluent,
  form,
  forknet,
  fraxtal,
  fuel,
  fuelv1,
  funki,
  galxegravity,
  gluon,
  gmnetwork,
  gnosis,
  gpt,
  grvt,
  hashkey,
  haust,
  hemi,
  hermez,
  honeypot,
  hychain,
  hypr,
  immutablex,
  immutablezkevm,
  ink,
  jovay,
  karak,
  katana,
  kinto,
  kroma,
  lachain,
  lambda,
  lasernet,
  layer2finance,
  layer2financezk,
  lens,
  lightlink,
  lighter,
  linea,
  lisk,
  loopring,
  lumia,
  lyra,
  mantapacific,
  mantle,
  megaeth,
  metal,
  metis,
  mint,
  mode,
  morph,
  myria,
  nillion,
  nova,
  oevnetwork,
  omgnetwork,
  optimism,
  optopia,
  orderly,
  paradex,
  parallel,
  penchain,
  pepeunchained,
  pepeunchained2,
  phala,
  plumenetwork,
  polygonpos,
  polygonzkevm,
  polynomial,
  powerloom,
  publicgoodsnetwork,
  r0ar,
  race,
  real,
  reddioex,
  roninNetwork,
  redstone,
  reya,
  deversifi,
  rise,
  river,
  robinhood,
  rss3,
  scroll,
  settlus,
  shape,
  shibarium,
  silentData,
  silicon,
  snaxchain,
  soneium,
  soon,
  sophon,
  sorare,
  starknet,
  superlumio,
  superseed,
  swan,
  swell,
  syndicate,
  sxnetwork,
  taiko,
  brine,
  termstructure,
  ternoa,
  thebinaryholdings,
  treasure,
  unichain,
  wirex,
  witness,
  wonder,
  worldchain,
  xchain,
  xlayer,
  xterio,
  zeronetwork,
  zircuit,
  zkcandy,
  zkfair,
  zkspace,
  zkswap,
  zkswap2,
  zksync2,
  zksync,
  zora,
]

export const milestonesLayer2s = HOMEPAGE_MILESTONES
