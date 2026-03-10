\set ON_ERROR_STOP on
\pset footer off

-- Usage:
--   psql "$DATABASE_URL" \
--     -v out_server_info='/tmp/db-snapshot/01_server_info.csv' \
--     -v out_db_size='/tmp/db-snapshot/02_db_size.csv' \
--     ... \
--     -f snapshot.sql

\echo [1/13] server and version
\copy (SELECT now() AS collected_at, current_database() AS database_name, current_user AS current_user, version() AS server_version, inet_server_addr() AS server_addr, inet_server_port() AS server_port, pg_postmaster_start_time() AS postmaster_start_time) TO '01_server_info.csv' WITH CSV HEADER;

\echo [2/13] important postgres settings
\copy (SELECT name, setting, unit, source FROM pg_settings WHERE name IN ('max_connections', 'shared_buffers', 'work_mem', 'maintenance_work_mem', 'effective_cache_size', 'random_page_cost', 'effective_io_concurrency', 'checkpoint_timeout', 'checkpoint_completion_target', 'max_wal_size', 'min_wal_size', 'autovacuum', 'autovacuum_max_workers', 'autovacuum_naptime', 'autovacuum_vacuum_scale_factor', 'autovacuum_analyze_scale_factor', 'autovacuum_vacuum_threshold', 'autovacuum_analyze_threshold', 'track_io_timing', 'track_activities') ORDER BY name) TO '02_settings.csv' WITH CSV HEADER;

\echo [3/13] database size summary
\copy (SELECT datname AS database_name, pg_database_size(datname) AS bytes FROM pg_database ORDER BY pg_database_size(datname) DESC) TO '03_db_size.csv' WITH CSV HEADER;

\echo [4/13] largest user tables
\copy (SELECT st.schemaname, st.relname AS table_name, pg_relation_size(st.relid) AS table_bytes, pg_indexes_size(st.relid) AS index_bytes, pg_total_relation_size(st.relid) AS total_bytes FROM pg_stat_user_tables st ORDER BY pg_total_relation_size(st.relid) DESC LIMIT 200) TO '04_table_sizes.csv' WITH CSV HEADER;

\echo [5/13] autovacuum and dead tuples
\copy (SELECT schemaname, relname AS table_name, n_live_tup, n_dead_tup, CASE WHEN n_live_tup > 0 THEN round(100.0 * n_dead_tup / n_live_tup, 2) ELSE NULL END AS dead_tuple_pct, n_tup_ins, n_tup_upd, n_tup_del, n_mod_since_analyze, last_vacuum, last_autovacuum, last_analyze, last_autoanalyze, vacuum_count, autovacuum_count, analyze_count, autoanalyze_count FROM pg_stat_user_tables ORDER BY n_dead_tup DESC, n_mod_since_analyze DESC) TO '05_autovacuum_dead_tuples.csv' WITH CSV HEADER;

\echo [6/13] hot tables (vacuum/reindex candidates)
\copy (SELECT st.schemaname, st.relname AS table_name, pg_total_relation_size(st.relid) AS total_bytes, st.n_live_tup, st.n_dead_tup, CASE WHEN st.n_live_tup > 0 THEN round(100.0 * st.n_dead_tup / st.n_live_tup, 2) ELSE NULL END AS dead_tuple_pct, st.last_autovacuum, st.last_autoanalyze, st.n_mod_since_analyze FROM pg_stat_user_tables st WHERE pg_total_relation_size(st.relid) > 128 * 1024 * 1024 ORDER BY CASE WHEN st.n_live_tup > 0 THEN st.n_dead_tup::numeric / st.n_live_tup ELSE 0 END DESC, pg_total_relation_size(st.relid) DESC LIMIT 100) TO '06_hot_tables_candidates.csv' WITH CSV HEADER;

\echo [7/13] index usage and index hit ratio
\copy (SELECT ui.schemaname, ui.relname AS table_name, ui.indexrelname AS index_name, ui.idx_scan, ui.idx_tup_read, ui.idx_tup_fetch, si.idx_blks_read, si.idx_blks_hit FROM pg_stat_user_indexes ui JOIN pg_statio_user_indexes si ON ui.relid = si.relid AND ui.indexrelid = si.indexrelid ORDER BY ui.idx_scan ASC, si.idx_blks_read DESC LIMIT 300) TO '07_index_usage.csv' WITH CSV HEADER;

