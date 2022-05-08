import { join, dirname } from "path";
import { Low, JSONFile } from "lowdb";
import { fileURLToPath } from "url";

type Data = {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
};

let database;

export async function onInit() {
  const __dirname = dirname(fileURLToPath(import.meta.url));

  // Use JSON file for storage
  const file = join(__dirname, "db.json");
  const adapter = new JSONFile<Data>(file);
  const db = new Low(adapter);

  // Read data from JSON file, this will set db.data content
  await db.read();

  if (!db.data) {
    db.data = {};
    await db.write();
  }

  database = db;

  return database;
}

export async function getDb(): Promise<Low<Data>> {
  if (database) return database;

  return await onInit();
}
