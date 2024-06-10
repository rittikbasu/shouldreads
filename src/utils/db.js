import Database from "better-sqlite3";
import * as sqlite_vss from "sqlite-vss";
import path from "path";

export const init = (loadVSS = true) => {
  const dbPath = path.join(process.cwd(), "public", "output.db");
  console.log("dbPath", dbPath);
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");

  if (loadVSS) {
    sqlite_vss.load(db);
  }

  return db;
};