\echo [8/13] table cache hit ratio
\copy (SELECT st.schemaname, st.relname AS table_name, io.heap_blks_read, io.heap_blks_hit, CASE WHEN (io.heap_blks_read + io.heap_blks_hit) > 0 THEN round(100.0 * io.heap_blks_hit / (io.heap_blks_read + io.heap_blks_hit), 2) ELSE NULL END AS heap_hit_pct, io.idx_blks_read, io.idx_blks_hit, CASE WHEN (io.idx_blks_read + io.idx_blks_hit) > 0 THEN round(100.0 * io.idx_blks_hit / (io.idx_blks_read + io.idx_blks_hit), 2) ELSE NULL END AS index_hit_pct FROM pg_statio_user_tables io JOIN pg_stat_user_tables st ON st.relid = io.relid ORDER BY io.heap_blks_read DESC LIMIT 200) TO '08_cache_hit_ratio.csv' WITH CSV HEADER;

\echo [9/13] active sessions and long transactions
\copy (SELECT now() AS collected_at, pid, usename, application_name, client_addr, state, wait_event_type, wait_event, backend_type, xact_start, query_start, now() - xact_start AS xact_age, now() - query_start AS query_age, left(query, 1000) AS query FROM pg_stat_activity WHERE pid <> pg_backend_pid() ORDER BY CASE WHEN xact_start IS NULL THEN interval '0' ELSE now() - xact_start END DESC, CASE WHEN query_start IS NULL THEN interval '0' ELSE now() - query_start END DESC) TO '09_activity_long_xacts.csv' WITH CSV HEADER;

\echo [10/13] lock waits and blockers
\copy (SELECT now() AS collected_at, blocked.pid AS blocked_pid, blocked.usename AS blocked_user, blocked.application_name AS blocked_app, blocked.wait_event_type AS blocked_wait_type, blocked.wait_event AS blocked_wait_event, blocker.pid AS blocker_pid, blocker.usename AS blocker_user, blocker.application_name AS blocker_app, left(blocked.query, 500) AS blocked_query, left(blocker.query, 500) AS blocker_query FROM pg_stat_activity blocked JOIN pg_locks blocked_l ON blocked.pid = blocked_l.pid AND NOT blocked_l.granted JOIN pg_locks blocker_l ON blocker_l.locktype = blocked_l.locktype AND blocker_l.database IS NOT DISTINCT FROM blocked_l.database AND blocker_l.relation IS NOT DISTINCT FROM blocked_l.relation AND blocker_l.page IS NOT DISTINCT FROM blocked_l.page AND blocker_l.tuple IS NOT DISTINCT FROM blocked_l.tuple AND blocker_l.virtualxid IS NOT DISTINCT FROM blocked_l.virtualxid AND blocker_l.transactionid IS NOT DISTINCT FROM blocked_l.transactionid AND blocker_l.classid IS NOT DISTINCT FROM blocked_l.classid AND blocker_l.objid IS NOT DISTINCT FROM blocked_l.objid AND blocker_l.objsubid IS NOT DISTINCT FROM blocked_l.objsubid AND blocker_l.pid <> blocked_l.pid AND blocker_l.granted JOIN pg_stat_activity blocker ON blocker.pid = blocker_l.pid) TO '10_lock_waits.csv' WITH CSV HEADER;

\echo [11/13] bgwriter and checkpoint stats
\copy (SELECT * FROM pg_stat_bgwriter) TO '11_bgwriter.csv' WITH CSV HEADER;

\echo [12/13] wal stats
\copy (SELECT * FROM pg_stat_wal) TO '12_wal.csv' WITH CSV HEADER;

\echo [13/13] extension inventory and pg_stat_statements status
\copy (SELECT e.extname, e.extversion, n.nspname AS schema_name FROM pg_extension e JOIN pg_namespace n ON n.oid = e.extnamespace ORDER BY e.extname) TO '13_extensions.csv' WITH CSV HEADER;

-- Optional follow-up (run manually if pg_stat_statements is installed):
-- \copy (
--   SELECT
--     calls,
--     total_exec_time,
--     mean_exec_time,
--     rows,
--     shared_blks_read,
--     shared_blks_hit,
--     temp_blks_read,
--     temp_blks_written,
--     wal_bytes,
--     left(query, 1200) AS query
--   FROM pg_stat_statements
--   ORDER BY total_exec_time DESC
--   LIMIT 100
-- ) TO '/tmp/db-snapshot/14_pg_stat_statements_top.csv' WITH CSV HEADER;
