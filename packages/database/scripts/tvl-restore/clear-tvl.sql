DO $$
DECLARE
    tables TEXT[] := ARRAY['IndexerState', 'IndexerConfiguration', 'BlockTimestamp', 'Amount', 'Price', 'Value'];
    table_name TEXT;
BEGIN
    FOREACH table_name IN ARRAY tables
    LOOP
        IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = table_name) THEN
            EXECUTE format('DELETE FROM %I', table_name);
        END IF;
    END LOOP;
END $$;
