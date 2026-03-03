UPDATE "InteropTransfer"
SET "bridgeType" = 'burnAndMint'
WHERE "bridgeType" = 'omnichain';

UPDATE "AggregatedInteropTransfer"
SET "bridgeType" = 'burnAndMint'
WHERE "bridgeType" = 'omnichain';

UPDATE "AggregatedInteropToken"
SET "bridgeType" = 'burnAndMint'
WHERE "bridgeType" = 'omnichain';

UPDATE "InteropConfig"
SET "value" = REPLACE("value", '"omnichain"', '"burnAndMint"')
WHERE "value" LIKE '%"omnichain"%';
