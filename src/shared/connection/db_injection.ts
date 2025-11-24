// src/lib/DB.ts
import mysql from "mysql2/promise";
import {
  getDbPool,
  getActiveConnectionFromContext,
  runInConnectionContext,
} from "@/shared/connection/db";

// Helper class to mark raw SQL expressions
class RawSql {
  constructor(public value: string) {}
}

class DatabaseFacade {
  // ... (previous execute, query, beginTransaction, commit, rollBack, transaction methods remain the same) ...

  private async getActiveOrNewConnection(): Promise<{
    connection: mysql.PoolConnection;
    needsRelease: boolean;
  }> {
    const activeConnection = getActiveConnectionFromContext();
    if (activeConnection) {
      return { connection: activeConnection, needsRelease: false };
    }

    const pool = await getDbPool();
    const newConnection = await pool.getConnection();
    return { connection: newConnection, needsRelease: true };
  }

  public async execute<
    T extends
      | mysql.ResultSetHeader
      | mysql.RowDataPacket[]
      | mysql.ProcedureCallPacket
  >(sql: string, values?: any[]): Promise<[T, mysql.FieldPacket[]]> {
    const { connection, needsRelease } = await this.getActiveOrNewConnection();
    try {
      const result = await connection.execute<T>(sql, values);
      return result;
    } finally {
      if (needsRelease) {
        connection.release();
      }
    }
  }

  public async query<
    T extends
      | mysql.ResultSetHeader
      | mysql.RowDataPacket[]
      | mysql.OkPacket
      | mysql.ProcedureCallPacket
  >(sql: string, values?: any[]): Promise<[T, mysql.FieldPacket[]]> {
    const { connection, needsRelease } = await this.getActiveOrNewConnection();
    try {
      const result = await connection.query<T>(sql, values);
      return result;
    } finally {
      if (needsRelease) {
        connection.release();
      }
    }
  }

  public async beginTransaction(): Promise<void> {
    const activeConnection = getActiveConnectionFromContext();
    if (activeConnection) {
      throw new Error(
        "Cannot begin a nested transaction. A transaction is already active in this context."
      );
    }
    const pool = await getDbPool();
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    await runInConnectionContext(connection, async () => {});
    return connection as any;
  }

  public async commit(): Promise<void> {
    const connection = getActiveConnectionFromContext();
    if (!connection) {
      throw new Error("No active transaction to commit.");
    }
    try {
      await connection.commit();
      console.log("MySQL transaction committed.");
    } finally {
      connection.release();
      runInConnectionContext(null as any, async () => {});
    }
  }

  public async rollBack(): Promise<void> {
    const connection = getActiveConnectionFromContext();
    if (!connection) {
      throw new Error("No active transaction to roll back.");
    }
    try {
      await connection.rollback();
      console.log("MySQL transaction rolled back.");
    } finally {
      connection.release();
      runInConnectionContext(null as any, async () => {});
    }
  }

  public async transaction<T>(callback: () => Promise<T>): Promise<T> {
    const pool = await getDbPool();
    const connection = await pool.getConnection();

    return runInConnectionContext(connection, async () => {
      try {
        await connection.beginTransaction();
        console.log("MySQL transaction started.");
        const result = await callback();
        await connection.commit();
        console.log("MySQL transaction committed.");
        return result;
      } catch (error) {
        console.error("MySQL transaction failed, rolling back:", error);
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    });
  }

  // --- Convenience methods for INSERT, UPDATE, DELETE, SELECT ---
  public async insert<T extends mysql.ResultSetHeader>(
    tableName: string,
    data: Record<string, any>
  ): Promise<T> {
    const columns: string[] = [];
    const placeholders: string[] = [];
    const values: any[] = [];

    for (const key in data) {
      columns.push(`\`${key}\``);
      const value = data[key];
      if (value instanceof RawSql) {
        placeholders.push(value.value); // Directly insert raw SQL expression
      } else {
        placeholders.push("?"); // Use placeholder for values
        values.push(value);
      }
    }

    const sql = `INSERT INTO \`${tableName}\` (${columns.join(
      ", "
    )}) VALUES (${placeholders.join(", ")})`;
    const [result] = await this.execute<T>(sql, values);
    return result;
  }

  public async update<T extends mysql.ResultSetHeader>(
    tableName: string,
    data: Record<string, any>,
    whereClause: string,
    whereValues: any[] = []
  ): Promise<T> {
    const setParts: string[] = [];
    const values: any[] = [];

    for (const key in data) {
      const value = data[key];
      if (value instanceof RawSql) {
        setParts.push(`\`${key}\` = ${value.value}`); // Directly insert raw SQL expression
      } else {
        setParts.push(`\`${key}\` = ?`); // Use placeholder for values
        values.push(value);
      }
    }
    values.push(...whereValues); // Add where values to the end

    const sql = `UPDATE \`${tableName}\` SET ${setParts.join(
      ", "
    )} WHERE ${whereClause}`;
    const [result] = await this.execute<T>(sql, values);
    return result;
  }

  public async delete<T extends mysql.ResultSetHeader>(
    tableName: string,
    whereClause: string,
    whereValues: any[] = []
  ): Promise<T> {
    const sql = `DELETE FROM \`${tableName}\` WHERE ${whereClause}`;
    const [result] = await this.execute<T>(sql, whereValues);
    return result;
  }

  public async select<T extends mysql.RowDataPacket[]>(
    sql: string,
    values?: any[]
  ): Promise<T> {
    const [rows] = await this.query<T>(sql, values);
    return rows;
  }

  // --- Raw SQL Helpers ---
  public raw(sqlExpression: string): RawSql {
    return new RawSql(sqlExpression);
  }

  public uuid(): RawSql {
    return new RawSql("UUID()");
  }

  public now(): RawSql {
    return new RawSql("NOW()");
  }
}

export const DB = new DatabaseFacade();
