DO $$
DECLARE
    tables TEXT[] := ARRAY['IndexerState', 'IndexerConfiguration', 'BlockTimestamp', 'Amount', 'Price', 'Value'];
    table_name TEXT;
BEGIN
    FOREACH table_name IN ARRAY tables
    LOOP
        EXECUTE format('DELETE FROM %I', table_name);
    END LOOP;
END $$;