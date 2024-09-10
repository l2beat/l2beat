import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type { ExternalBridgeType, ExplorerType } from "./enums";

export type Activity = {
    project_id: string;
    timestamp: Timestamp;
    count: number;
    start: Generated<number>;
    end: Generated<number>;
};
export type AggregatedL2Cost = {
    timestamp: Timestamp;
    project_id: string;
    total_gas: number;
    total_gas_eth: number;
    total_gas_usd: number;
    blobs_gas: number | null;
    blobs_gas_eth: number | null;
    blobs_gas_usd: number | null;
    calldata_gas: number;
    calldata_gas_eth: number;
    calldata_gas_usd: number;
    compute_gas: number;
    compute_gas_eth: number;
    compute_gas_usd: number;
    overhead_gas_eth: number;
    overhead_gas_usd: number;
    overhead_gas: number;
};
export type AggregatedLiveness = {
    project_id: string;
    subtype: string;
    range: string;
    min: number;
    avg: number;
    max: number;
    updated_at: Timestamp;
};
export type Amount = {
    timestamp: Timestamp;
    amount: string;
    configuration_id: string;
};
export type Anomaly = {
    timestamp: Timestamp;
    project_id: string;
    subtype: string;
    duration: number;
};
export type BlockTimestamp = {
    chain: string;
    timestamp: Timestamp;
    block_number: number;
};
export type BridgeEscrow = {
    id: string;
    networkId: string;
    address: string;
    externalBridgeId: string | null;
    canonicalNetworkId: string | null;
    updatedAt: Timestamp;
    createdAt: Generated<Timestamp>;
};
export type BridgeEscrowToToken = {
    A: string;
    B: string;
};
export type Cache = {
    key: string;
    value: string;
    chainId: number;
    blockNumber: number | null;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
};
export type CurrentPrice = {
    coingeckoId: string;
    priceUsd: number;
    updatedAt: Timestamp;
};
export type DailyDiscovery = {
    project_name: string;
    chain_id: number;
    unix_timestamp: Timestamp;
    block_number: number;
    version: number;
    config_hash: string;
    discovery_json_blob: unknown;
};
export type Deployment = {
    id: string;
    tokenId: string;
    txHash: string | null;
    blockNumber: number | null;
    timestamp: Timestamp | null;
    from: string | null;
    to: string | null;
    isDeployerEoa: boolean | null;
    sourceAvailable: boolean;
    updatedAt: Timestamp;
    createdAt: Generated<Timestamp>;
};
export type DiscoveryCache = {
    key: string;
    value: string;
    block_number: number;
    chain: string;
};
export type ExternalBridge = {
    id: string;
    name: string;
    type: ExternalBridgeType;
    updatedAt: Timestamp;
    createdAt: Generated<Timestamp>;
};
export type Finality = {
    project_id: string;
    timestamp: Timestamp;
    minimum_time_to_inclusion: number;
    maximum_time_to_inclusion: number;
    average_time_to_inclusion: number;
    average_state_update: number | null;
};
export type FlatSources = {
    projectName: string;
    chainId: number;
    blockNumber: number;
    contentHash: string;
    flat: unknown;
};
export type IndexerConfiguration = {
    id: string;
    indexer_id: string;
    current_height: number | null;
    min_height: number;
    max_height: number | null;
    properties: string;
};
export type IndexerState = {
    indexer_id: string;
    safe_height: number;
    min_timestamp: Timestamp | null;
    config_hash: string | null;
};
export type L2Cost = {
    configuration_id: string;
    tx_hash: string;
    timestamp: Timestamp;
    gas_used: number;
    gas_price: string;
    calldata_gas_used: number;
    calldata_length: number;
    blob_gas_used: number | null;
    blob_gas_price: string | null;
};
export type L2CostPrice = {
    timestamp: Timestamp;
    price_usd: number;
};
export type Liveness = {
    timestamp: Timestamp;
    block_number: number;
    tx_hash: string;
    configuration_id: string;
};
export type Network = {
    id: string;
    chainId: number;
    name: string;
    coingeckoId: string | null;
    axelarId: string | null;
    axelarGatewayAddress: string | null;
    orbitId: string | null;
    wormholeId: string | null;
    layerZeroV1EndpointAddress: string | null;
    logoUrl: string | null;
    updatedAt: Timestamp;
    createdAt: Generated<Timestamp>;
};
export type NetworkExplorer = {
    id: string;
    networkId: string;
    type: ExplorerType;
    url: string;
    apiKey: string;
    updatedAt: Timestamp;
    createdAt: Generated<Timestamp>;
};
export type NetworkRpc = {
    id: string;
    networkId: string;
    url: string;
    updatedAt: Timestamp;
    createdAt: Generated<Timestamp>;
};
export type Price = {
    timestamp: Timestamp;
    price_usd: number;
    configuration_id: string;
};
export type Stake = {
    id: string;
    totalStake: number;
    thresholdStake: number;
};
export type Token = {
    id: string;
    networkId: string;
    address: string;
    updatedAt: Timestamp;
    createdAt: Generated<Timestamp>;
};
export type TokenBridge = {
    id: string;
    sourceTokenId: string;
    targetTokenId: string;
    externalBridgeId: string | null;
    updatedAt: Timestamp;
    createdAt: Generated<Timestamp>;
};
export type TokenMeta = {
    id: string;
    tokenId: string;
    externalId: string | null;
    source: string;
    name: string | null;
    symbol: string | null;
    decimals: number | null;
    logoUrl: string | null;
    contractName: string | null;
    updatedAt: Timestamp;
    createdAt: Generated<Timestamp>;
};
export type TvlCleaner = {
    repository_name: string;
    hourly_cleaned_until: Timestamp | null;
    six_hourly_cleaned_until: Timestamp | null;
};
export type UpdateMonitor = {
    project_name: string;
    block_number: number;
    unix_timestamp: Timestamp | null;
    discovery_json_blob: unknown;
    config_hash: Generated<string>;
    version: Generated<number>;
    chain_id: Generated<number>;
};
export type UpdateNotifier = {
    id: Generated<number>;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
    project_name: string;
    block_number: number;
    diff_json_blob: unknown;
    chain_id: Generated<number>;
};
export type Value = {
    timestamp: Timestamp;
    project_id: string;
    data_source: string;
    external: string | null;
    external_associated: Generated<string>;
    external_for_total: string | null;
    external_associated_for_total: Generated<string>;
    canonical: string | null;
    canonical_associated: Generated<string>;
    canonical_for_total: string | null;
    canonical_associated_for_total: Generated<string>;
    native: string | null;
    native_associated: Generated<string>;
    native_for_total: string | null;
    native_associated_for_total: Generated<string>;
    ether: Generated<string>;
    stablecoin: Generated<string>;
};
export type VerifierStatus = {
    address: string;
    chain_id: number;
    last_used: Timestamp;
    last_updated: Timestamp;
};
export type DB = {
    _BridgeEscrowToToken: BridgeEscrowToToken;
    activity: Activity;
    aggregated_l2_costs: AggregatedL2Cost;
    aggregated_liveness: AggregatedLiveness;
    amounts: Amount;
    anomalies: Anomaly;
    block_timestamps: BlockTimestamp;
    BridgeEscrow: BridgeEscrow;
    Cache: Cache;
    CurrentPrice: CurrentPrice;
    daily_discovery: DailyDiscovery;
    Deployment: Deployment;
    discovery_cache: DiscoveryCache;
    ExternalBridge: ExternalBridge;
    finality: Finality;
    FlatSources: FlatSources;
    indexer_configurations: IndexerConfiguration;
    indexer_state: IndexerState;
    l2_costs: L2Cost;
    l2_costs_prices: L2CostPrice;
    liveness: Liveness;
    Network: Network;
    NetworkExplorer: NetworkExplorer;
    NetworkRpc: NetworkRpc;
    prices: Price;
    Stake: Stake;
    Token: Token;
    TokenBridge: TokenBridge;
    TokenMeta: TokenMeta;
    tvl_cleaner: TvlCleaner;
    update_monitor: UpdateMonitor;
    update_notifier: UpdateNotifier;
    values: Value;
    verifier_status: VerifierStatus;
};
