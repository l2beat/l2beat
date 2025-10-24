CREATE TABLE logs_eth
(
  address_hex  FixedString(40),  -- lowercased hex, NO '0x'
  topic0_hex   FixedString(64),
  topic1_hex   FixedString(64),
  block_number UInt32,
  log_index    UInt16,
  block_time   DateTime64(3, 'UTC'),
  tx_hash_hex  FixedString(64),
  topic2_hex   FixedString(64),
  topic3_hex   FixedString(64),
  data         String            -- keep as hex String if you like, or raw bytes if you don't
)
ENGINE = MergeTree
PARTITION BY intDiv(block_number, 1000000)          -- or toYYYYMM(block_time)
ORDER BY (address_hex, topic0_hex, block_number, log_index);

ALTER TABLE logs_eth
  ADD INDEX bf_addr address_hex TYPE bloom_filter GRANULARITY 4; -- without it queries on HDD take much much longer (0.7s vs 0.15s), even with ORDER BY (address_hex, ...
  ADD INDEX bf_topic1 topic1_hex TYPE bloom_filter GRANULARITY 4,
  ADD INDEX bf_topic2 topic2_hex TYPE bloom_filter GRANULARITY 4,
  ADD INDEX bf_topic3 topic3_hex TYPE bloom_filter GRANULARITY 4;