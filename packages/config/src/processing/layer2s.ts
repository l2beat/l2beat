import { HOMEPAGE_MILESTONES } from '../global/milestones'
import type { ScalingProject } from '../internalTypes'
import { abstract } from '../projects/abstract/abstract'
import { aevo } from '../projects/aevo/aevo'
import { airas } from '../projects/airas/airas'
import { alephzero } from '../projects/alephzero/alephzero'
import { alienx } from '../projects/alienx/alienx'
import { align } from '../projects/align/align'
import { allo } from '../projects/allo/allo'
import { ancient } from '../projects/ancient/ancient'
import { apex } from '../projects/apex/apex'
import { appchain } from '../projects/appchain/appchain'
import { arbitrum } from '../projects/arbitrum/arbitrum'
import { arcology } from '../projects/arcology/arcology'
import { arenaz } from '../projects/arenaz/arenaz'
import { arithmic } from '../projects/arithmic/arithmic'
import { astarzkevm } from '../projects/astarzkevm/astarzkevm'
import { automata } from '../projects/automata/automata'
import { azchain } from '../projects/azchain/azchain'
import { aztec } from '../projects/aztec/aztec'
import { aztecV2 } from '../projects/aztec-v2/aztec-v2'
import { aztecconnect } from '../projects/aztecconnect/aztecconnect'
import { base } from '../projects/base/base'
import { blast } from '../projects/blast/blast'
import { bob } from '../projects/bob/bob'
import { bobanetwork } from '../projects/bobanetwork/bobanetwork'
import { brine } from '../projects/brine/brine'
import { camp } from '../projects/camp/camp'
import { canvasconnect } from '../projects/canvasconnect/canvasconnect'
import { capx } from '../projects/capx/capx'
import { cartesiprthoneypot } from '../projects/cartesi-prt-honeypot/cartesi-prt-honeypot'
import { celo } from '../projects/celo/celo'
import { corn } from '../projects/corn/corn'
import { coti } from '../projects/coti/coti'
import { creator } from '../projects/creator/creator'
import { creatorchain } from '../projects/creatorchain/creatorchain'
import { cronoszkevm } from '../projects/cronoszkevm/cronoszkevm'
import { cyber } from '../projects/cyber/cyber'
import { dbk } from '../projects/dbk/dbk'
import { dcamonster } from '../projects/dcamonster/dcamonster'
import { degate } from '../projects/degate/degate'
import { degate2 } from '../projects/degate2/degate2'
import { degate3 } from '../projects/degate3/degate3'
import { destra } from '../projects/destra/destra'
import { deversifi } from '../projects/deversifi/deversifi'
import { dydx } from '../projects/dydx/dydx'
import { ebichain } from '../projects/ebichain/ebichain'
import { eclipse } from '../projects/eclipse/eclipse'
import { edgeless } from '../projects/edgeless/edgeless'
import { ethernity } from '../projects/ethernity/ethernity'
import { everclear } from '../projects/everclear/everclear'
import { facet } from '../projects/facet/facet'
import { fhenix } from '../projects/fhenix/fhenix'
import { fluence } from '../projects/fluence/fluence'
import { fluent } from '../projects/fluent/fluent'
import { form } from '../projects/form/form'
import { fraxtal } from '../projects/fraxtal/fraxtal'
import { fuel } from '../projects/fuel/fuel'
import { fuelv1 } from '../projects/fuelv1/fuelv1'
import { funki } from '../projects/funki/funki'
import { fuse } from '../projects/fuse/fuse'
import { galxegravity } from '../projects/galxegravity/galxegravity'
import { gameswift } from '../projects/gameswift/gameswift'
import { gasp } from '../projects/gasp/gasp'
import { genlayer } from '../projects/genlayer/genlayer'
import { gluon } from '../projects/gluon/gluon'
import { gmnetwork } from '../projects/gmnetwork/gmnetwork'
import { gpt } from '../projects/gpt/gpt'
import { grvt } from '../projects/grvt/grvt'
import { gwyneth } from '../projects/gwyneth/gwyneth'
import { happychain } from '../projects/happychain/happychain'
import { hashkey } from '../projects/hashkey/hashkey'
import { haust } from '../projects/haust/haust'
import { hemi } from '../projects/hemi/hemi'
import { hermez } from '../projects/hermez/hermez'
import { honeypot } from '../projects/honeypot/honeypot'
import { hpp } from '../projects/hpp/hpp'
import { hybrid } from '../projects/hybrid/hybrid'
import { hychain } from '../projects/hychain/hychain'
import { hypr } from '../projects/hypr/hypr'
import { immutablex } from '../projects/immutablex/immutablex'
import { immutablezkevm } from '../projects/immutablezkevm/immutablezkevm'
import { ink } from '../projects/ink/ink'
import { intmax } from '../projects/intmax/intmax'
import { karak } from '../projects/karak/karak'
import { katana } from '../projects/katana/katana'
import { kinto } from '../projects/kinto/kinto'
import { koi } from '../projects/koi/koi'
import { kontos } from '../projects/kontos/kontos'
import { kroma } from '../projects/kroma/kroma'
import { lachain } from '../projects/lachain/lachain'
import { lambda } from '../projects/lambda/lambda'
import { lasernet } from '../projects/lasernet/lasernet'
import { layer2finance } from '../projects/layer2finance/layer2finance'
import { layer2financezk } from '../projects/layer2financezk/layer2financezk'
import { layerai } from '../projects/layerai/layerai'
import { leaf } from '../projects/leaf/leaf'
import { lens } from '../projects/lens/lens'
import { liftchain } from '../projects/liftchain/liftchain'
import { lightlink } from '../projects/lightlink/lightlink'
import { linea } from '../projects/linea/linea'
import { lisk } from '../projects/lisk/lisk'
import { loopring } from '../projects/loopring/loopring'
import { lootchain } from '../projects/lootchain/lootchain'
import { lumia } from '../projects/lumia/lumia'
import { lyra } from '../projects/lyra/lyra'
import { mantapacific } from '../projects/mantapacific/mantapacific'
import { mantle } from '../projects/mantle/mantle'
import { mawari } from '../projects/mawari/mawari'
import { memento } from '../projects/memento/memento'
import { metal } from '../projects/metal/metal'
import { metis } from '../projects/metis/metis'
import { millicent } from '../projects/millicent/millicent'
import { mint } from '../projects/mint/mint'
import { mode } from '../projects/mode/mode'
import { moonveil } from '../projects/moonveil/moonveil'
import { morph } from '../projects/morph/morph'
import { move } from '../projects/move/move'
import { myria } from '../projects/myria/myria'
import { myshell } from '../projects/myshell/myshell'
import { nal } from '../projects/nal/nal'
import { namechain } from '../projects/namechain/namechain'
import { network3 } from '../projects/network3/network3'
import { neva } from '../projects/neva/neva'
import { nil } from '../projects/nil/nil'
import { nodle } from '../projects/nodle/nodle'
import { nova } from '../projects/nova/nova'
import { oevnetwork } from '../projects/oevnetwork/oevnetwork'
import { ola } from '../projects/ola/ola'
import { omgnetwork } from '../projects/omgnetwork/omgnetwork'
import { openzk } from '../projects/openzk/openzk'
import { optimism } from '../projects/optimism/optimism'
import { optopia } from '../projects/optopia/optopia'
import { orderly } from '../projects/orderly/orderly'
import { ozean } from '../projects/ozean/ozean'
import { pandasea } from '../projects/pandasea/pandasea'
import { paradex } from '../projects/paradex/paradex'
import { parallel } from '../projects/parallel/parallel'
import { patex } from '../projects/patex/patex'
import { pay } from '../projects/pay/pay'
import { payy } from '../projects/payy/payy'
import { penchain } from '../projects/penchain/penchain'
import { pepeunchained } from '../projects/pepeunchained/pepeunchained'
import { pepeunchained2 } from '../projects/pepeunchained2/pepeunchained2'
import { phala } from '../projects/phala/phala'
import { plumenetwork } from '../projects/plumenetwork/plumenetwork'
import { polygonpos } from '../projects/polygon-pos/polygon-pos'
import { polygonmiden } from '../projects/polygonmiden/polygonmiden'
import { polygonpos2 } from '../projects/polygonpos2/polygonpos2'
import { polygonzkevm } from '../projects/polygonzkevm/polygonzkevm'
import { polynomial } from '../projects/polynomial/polynomial'
import { powerloom } from '../projects/powerloom/powerloom'
import { prom } from '../projects/prom/prom'
import { publicgoodsnetwork } from '../projects/publicgoodsnetwork/publicgoodsnetwork'
import { puffer } from '../projects/puffer/puffer'
import { quarkchain } from '../projects/quarkchain/quarkchain'
import { r0ar } from '../projects/r0ar/r0ar'
import { race } from '../projects/race/race'
import { rarimo } from '../projects/rarimo/rarimo'
import { real } from '../projects/real/real'
import { reddioex } from '../projects/reddioex/reddioex'
import { reddiozkvm } from '../projects/reddiozkvm/reddiozkvm'
import { redstone } from '../projects/redstone/redstone'
import { reya } from '../projects/reya/reya'
import { rise } from '../projects/rise/rise'
import { river } from '../projects/river/river'
import { rss3 } from '../projects/rss3/rss3'
import { rufus } from '../projects/rufus/rufus'
import { scroll } from '../projects/scroll/scroll'
import { settlus } from '../projects/settlus/settlus'
import { shape } from '../projects/shape/shape'
import { shibarium } from '../projects/shibarium/shibarium'
import { silentData } from '../projects/silentdata/silentdata'
import { silicon } from '../projects/silicon/silicon'
import { singularityfinance } from '../projects/singularityfinance/singularityfinance'
import { sischain } from '../projects/sischain/sischain'
import { skatechain } from '../projects/skatechain/skatechain'
import { snaxchain } from '../projects/snaxchain/snaxchain'
import { solo } from '../projects/solo/solo'
import { soneium } from '../projects/soneium/soneium'
import { soon } from '../projects/soon/soon'
import { sophon } from '../projects/sophon/sophon'
import { sorare } from '../projects/sorare/sorare'
import { sovrun } from '../projects/sovrun/sovrun'
import { spire } from '../projects/spire/spire'
import { starknet } from '../projects/starknet/starknet'
import { status } from '../projects/status/status'
import { studiochain } from '../projects/studiochain/studiochain'
import { superlumio } from '../projects/superlumio/superlumio'
import { superseed } from '../projects/superseed/superseed'
import { surge } from '../projects/surge/surge'
import { swan } from '../projects/swan/swan'
import { swell } from '../projects/swell/swell'
import { sxnetwork } from '../projects/sxnetwork/sxnetwork'
import { sxt } from '../projects/sxt/sxt'
import { t1 } from '../projects/t1/t1'
import { taiko } from '../projects/taiko/taiko'
import { tea } from '../projects/tea/tea'
import { telos } from '../projects/telos/telos'
import { ten } from '../projects/ten/ten'
import { termstructure } from '../projects/termstructure/termstructure'
import { ternoa } from '../projects/ternoa/ternoa'
import { thanos } from '../projects/thanos/thanos'
import { thebinaryholdings } from '../projects/thebinaryholdings/thebinaryholdings'
import { treasure } from '../projects/treasure/treasure'
import { tusima } from '../projects/tusima/tusima'
import { unichain } from '../projects/unichain/unichain'
import { union } from '../projects/union/union'
import { wirex } from '../projects/wirex/wirex'
import { witness } from '../projects/witness/witness'
import { wonder } from '../projects/wonder/wonder'
import { worldchain } from '../projects/worldchain/worldchain'
import { xchain } from '../projects/xchain/xchain'
import { xlayer } from '../projects/xlayer/xlayer'
import { xpla } from '../projects/xpla/xpla'
import { xsolla } from '../projects/xsolla/xsolla'
import { xterio } from '../projects/xterio/xterio'
import { zentachain } from '../projects/zentachain/zentachain'
import { zeronetwork } from '../projects/zeronetwork/zeronetwork'
import { zircuit } from '../projects/zircuit/zircuit'
import { zkcandy } from '../projects/zkcandy/zkcandy'
import { zkfair } from '../projects/zkfair/zkfair'
import { zklighter } from '../projects/zklighter/zklighter'
import { zkspace } from '../projects/zkspace/zkspace'
import { zkswap } from '../projects/zkswap/zkswap'
import { zkswap2 } from '../projects/zkswap2/zkswap2'
import { zksync } from '../projects/zksync/zksync'
import { zksync2 } from '../projects/zksync2/zksync2'
import { zora } from '../projects/zora/zora'

