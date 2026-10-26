-- #13122 removed alt-DA tracking (Celestia, Avail, EigenDA), the DA-beat
-- stats of the other layers and the Blobstream, Vector and Espresso
-- projects. Nothing writes or reads the rows below anymore, and nothing
-- else deletes them: their indexers are gone, so no wipe ever runs.

-- Pass 1: data-posted history of the alt-DA layers.
DELETE FROM "DataAvailability" WHERE "daLayer" <> 'ethereum';

-- Pass 2: state of the removed DA indexers. Left in place, a re-added
-- indexer with the same name would resume from it.
DELETE FROM "IndexerConfiguration"
WHERE "indexerId" IN (
  'da_indexer_v2::celestia',
  'da_indexer_v2::avail',
  'eigenda_layer_indexer::eigenda',
  'eigenda_projects_indexer::eigenda'
);
DELETE FROM "IndexerState"
WHERE "indexerId" IN (
  'da_indexer_v2::celestia',
  'da_indexer_v2::avail',
  'eigenda_layer_indexer::eigenda',
  'eigenda_projects_indexer::eigenda',
  'dabeat_stats_indexer::avail',
  'dabeat_stats_indexer::celestia',
  'dabeat_stats_indexer::near-da',
  'dabeat_stats_indexer::espresso'
);

-- Pass 3: DA-beat stats of the removed layers.
DELETE FROM "DaBeatStats"
WHERE "id" IN ('avail', 'celestia', 'near-da', 'espresso', 'eigenda', 'memo');

-- Pass 4: DA sync status of the layers and of projects that posted only to
-- them. Projects that also post to Ethereum share the row and keep it.
DELETE FROM "SyncMetadata"
WHERE "feature" = 'dataAvailability'
  AND "id" IN (
    'avail', 'celestia', 'eigenda',
    'ancient', 'b3', 'eclipse', 'form', 'galxegravity', 'ham', 'hypr',
    'karak', 'lens', 'mantapacific', 'megaeth', 'molten', 'nillion',
    'orderly', 'pepeunchained', 'plumenetwork', 'rari', 'rise', 'river',
    'sophon', 'stack', 'winr'
  );

-- Pass 5: liveness and cost aggregates of the removed DA bridges. The
-- tracked-txs wipe on deploy only cleared Liveness and L2Cost.
DELETE FROM "AggregatedLiveness" WHERE "projectId" IN ('blobstream', 'vector', 'espresso');
DELETE FROM "AnomalyStats" WHERE "projectId" IN ('blobstream', 'vector', 'espresso');
DELETE FROM "RealTimeAnomaly" WHERE "projectId" IN ('blobstream', 'vector', 'espresso');
DELETE FROM "AggregatedL2Cost" WHERE "projectId" IN ('blobstream', 'vector', 'espresso');
-- RealTimeLiveness is keyed by tracked-tx config id, see createTrackedTxId.
DELETE FROM "RealTimeLiveness"
WHERE "configurationId" IN (
  '4f0992848cf1', '520a6bcaa83c', '56f8d8f7dbc6', '76489c28bb6e',
  '869058fff923', '93a3b393e931', 'bf29124e88c2', 'c49b39206cb9',
  'ec2f557eb395', 'f74a1315335d'
);
