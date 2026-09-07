# RPC env → config cleanup

Generated from .env.be-prod / .env.be-stag / .env.be-tvs-prod / .env.be-tvs-stag.

## Rules
- Paid/internal endpoints (rpc.l2beat.com, Alchemy keyed, QuickNode, eclipserpc, keyed proofofplay) stay in env, together with their CALLS_PER_MINUTE / RPC_TIMEOUT / RETRY_STRATEGY.
- Chains that use a paid endpoint on any deployment are left entirely in env (config untouched): abstract, forknet.
- Public endpoints move to config. Prod deployments (be-prod, be-tvs-prod) are the baseline; staging values are used only where prod had none.
- Env vars equal to config, and stale vars nothing reads, were removed.

## Config changes
| chain | url | callsPerMinute |
|---|---|---|
| aevo | (same) | 800 → 120 |
| cronoszkevm | (same) | 300 → 600 |
| cyber | https://cyber.alt.technology/ → https://rpc.cyber.co | 300 → 200 |
| dbk | (same) | 300 → 600 |
| fluent | (same) | 120 → 2000 |
| fuel | (same) | 120 → 1200 |
| galxegravity | (same) | 300 → 600 |
| kinto | (same) | 600 → 120 |
| lightlink | (same) | 300 → 1800 |
| lisk | (same) | 300 → 200 |
| lumia | (same) | 300 → 4800 |
| lyra | (same) | 300 → 600 |
| morph | (same) | 300 → 600 |
| paradex | https://pathfinder.api.prod.paradex.trade/rpc/v0_9 → https://rpc.api.prod.paradex.trade/rpc/v0_9 | (same) |
| polygonzkevm | https://polygon-rpc.com/zkevm → https://zkevm-rpc.com | 500 → 3000 |
| r0ar | (same) | 300 → 2500 |
| reya | (same) | 300 → 4000 |
| river | (same) | 300 → 200 |
| shape | (same) | 300 → 4800 |
| soon | (same) | 300 → 600 |
| superlumio | (same) | 300 → 600 |
| sxnetwork | https://rpc.sx-rollup.gelato.digital → https://rpc-rollup.sx.technology | 300 → 150 |
| taiko | (same) | 500 → 120 |
| ternoa | (same) | 300 → 10000 |
| thebinaryholdings | (same) | 300 → 600 |
| xchain | (same) | 300 → 100 |
| xlayer | (same) | 300 → 2400 |
| zeronetwork | (same) | 300 → 120 |
| zkfair | (same) | 300 → 600 |
| apechain | (same) | 300 → 1200 |
| b3 | (same) | 800 → 600 |
| educhain | (same) | 300 → 500 |
| geist | (same) | 600 → 60 |
| xai | (same) | 300 → 2400 |
| popboss | (same) | 3000 → 60 |
| sanko | https://mainnet.sanko.xyz → https://sanko-mainnet.calderachain.xyz/http | 300 → 200 |
| playblock | https://playnance.drpc.org/ → https://rpc.playblock.io | 300 → 1000 |
| winr | https://rpc.winr.games → https://rpc-winr-mainnet-0.t.conduit.xyz | (same) |
| everclear | https://rpc.everclear.raas.gelato.cloud → https://everclear.drpc.org | (same) |

## Conflicts resolved by hand (please sanity-check)
- paradex: be-prod used rpc.api.prod.paradex.trade/rpc/v0_9, stag+tvs used pathfinder v0_6, config had pathfinder v0_9. Chose be-prod value.
- everclear: switched config to everclear.drpc.org (be-prod value); stag and TVS move off gelato.
- lisk: be-stag/tvs-stag used lisk.drpc.org, be-prod + config used rpc.api.lisk.com. Kept rpc.api.lisk.com @200 cpm.
- zeronetwork: be-tvs-prod used rpc.zero.network, others + config used rpc.zerion.io/v1/zero. Kept zerion @120 cpm.
- winr: be-prod used conduit @300, be-tvs-prod used rpc.winr.games @4500, be-stag @100. Chose conduit @300 (tvs-prod will drop from 4500).

## Removed env vars per deployment

