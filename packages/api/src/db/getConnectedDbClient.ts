import { MongoClient } from "mongodb";
import envParsed from "../envParsed.js";

const connect = async () => {
  try {
    const client = new MongoClient(envParsed().DB_URL);

    return client.connect();
  } catch (error) {
    console.error("failed to connect to the db", error);
    throw new Error("failed to connect to the db");
  }
};

export type DbClientSingleton = Awaited<ReturnType<typeof connect>>;

const globalForDb = globalThis as unknown as {
  db: DbClientSingleton | undefined;
};

const getConnectedDbClient = async () => {
  const dbClient = globalForDb.db ?? (await connect());

  if (process.env.NODE_ENV !== "production") {
    globalForDb.db = dbClient;
  }

  return dbClient;
};

export default getConnectedDbClient;
