-- To run it login via psql and then type: \i reset-local.sql

DO $$
BEGIN
    -- Checking and deleting from IndexerState
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'IndexerState') THEN
        DELETE FROM "IndexerState";
    END IF;

    -- Checking and deleting from IndexerConfiguration
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'IndexerConfiguration') THEN
        DELETE FROM "IndexerConfiguration";
    END IF;

    -- Checking and deleting from BlockTimestamp
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'BlockTimestamp') THEN
        DELETE FROM "BlockTimestamp";
    END IF;

    -- Checking and deleting from Amount
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'Amount') THEN
        DELETE FROM "Amount";
    END IF;

    -- Checking and deleting from Price
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'Price') THEN
        DELETE FROM "Price";
    END IF;

    -- Checking and deleting from Value
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'Value') THEN
        DELETE FROM "Value";
    END IF;
END $$;