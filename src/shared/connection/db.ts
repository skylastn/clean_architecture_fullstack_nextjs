// src/shared/connection/db.ts
import mysql from "mysql2/promise";
import { AsyncLocalStorage } from "async_hooks"; // Node.js built-in for context propagation

const config: mysql.PoolOptions = {
  host: process.env.DB_HOST ?? "localhost",
  user: process.env.DB_USERNAME ?? "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_DATABASE ?? "your_database_name",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Use a global variable to store the pool for Next.js API routes
declare global {
  var mysqlPool: mysql.Pool | undefined;
}

// AsyncLocalStorage to hold the current connection (especially for transactions)
interface DbContext {
  connection: mysql.PoolConnection;
}
const connectionStore = new AsyncLocalStorage<DbContext>();

/**
 * Gets the singleton MySQL Connection Pool.
 * Initializes it if it doesn't exist.
 */
export async function getDbPool(): Promise<mysql.Pool> {
  if (global.mysqlPool) {
    // console.log("Using existing MySQL connection pool.");
    return global.mysqlPool;
  }

  try {
    const newPool = mysql.createPool(config);
    console.log("New MySQL connection pool created.");

    // Optional: Test the connection to ensure it's working
    const testConnection = await newPool.getConnection();
    console.log("Successfully connected to MySQL database!");
    testConnection.release(); // Release the test connection

    global.mysqlPool = newPool;
    return newPool;
  } catch (error) {
    console.error("Failed to create MySQL connection pool:", error);
    global.mysqlPool = undefined;
    throw error;
  }
}

/**
 * Retrieves the currently active database connection from the AsyncLocalStorage context.
 * This is primarily used internally by the DB facade.
 */
export function getActiveConnectionFromContext():
  | mysql.PoolConnection
  | undefined {
  const store = connectionStore.getStore();
  return store?.connection;
}

/**
 * Runs a function within a specific AsyncLocalStorage context.
 * This is used by the DB facade to set the transactional connection.
 */
export function runInConnectionContext<T>(
  connection: mysql.PoolConnection,
  callback: () => Promise<T>
): Promise<T> {
  return connectionStore.run({ connection }, callback);
}
