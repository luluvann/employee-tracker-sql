async function viewAllDepartments() {
    db.query(`SELECT name AS 'department', id FROM departments`, (err, rows) => {
      const table = cTable.getTable(rows);
      console.log("\n", "\n", "All Departments", "\n", table, "\n", "\n");
    });
    await init();
  }

