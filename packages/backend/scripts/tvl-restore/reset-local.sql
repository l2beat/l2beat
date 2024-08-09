-- To run it login via psql and then type: \i reset-local.sql

DO $$
BEGIN
    -- Checking and deleting from indexer_state
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'indexer_state') THEN
        DELETE FROM indexer_state;
    END IF;

    -- Checking and deleting from indexer_configurations
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'indexer_configurations') THEN
        DELETE FROM indexer_configurations;
    END IF;

    -- Checking and deleting from block_timestamps
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'block_timestamps') THEN
        DELETE FROM block_timestamps;
    END IF;

    -- Checking and deleting from amounts
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'amounts') THEN
        DELETE FROM amounts;
    END IF;

    -- Checking and deleting from prices
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'prices') THEN
        DELETE FROM prices;
    END IF;

    -- Checking and deleting from values
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'values') THEN
        DELETE FROM values;
    END IF;
END $$;