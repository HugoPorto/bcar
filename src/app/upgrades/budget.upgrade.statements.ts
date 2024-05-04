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
    {
      toVersion: 2,
      statements: [
        `CREATE TABLE IF NOT EXISTS clients(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          address TEXT NOT NUll,
          phone TEXT NOT NUll,
          active INTEGER DEFAULT 1
          );`,
      ]
    },
  ];
}