### be-prod (74)
AEVO_RPC_CALLS_PER_MINUTE, AEVO_RPC_URL, B3_RPC_CALLS_PER_MINUTE, CRONOSZKEVM_RPC_CALLS_PER_MINUTE, CYBER_RPC_URL, DBK_RPC_CALLS_PER_MINUTE, EDUCHAIN_RPC_CALLS_PER_MINUTE, EVERCLEAR_RPC_URL, FLUENT_RPC_CALLS_PER_MINUTE, FRAXTAL_RPC_URL, FUEL_API_CALLS_PER_MINUTE, GALXEGRAVITY_RPC_CALLS_PER_MINUTE, GAME7_RPC_CALLS_PER_MINUTE, GATEWAY_RPC_URL, GEIST_RPC_CALLS_PER_MINUTE, GRIDY_RPC_CALLS_PER_MINUTE, GRIDY_RPC_URL, KINTO_RPC_CALLS_PER_MINUTE, KINTO_RPC_URL, KROMA_RPC_URL, LIGHTLINK_RPC_CALLS_PER_MINUTE, LISK_RPC_CALLS_PER_MINUTE, LUMIA_RPC_CALLS_PER_MINUTE, LYRA_RPC_CALLS_PER_MINUTE, LYRA_RPC_URL, MINT_RPC_URL, MOONCHAIN_RPC_URL, MORPH_RPC_CALLS_PER_MINUTE, ONCHAIN_RPC_CALLS_PER_MINUTE, OPENZK_RPC_CALLS_PER_MINUTE, OPENZK_RPC_URL, PARADEX_API_CALLS_PER_MINUTE, PARADEX_API_URL, PARADEX_RPC_URL, PLAYBLOCK_RPC_CALLS_PER_MINUTE, PLAYBLOCK_RPC_URL, POLYGONZKEVM_RPC_CALLS_PER_MINUTE, POLYGONZKEVM_RPC_URL, POLYNOMIAL_RPC_URL, POPBOSS_RPC_CALLS_PER_MINUTE, R0AR_RPC_CALLS_PER_MINUTE, REYA_RPC_CALLS_PER_MINUTE, REYA_RPC_URL, RIVER_RPC_CALLS_PER_MINUTE, RIVER_RPC_URL, SANKO_RPC_CALLS_PER_MINUTE, SANKO_RPC_URL, SETTLUS_RPC_CALLS_PER_MINUTE, SOON_RPC_CALLS_PER_MINUTE, SUPERLUMIO_RPC_CALLS_PER_MINUTE, SUPERLUMIO_RPC_URL, SWAN_RPC_URL, SXNETWORK_RPC_CALLS_PER_MINUTE, SXNETWORK_RPC_URL, T3RN_RPC_URL, TAIKO_RPC_CALLS_PER_MINUTE, TAIKO_RPC_URL, TERNOA_RPC_CALLS_PER_MINUTE, THEBINARYHOLDINGS_RPC_CALLS_PER_MINUTE, THEBINARYHOLDINGS_RPC_URL, UNITE_RPC_CALLS_PER_MINUTE, WINR_RPC_CALLS_PER_MINUTE, WINR_RPC_URL, WIREX_RPC_URL, XAI_RPC_CALLS_PER_MINUTE, XCHAIN_RPC_CALLS_PER_MINUTE, XLAYER_RPC_CALLS_PER_MINUTE, ZAMA_RPC_URL, ZERONETWORK_RPC_CALLS_PER_MINUTE, ZKFAIR_RPC_CALLS_PER_MINUTE, ZKFAIR_RPC_URL, ZKLINKNOVA_RPC_URL

### be-stag (49)
AEVO_RPC_CALLS_PER_MINUTE, AEVO_RPC_URL, APECHAIN_RPC_CALLS_PER_MINUTE, ASTARZKEVM_RPC_CALLS_PER_MINUTE, CYBER_RPC_CALLS_PER_MINUTE, CYBER_RPC_URL, DBK_RPC_CALLS_PER_MINUTE, EVERCLEAR_RPC_URL, FRAXTAL_RPC_URL, FUEL_API_CALLS_PER_MINUTE, GALXEGRAVITY_RPC_CALLS_PER_MINUTE, GALXEGRAVITY_RPC_URL, GATEWAY_RPC_URL, GEIST_RPC_CALLS_PER_MINUTE, GRIDY_RPC_CALLS_PER_MINUTE, GRIDY_RPC_URL, KINTO_RPC_URL, KROMA_RPC_URL, LIGHTLINK_RPC_CALLS_PER_MINUTE, LISK_RPC_URL, LYRA_RPC_CALLS_PER_MINUTE, LYRA_RPC_URL, MOONCHAIN_RPC_URL, ONCHAIN_RPC_CALLS_PER_MINUTE, PARADEX_RPC_URL, PLAYBLOCK_RPC_URL, POLYGONZKEVM_RPC_CALLS_PER_MINUTE, POLYGONZKEVM_RPC_URL, POLYNOMIAL_RPC_URL, REYA_RPC_CALLS_PER_MINUTE, REYA_RPC_URL, SETTLUS_RPC_CALLS_PER_MINUTE, SHAPE_RPC_CALLS_PER_MINUTE, SOON_RPC_CALLS_PER_MINUTE, SUPERLUMIO_RPC_URL, SWAN_RPC_CALLS_PER_MINUTE, SWELL_RPC_CALLS_PER_MINUTE, THEBINARYHOLDINGS_RPC_URL, UNITE_RPC_CALLS_PER_MINUTE, WINR_RPC_CALLS_PER_MINUTE, WIREX_RPC_URL, XAI_RPC_CALLS_PER_MINUTE, XLAYER_RPC_CALLS_PER_MINUTE, ZAMA_RPC_URL, ZERONETWORK_RPC_CALLS_PER_MINUTE, ZKFAIR_RPC_CALLS_PER_MINUTE, ZKFAIR_RPC_URL, ZKLINKNOVA_RPC_URL

