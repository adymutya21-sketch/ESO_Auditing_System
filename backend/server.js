const express = require("express");
const mysql = require("mysql2/promise");
const app = express();

// Serve frontend files
app.use(express.static("public"));

// Create MySQL connection pool
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",          // change if you set a password
    database: "eso_as_db"
});

// API endpoint to read data from MySQL
app.get("/data", async (req, res) => {
    try {
        // Read student data and join with courses table
        const [rows] = await db.execute(`
            SELECT 
                t.\`First_Name\`,
                t.\`Last_Name\`,
                c.course AS Course,
                t.ID,
                t.Payment_Status,
                t.Eval_Status
            FROM temp_database t
            LEFT JOIN courses c
                ON t.Course_ID = c.id
        `);

        // Send combined data to frontend
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});


//Get fee list
app.get("/fees", async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM fee_list");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch fees" });
    }
});

//Add new fee
app.use(express.json()); // REQUIRED for POST

app.post("/fees", async (req, res) => {
    const { fee_name, amount } = req.body;

    try {
        await db.execute(
            "INSERT INTO fee_list (fee_name, amount) VALUES (?, ?)",
            [fee_name, amount]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to add fee" });
    }
});

//Delete fee
app.delete("/fees/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await db.execute("DELETE FROM fee_list WHERE id = ?", [id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete fee" });
    }
});

//Get Student list
app.get("/students_list", async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM students_lists");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch students_list" });
    }
});

app.post("/students_list", async (req, res) => {
    const { first_name, last_name, student_id, course, year_level, gmail,password } = req.body;

    try {
        await db.execute(
            "INSERT INTO students_lists (first_name, last_name, student_id, course, year_level, gmail, password) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [first_name, last_name, student_id, course, year_level, gmail,password]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to add students_list" });
    }
});

// Start server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
