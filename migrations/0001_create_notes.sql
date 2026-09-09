-- Migration number: 0001 	 2026-09-09T00:00:00.000Z

-- AUTOINCREMENT rather than a bare INTEGER PRIMARY KEY: without it SQLite
-- reuses the rowid of a deleted note, so a stale bookmark would open a
-- different note.
CREATE TABLE notes (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  text      TEXT    NOT NULL DEFAULT '',
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER
);

CREATE INDEX notes_createdAt ON notes (createdAt DESC);