### be-tvs-prod (43)
AEVO_RPC_CALLS_PER_MINUTE, AEVO_RPC_URL, B3_RPC_CALLS_PER_MINUTE, CRONOSZKEVM_RPC_CALLS_PER_MINUTE, CYBER_RPC_URL, DBK_RPC_CALLS_PER_MINUTE, EVERCLEAR_RPC_URL, FRAXTAL_RPC_URL, FUEL_API_CALLS_PER_MINUTE, GALXEGRAVITY_RPC_CALLS_PER_MINUTE, KINTO_RPC_CALLS_PER_MINUTE, KINTO_RPC_URL, KROMA_RPC_URL, LIGHTLINK_RPC_CALLS_PER_MINUTE, LUMIA_RPC_CALLS_PER_MINUTE, LYRA_RPC_CALLS_PER_MINUTE, LYRA_RPC_URL, MINT_RPC_URL, MORPH_RPC_CALLS_PER_MINUTE, PARADEX_RPC_URL, POLYGONZKEVM_RPC_CALLS_PER_MINUTE, POLYGONZKEVM_RPC_URL, POLYNOMIAL_RPC_URL, R0AR_RPC_CALLS_PER_MINUTE, REYA_RPC_CALLS_PER_MINUTE, REYA_RPC_URL, SUPERLUMIO_RPC_CALLS_PER_MINUTE, SUPERLUMIO_RPC_URL, SWAN_RPC_URL, TAIKO_RPC_CALLS_PER_MINUTE, TAIKO_RPC_URL, TERNOA_RPC_CALLS_PER_MINUTE, THEBINARYHOLDINGS_RPC_CALLS_PER_MINUTE, THEBINARYHOLDINGS_RPC_URL, WINR_RPC_CALLS_PER_MINUTE, WIREX_RPC_URL, XAI_RPC_CALLS_PER_MINUTE, XLAYER_RPC_CALLS_PER_MINUTE, ZERONETWORK_RPC_CALLS_PER_MINUTE, ZERONETWORK_RPC_URL, ZKFAIR_RPC_CALLS_PER_MINUTE, ZKFAIR_RPC_URL, ZKLINKNOVA_RPC_URL

### be-tvs-stag (29)
AEVO_RPC_CALLS_PER_MINUTE, AEVO_RPC_URL, ASTARZKEVM_RPC_CALLS_PER_MINUTE, CYBER_RPC_URL, EVERCLEAR_RPC_URL, FRAXTAL_RPC_URL, FUEL_API_CALLS_PER_MINUTE, GALXEGRAVITY_RPC_CALLS_PER_MINUTE, KINTO_RPC_URL, KROMA_RPC_URL, LISK_RPC_URL, LYRA_RPC_CALLS_PER_MINUTE, LYRA_RPC_URL, PARADEX_RPC_URL, POLYGONZKEVM_RPC_CALLS_PER_MINUTE, POLYGONZKEVM_RPC_URL, POLYNOMIAL_RPC_URL, REYA_RPC_CALLS_PER_MINUTE, REYA_RPC_URL, SHAPE_RPC_CALLS_PER_MINUTE, SUPERLUMIO_RPC_URL, THEBINARYHOLDINGS_RPC_URL, WIREX_RPC_URL, XAI_RPC_CALLS_PER_MINUTE, XLAYER_RPC_CALLS_PER_MINUTE, ZERONETWORK_RPC_CALLS_PER_MINUTE, ZKFAIR_RPC_CALLS_PER_MINUTE, ZKFAIR_RPC_URL, ZKLINKNOVA_RPC_URL

## Left in env but unused (paid, so not auto-removed)
- be-prod: ABSTRACT_RPC_URL_OLD (Alchemy key, nothing reads it)
- be-stag: HYPERLIQUID_RPC_URL, SONIC_RPC_URL, ZKEVM_RPC_URL (rpc.l2beat.com, no chain with that name has an rpc api)

## Paid-endpoint drift between deployments (informational, untouched)
- ethereum cpm 1200 / 600 / 5000 / 5000; base 300 / 600 / 1500 / 500; blast 120 / 5000 / 120 / 5000; celo 10000 / 1200 / 10000 / -; polygonpos 300 / 300 / 4800 / 600; zircuit 600 / 600 / 5000 / 600; eclipse uses two different keyed hosts (acv-l2beat vs p-l2beat).
