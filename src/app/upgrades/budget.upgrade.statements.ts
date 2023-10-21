export class BudgetUpgradeStatements {
  budgetUpgrades = [
    {
      toVersion: 1,
      statements: [
        `CREATE TABLE IF NOT EXISTS budgets(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          client TEXT NOT NULL,
          reference TEXT NOT NULL,
          budget TEXT NOT NUll,
          total TEXT NOT NULL,
          labor TEXT NOT NULL,
          laborAndTotal TEXT NOT NULL,
          filepath TEXT NULL,
          active INTEGER DEFAULT 1
          );`,
      ],
    },
    /* add new statements below for next database version when required*/
    /*
      {
      toVersion: 2,
      statements: [
          `ALTER TABLE users ADD COLUMN email TEXT;`,
      ]
      },
      */
  ];
}
