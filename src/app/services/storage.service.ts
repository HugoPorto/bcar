import { Injectable } from '@angular/core';

import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { SQLiteService } from './sqlite.service';
import { DbnameVersionService } from './dbname-version.service';
import { BudgetUpgradeStatements } from '../upgrades/budget.upgrade.statements';
import { DataBudget } from '../repositories/interfaces/budget';
import { BehaviorSubject, Observable } from 'rxjs';
import { Toast } from '@capacitor/toast';

@Injectable()
export class StorageService {
  public budgetList: BehaviorSubject<DataBudget[]> = new BehaviorSubject<DataBudget[]>([]);
  private databaseName: string = '';
  private bUpdStmts: BudgetUpgradeStatements = new BudgetUpgradeStatements();
  private versionUpgrades;
  private loadToVersion;
  private db!: SQLiteDBConnection;
  private isBudgetReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private sqliteService: SQLiteService,
    private dbVerService: DbnameVersionService
  ) {
    this.versionUpgrades = this.bUpdStmts.budgetUpgrades;
    this.loadToVersion = this.versionUpgrades[this.versionUpgrades.length - 1].toVersion;
  }
  async initializeDatabase(dbName: string) {
    this.databaseName = dbName;

    await this.sqliteService.addUpgradeStatement({
      database: this.databaseName,
      upgrade: this.versionUpgrades,
    });

    this.db = await this.sqliteService.openDatabase(
      this.databaseName,
      false,
      'no-encryption',
      this.loadToVersion,
      false
    );

    this.dbVerService.set(this.databaseName, this.loadToVersion);

    await this.getBudgets();
  }

  budgetState() {
    return this.isBudgetReady.asObservable();
  }

  fetchBudgets(): Observable<DataBudget[]> {
    return this.budgetList.asObservable();
  }

  async loadBudgets() {
    const budgets: DataBudget[] = (
      await this.db.query('SELECT * FROM budgets ORDER BY id DESC LIMIT 10;')
    ).values as DataBudget[];

    this.budgetList.next(budgets);
  }

  async loadBudgetsPagingOld(page: number, pageSize: number) {
    const offset = (page - 1) * pageSize;
    const budgets: DataBudget[] = (
      await this.db.query(`SELECT * FROM budgets ORDER BY id DESC LIMIT ${pageSize} OFFSET ${offset};`)
    ).values as DataBudget[];
    this.budgetList.next(budgets);
  }

  async loadBudgetsPaging(offset: number) {
    const budgets: DataBudget[] = (
      await this.db.query(
        `SELECT * FROM budgets ORDER BY id DESC LIMIT 10 OFFSET ${offset};`
      )
    ).values as DataBudget[];
    return budgets;
  }

  async getBudgets() {
    await this.loadBudgets();
    this.isBudgetReady.next(true);
  }

  async addBudget(
    budget: string,
    nameClient: string,
    total: string,
    labor: string
  ) {
    const client = nameClient;
    const reference = this.dataAtualFormatada();
    const laborAndTotal = Math.abs(
      parseFloat(total.replace(',', '.')) - parseFloat(labor.replace(',', '.'))
    );
    const filePath = '';
    const sql = `INSERT INTO budgets (client, reference, budget,
      total, labor, laborAndTotal, filePath) VALUES (?,?,?,?,?,?,?);`;
    await this.db.run(sql, [
      client,
      reference,
      budget,
      total,
      labor,
      laborAndTotal,
      filePath,
    ]);
    await this.getBudgets();
    await Toast.show({
      text: `Salvo com sucesso!`,
      duration: 'long',
    });
  }

  async inactiveBudgetById(id: string, active: number) {
    const sql = `UPDATE budgets SET active=${active} WHERE id=${id}`;
    await this.db.run(sql);
    await this.getBudgets();
  }

  async updateBudgetById(
    id: string,
    budget: string,
    nameClient: string,
    total: string,
    labor: string
  ) {
    const laborAndTotal = Math.abs(
      parseFloat(total.replace(',', '.')) - parseFloat(labor.replace(',', '.'))
    );
    const reference = this.dataAtualFormatada();
    const sql = `UPDATE budgets SET budget='${budget}',
      client="${nameClient}",
      total="${total}",
      labor="${labor}",
      reference="${reference}",
      laborAndTotal="${laborAndTotal}" WHERE id=${id}`;
    await this.db.run(sql);
    await this.getBudgets();
    await Toast.show({
      text: `Salvo com sucesso!`,
      duration: 'long',
    });
  }

  async updateFilePathBudgetById(id: string, filePath: string) {
    const sql = `UPDATE budgets SET filePath='${filePath}' WHERE id=${id}`;
    await this.db.run(sql);
    await this.getBudgets();
  }

  async getBudget(id: string) {
    const sql = `SELECT * FROM budgets WHERE id=${id}`;
    const result = await this.db.query(sql);
    if (result && result.values && result.values.length > 0) {
      const budget = result.values[0] as DataBudget;
      return budget;
    }
    return null;
  }

  async getBudgetByNameCommon(client: string) {
    const sql = `SELECT * FROM budgets WHERE client='${client}'`;
    const result = await this.db.query(sql);
    if (result && result.values && result.values.length > 0) {
      const budget = result.values[0] as DataBudget;
      return budget;
    }
    return null;
  }

  async getBudgetByName(client: string) {
    console.log(
      `Service: StorageService - Function: getBudgetByName - Param: ${client}`
    );
    const sql = `SELECT * FROM budgets WHERE client LIKE '%${client}%'`;
    const result = await this.db.query(sql);
    if (result && result.values && result.values.length > 0) {
      const budget = result.values[0] as DataBudget;
      return budget;
    }
    return null;
  }

  async deleteBudgetById(id: string) {
    const sql = `DELETE FROM budgets WHERE id=${id}`;
    await this.db.run(sql);
    await this.getBudgets();
  }

  dataAtualFormatada() {
    var data = new Date(),
      dia = data.getDate().toString(),
      diaF = dia.length == 1 ? '0' + dia : dia,
      mes = (data.getMonth() + 1).toString(),
      mesF = mes.length == 1 ? '0' + mes : mes,
      anoF = data.getFullYear();
    var hora = data.getHours();
    var minuto = data.getMinutes();
    var segundo = data.getSeconds();
    return (
      anoF +
      '-' +
      mesF +
      '-' +
      diaF +
      ' às ' +
      hora +
      ':' +
      minuto +
      ':' +
      segundo
    );
  }

  getConnection() {
    return this.db;
  }

  async listTables() {
    const tables = await this.db.query("SELECT name FROM sqlite_master WHERE type='table';");
    console.log(tables.values);
  }
}
