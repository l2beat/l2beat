import { HOMEPAGE_MILESTONES } from '../../common'
import type { Layer2 } from '../../types'
import { abstract } from './abstract'
import { aevo } from './aevo'
import { aiechain } from './aiechain'
import { alephzero } from './alephzero'
import { alienx } from './alienx'
import { align } from './align'
import { allo } from './allo'
import { ancient } from './ancient'
import { apex } from './apex'
import { arbitrum } from './arbitrum'
import { arcology } from './arcology'
import { arenaz } from './arenaz'
import { arithmic } from './arithmic'
import { astarzkevm } from './astarzkevm'
import { automata } from './automata'
import { axonum } from './axonum'
import { azchain } from './azchain'
import { aztecV1 } from './aztecV1'
import { aztecV2 } from './aztecV2'
import { aztecconnect } from './aztecconnect'
import { base } from './base'
import { blast } from './blast'
import { bob } from './bob'
import { bobanetwork } from './bobanetwork'
import { camp } from './camp'
import { canvasconnect } from './canvasconnect'
import { capx } from './capx'
import { celo } from './celo'
import { corn } from './corn'
import { coti } from './coti'
import { creator } from './creator'
import { cronoszkevm } from './cronoszkevm'
import { cyber } from './cyber'
import { dbk } from './dbk'
import { dcamonster } from './dcamonster'
import { degate } from './degate'
import { degate2 } from './degate2'
import { degate3 } from './degate3'
import { degenlayer } from './degenlayer'
import { destra } from './destra'
import { dydx } from './dydx'
import { ebichain } from './ebichain'
import { eclipse } from './eclipse'
import { edgeless } from './edgeless'
import { ethernity } from './ethernity'
import { everclear } from './everclear'
import { facet } from './facet'
import { fhenix } from './fhenix'
import { fluence } from './fluence'
import { fluent } from './fluent'
import { form } from './form'
import { frame } from './frame'
import { fraxtal } from './fraxtal'
import { fuel } from './fuel'
import { fuelv1 } from './fuelv1'
import { funki } from './funki'
import { fuse } from './fuse'
import { galxegravity } from './galxegravity'
import { gluon } from './gluon'
import { gmnetwork } from './gmnetwork'
import { gpt } from './gpt'
import { grvt } from './grvt'
import { gwyneth } from './gwyneth'
import { happychain } from './happychain'
import { hashkey } from './hashkey'
import { haust } from './haust'
import { hemi } from './hemi'
import { hermez } from './hermez'
import { honeypot } from './honeypot'
import { hybrid } from './hybrid'
import { hychain } from './hychain'
import { hypr } from './hypr'
import { immutablex } from './immutablex'
import { immutablezkevm } from './immutablezkevm'
import { ink } from './ink'
import { intmax } from './intmax'
import { kakarotzkevm } from './kakarotzkevm'
import { karak } from './karak'
import { kinto } from './kinto'
import { koi } from './koi'
import { kontos } from './kontos'
import { kroma } from './kroma'
import { lambda } from './lambda'
import { layer2finance } from './layer2finance'
import { layer2financezk } from './layer2financezk'
import { layerai } from './layerai'
import { leaf } from './leaf'
import { lens } from './lens'
import { lightlink } from './lightlink'
import { linea } from './linea'
import { lisk } from './lisk'
import { loopring } from './loopring'
import { lumia } from './lumia'
import { lyra } from './lyra'
import { mantapacific } from './mantapacific'
import { mantle } from './mantle'
import { memento } from './memento'
import { metal } from './metal'
import { metis } from './metis'
import { millicent } from './millicent'
import { mint } from './mint'
import { mode } from './mode'
import { moonveil } from './moonveil'
import { morph } from './morph'
import { move } from './move'
import { myria } from './myria'
import { myshell } from './myshell'
import { nal } from './nal'
import { network3 } from './network3'
import { neva } from './neva'
import { nil } from './nil'
import { nova } from './nova'
import { oev } from './oev'
import { ola } from './ola'
import { omgnetwork } from './omgnetwork'
import { openzk } from './openzk'
import { optimism } from './optimism'
import { optopia } from './optopia'
import { orderly } from './orderly'
import { palm } from './palm'
import { pandasea } from './pandasea'
import { paradex } from './paradex'
import { parallel } from './parallel'
import { patex } from './patex'
import { payy } from './payy'
import { pepeunchained } from './pepeunchained'
import { phala } from './phala'
import { playchain } from './playchain'
import { plumenetwork } from './plumenetwork'
import { polygonmiden } from './polygonmiden'
import { polygonpos } from './polygonpos'
import { polygonpos2 } from './polygonpos2'
import { polygonzkevm } from './polygonzkevm'
import { polynomial } from './polynomial'
import { publicgoodsnetwork } from './publicgoodsnetwork'
import { puffer } from './puffer'
import { r0ar } from './r0ar'
import { race } from './race'
import { real } from './real'
import { reddioex } from './reddioex'
import { reddiozkvm } from './reddiozkvm'
import { redstone } from './redstone'
import { reya } from './reya'
import { rhinofi } from './rhinofi'
import { rise } from './rise'
import { river } from './river'
import { rss3 } from './rss3'
import { rufus } from './rufus'
import { scroll } from './scroll'
import { shape } from './shape'
import { shibarium } from './shibarium'
import { silicon } from './silicon'
import { singularityfinance } from './singularityfinance'
import { socialnetwork } from './socialnetwork'
import { solo } from './solo'
import { soneium } from './soneium'
import { soon } from './soon'
import { sophon } from './sophon'
import { sorare } from './sorare'
import { specular } from './specular'
import { starknet } from './starknet'
import { status } from './status'
import { stealthchain } from './stealthchain'
import { superlumio } from './superlumio'
import { superseed } from './superseed'
import { swan } from './swan'
import { swell } from './swell'
import { sxnetwork } from './sxnetwork'
import { sxt } from './sxt'
import { t1 } from './t1'
import { taiko } from './taiko'
import { tanx } from './tanx'
import { tea } from './tea'
import { telos } from './telos'
import { ten } from './ten'
import { termstructure } from './termstructure'
import { ternoa } from './ternoa'
import { thanos } from './thanos'
import { thebinaryholdings } from './thebinaryholdings'
import { treasure } from './treasure'
import { turboprotocol } from './turboprotocol'
import { tusima } from './tusima'
import { unichain } from './unichain'
import { wirex } from './wirex'
import { witness } from './witness'
import { world } from './world'
import { xchain } from './xchain'
import { xlayer } from './xlayer'
import { xpla } from './xpla'
import { xterio } from './xterio'
import { zentachain } from './zentachain'
import { zeronetwork } from './zeronetwork'
import { zircuit } from './zircuit'
import { zkcandy } from './zkcandy'
import { zkfair } from './zkfair'
import { zklighter } from './zklighter'
import { zkspace } from './zkspace'
import { zkswap } from './zkswap'
import { zkswap2 } from './zkswap2'
import { zksyncera } from './zksyncera'
import { zksynclite } from './zksynclite'
import { zora } from './zora'