export const layer2s: ScalingProject[] = [
  abstract,
  aevo,
  airas,
  alephzero,
  alienx,
  align,
  allo,
  ancient,
  apex,
  appchain,
  arbitrum,
  arcology,
  arenaz,
  arithmic,
  astarzkevm,
  automata,
  azchain,
  aztecconnect,
  aztec,
  aztecV2,
  base,
  blast,
  bob,
  bobanetwork,
  camp,
  canvasconnect,
  capx,
  cartesiprthoneypot,
  celo,
  corn,
  coti,
  creator,
  creatorchain,
  cronoszkevm,
  cyber,
  dbk,
  dcamonster,
  degate,
  degate2,
  degate3,
  destra,
  dydx,
  ebichain,
  eclipse,
  edgeless,
  ethernity,
  everclear,
  facet,
  fhenix,
  fluence,
  fluent,
  form,
  fraxtal,
  fuel,
  fuelv1,
  funki,
  fuse,
  galxegravity,
  gameswift,
  gasp,
  genlayer,
  gluon,
  gmnetwork,
  gpt,
  grvt,
  gwyneth,
  happychain,
  hashkey,
  haust,
  hemi,
  hermez,
  honeypot,
  hpp,
  hybrid,
  hychain,
  hypr,
  immutablex,
  immutablezkevm,
  ink,
  intmax,
  karak,
  katana,
  kinto,
  koi,
  kontos,
  kroma,
  lachain,
  lambda,
  lasernet,
  layer2finance,
  layer2financezk,
  layerai,
  leaf,
  lens,
  liftchain,
  lightlink,
  linea,
  lisk,
  loopring,
  lootchain,
  lumia,
  lyra,
  mantapacific,
  mantle,
  mawari,
  memento,
  metal,
  metis,
  millicent,
  mint,
  mode,
  moonveil,
  morph,
  move,
  myria,
  myshell,
  nal,
  namechain,
  network3,
  neva,
  nil,
  nodle,
  nova,
  oevnetwork,
  ola,
  omgnetwork,
  openzk,
  optimism,
  optopia,
  orderly,
  ozean,
  pandasea,
  paradex,
  parallel,
  patex,
  pay,
  payy,
  penchain,
  pepeunchained,
  pepeunchained2,
  phala,
  plumenetwork,
  polygonmiden,
  polygonpos,
  polygonpos2,
  polygonzkevm,
  polynomial,
  powerloom,
  prom,
  publicgoodsnetwork,
  puffer,
  quarkchain,
  r0ar,
  race,
  rarimo,
  real,
  reddioex,
  reddiozkvm,
  redstone,
  reya,
  deversifi,
  rise,
  river,
  rss3,
  rufus,
  scroll,
  settlus,
  shape,
  shibarium,
  silentData,
  silicon,
  singularityfinance,
  sischain,
  skatechain,
  snaxchain,
  solo,
  soneium,
  soon,
  sophon,
  sorare,
  sovrun,
  spire,
  starknet,
  status,
  studiochain,
  superlumio,
  superseed,
  surge,
  swan,
  swell,
  sxnetwork,
  sxt,
  t1,
  taiko,
  brine,
  tea,
  telos,
  ten,
  termstructure,
  ternoa,
  thanos,
  thebinaryholdings,
  treasure,
  tusima,
  unichain,
  union,
  wirex,
  witness,
  wonder,
  worldchain,
  xchain,
  xlayer,
  xpla,
  xsolla,
  xterio,
  zentachain,
  zeronetwork,
  zircuit,
  zkcandy,
  zkfair,
  zklighter,
  zkspace,
  zkswap,
  zkswap2,
  zksync2,
  zksync,
  zora,
]

export const milestonesLayer2s = HOMEPAGE_MILESTONES
