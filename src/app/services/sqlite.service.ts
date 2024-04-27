import { Injectable } from '@angular/core';

import { Capacitor } from '@capacitor/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
  CapacitorSQLitePlugin,
  capSQLiteUpgradeOptions,
  capSQLiteResult,
  capSQLiteValues,
} from '@capacitor-community/sqlite';

/**
 * Service for interacting with SQLite database.
 */
@Injectable()
export class SQLiteService {
  sqliteConnection!: SQLiteConnection;
  isService: boolean = false;
  platform!: string;
  sqlitePlugin!: CapacitorSQLitePlugin;
  native: boolean = false;

  constructor() {}

  /**
   * Initializes the SQLite plugin.
   * @returns A promise that resolves to true if the plugin is successfully initialized, otherwise false.
   */
  async initializePlugin(): Promise<boolean> {
    this.platform = Capacitor.getPlatform();

    if (this.platform === 'ios' || this.platform === 'android') {
      this.native = true;
    }

    this.sqlitePlugin = CapacitorSQLite;
    this.sqliteConnection = new SQLiteConnection(this.sqlitePlugin);
    this.isService = true;

    return true;
  }

  /**
   * Initializes the web store for SQLite.
   * @throws An error if the initialization fails.
   */
  async initWebStore(): Promise<void> {
    try {
      await this.sqliteConnection.initWebStore();
    } catch (err: any) {
      const msg = err.message ? err.message : err;
      return Promise.reject(`initWebStore: ${err}`);
    }
  }

  /**
   * Opens a database connection.
   * @param dbName - The name of the database.
   * @param encrypted - Indicates whether the database is encrypted.
   * @param mode - The mode to open the database in.
   * @param version - The version of the database.
   * @param readonly - Indicates whether the database should be opened in read-only mode.
   * @returns A promise that resolves to the SQLiteDBConnection object representing the database connection.
   */
  async openDatabase(
    dbName: string,
    encrypted: boolean,
    mode: string,
    version: number,
    readonly: boolean
  ): Promise<SQLiteDBConnection> {
    let db: SQLiteDBConnection;

    const retCC = (await this.sqliteConnection.checkConnectionsConsistency())
      .result;

    let isConn = (await this.sqliteConnection.isConnection(dbName, readonly))
      .result;

    if (retCC && isConn) {
      db = await this.sqliteConnection.retrieveConnection(dbName, readonly);
    } else {
      db = await this.sqliteConnection.createConnection(
        dbName,
        encrypted,
        mode,
        version,
        readonly
      );
    }

    await db.open();
    return db;
  }

  /**
   * Retrieves a database connection.
   * @param dbName - The name of the database.
   * @param readonly - Indicates whether the database should be retrieved in read-only mode.
   * @returns A promise that resolves to the SQLiteDBConnection object representing the database connection.
   */
  async retrieveConnection(
    dbName: string,
    readonly: boolean
  ): Promise<SQLiteDBConnection> {
    return await this.sqliteConnection.retrieveConnection(dbName, readonly);
  }

  /**
   * Closes a database connection.
   * @param database - The name of the database to close.
   * @param readonly - Indicates whether the database is in read-only mode.
   * @returns A promise that resolves when the connection is closed.
   */
  async closeConnection(database: string, readonly?: boolean): Promise<void> {
    const readOnly = readonly ? readonly : false;

    return await this.sqliteConnection.closeConnection(database, readOnly);
  }

  /**
   * Adds an upgrade statement to the SQLite plugin.
   * @param options - The options for the upgrade statement.
   * @returns A promise that resolves when the upgrade statement is added.
   */
  async addUpgradeStatement(options: capSQLiteUpgradeOptions): Promise<void> {
    await this.sqlitePlugin.addUpgradeStatement(options);
    return;
  }

  /**
   * Saves a database to the web store.
   * @param database - The name of the database to save.
   * @returns A promise that resolves when the database is saved to the web store.
   */
  async saveToStore(database: string): Promise<void> {
    return await this.sqliteConnection.saveToStore(database);
  }
}
