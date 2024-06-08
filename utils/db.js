import Database from "better-sqlite3";
import * as sqlite_vss from "sqlite-vss";

export const init = (loadVSS = true) => {
  const db = new Database("./public/output.db");
  db.pragma("journal_mode = WAL");

  if (loadVSS) {
    sqlite_vss.load(db);
  }

  return db;
};
