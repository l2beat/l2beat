-- Alt-DA layers are no longer tracked; their rows are unread history that
-- every DataAvailability reader would otherwise have to filter out.
DELETE FROM "DataAvailability" WHERE "daLayer" <> 'ethereum';
