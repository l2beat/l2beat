delete from "IndexerState" where "indexerId" LIKE 'tvs_project_value::%';
delete from "IndexerState" where "indexerId" LIKE 'tvs_token_value::%';

delete from "IndexerConfiguration" where "indexerId" LIKE 'tvs_project_value::%';
delete from "IndexerConfiguration" where "indexerId" LIKE 'tvs_token_value::%';

delete from "ProjectValue";
delete from "TokenValue";
