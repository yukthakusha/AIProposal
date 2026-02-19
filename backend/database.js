import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('govpreneurs.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS CompanyProfiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      company_name TEXT,
      naics_codes TEXT,
      core_capabilities TEXT,
      past_performance TEXT,
      FOREIGN KEY (user_id) REFERENCES Users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Opportunities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      agency TEXT NOT NULL,
      description TEXT NOT NULL,
      naics_code TEXT,
      deadline TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Proposals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      opportunity_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES Users(id),
      FOREIGN KEY (opportunity_id) REFERENCES Opportunities(id)
    )
  `);

  // Insert sample opportunities
  const opportunities = [
    [1, 'IT Infrastructure Modernization', 'Department of Defense', 'Seeking qualified contractors to modernize legacy IT systems and implement cloud-based solutions.', '541512', '2026-06-30'],
    [2, 'Cybersecurity Assessment Services', 'Department of Homeland Security', 'Comprehensive cybersecurity assessment and penetration testing for federal networks.', '541519', '2026-07-15'],
    [3, 'Data Analytics Platform Development', 'General Services Administration', 'Development of advanced data analytics platform for government operations optimization.', '541511', '2026-08-01']
  ];

  opportunities.forEach(opp => {
    db.run(`INSERT OR IGNORE INTO Opportunities (id, title, agency, description, naics_code, deadline) VALUES (?, ?, ?, ?, ?, ?)`, opp);
  });
});

export default db;