export const layer2s: Layer2[] = [
  abstract,
  aevo,
  aiechain,
  alephzero,
  allo,
  automata,
  ancient,
  apex,
  arbitrum,
  arcology,
  arenaz,
  arithmic,
  astarzkevm,
  alienx,
  align,
  axonum,
  azchain,
  aztecV1,
  aztecconnect,
  aztecV2,
  base,
  blast,
  bob,
  bobanetwork,
  camp,
  capx,
  celo,
  cyber,
  canvasconnect,
  coti,
  corn,
  creator,
  cronoszkevm,
  dbk,
  honeypot,
  dcamonster,
  degate,
  degate2,
  degate3,
  degenlayer,
  destra,
  dydx,
  edgeless,
  ethernity,
  everclear,
  facet,
  fhenix,
  fluence,
  fluent,
  form,
  frame,
  fraxtal,
  fuel,
  fuelv1,
  funki,
  fuse,
  gluon,
  gmnetwork,
  gpt,
  galxegravity,
  grvt,
  gwyneth,
  hemi,
  happychain,
  haust,
  hashkey,
  hermez,
  hybrid,
  hychain,
  hypr,
  immutablex,
  immutablezkevm,
  ink,
  intmax,
  kakarotzkevm,
  karak,
  kinto,
  koi,
  kontos,
  kroma,
  lambda,
  layerai,
  leaf,
  layer2finance,
  layer2financezk,
  lens,
  lightlink,
  linea,
  lisk,
  loopring,
  lumia,
  lyra,
  race,
  ebichain,
  eclipse,
  mantapacific,
  mantle,
  memento,
  metal,
  metis,
  mint,
  millicent,
  mode,
  moonveil,
  morph,
  move,
  myria,
  myshell,
  nal,
  nil,
  network3,
  neva,
  nova,
  oev,
  ola,
  omgnetwork,
  openzk,
  optimism,
  optopia,
  orderly,
  palm,
  pandasea,
  paradex,
  parallel,
  patex,
  payy,
  pepeunchained,
  phala,
  playchain,
  plumenetwork,
  polygonmiden,
  polygonzkevm,
  polygonpos,
  polygonpos2,
  polynomial,
  publicgoodsnetwork,
  puffer,
  reddioex,
  reddiozkvm,
  redstone,
  real,
  reya,
  rhinofi,
  rise,
  river,
  r0ar,
  rss3,
  rufus,
  scroll,
  silicon,
  singularityfinance,
  sophon,
  soneium,
  socialnetwork,
  solo,
  soon,
  sorare,
  specular,
  starknet,
  status,
  stealthchain,
  shape,
  shibarium,
  superlumio,
  superseed,
  swan,
  swell,
  sxt,
  t1,
  sxnetwork,
  taiko,
  tanx,
  tea,
  telos,
  ten,
  termstructure,
  ternoa,
  thebinaryholdings,
  thanos,
  treasure,
  turboprotocol,
  tusima,
  unichain,
  wirex,
  witness,
  world,
  xchain,
  xlayer,
  xpla,
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
  zksyncera,
  zksynclite,
  zora,
]

export const milestonesLayer2s = HOMEPAGE_MILESTONES
