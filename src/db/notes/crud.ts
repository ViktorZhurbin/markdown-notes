import { id } from "@instantdb/react";
import { db } from "../instant";

export function addNote(text = "") {
  const recordId = id();

  db.transact(
    db.tx.entries[recordId].update({
      text,
      createdAt: new Date().toISOString(),
    }),
  );

  return recordId;
}

export function updateNote(recordId: string, text: string) {
  db.transact(
    db.tx.entries[recordId].update({
      text,
      updatedAt: new Date().toISOString(),
    }),
  );
}

export function deleteNote(recordId: string) {
  db.transact(db.tx.entries[recordId].delete());
}

