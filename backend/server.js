const express = require("express");
const mysql = require("mysql2/promise");
const app = express();

app.use(express.json()); // REQUIRED for POST
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
        /*const [rows] = await connection.execute(
      `SELECT tabel1.id, tabel1.first_name, tabel1.last_name, table2.status 
       FROM tabel1 
       INNER JOIN table2 ON tabel1.id = table2.id 
       WHERE tabel1.id = ?`, 
      [targetId]
    );*/
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch fees" });
    }
});

//Add new fee
//app.use(express.json()); // REQUIRED for POST

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

//Get Student list -- to be debug
app.get("/students_list", async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM students_lists");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch students_list" });
    }
});

//To be debug - Add new student to students_list
app.post("/students_list", async (req, res) => {
    const { first_name, last_name, student_id, course, year_level, gmail,password } = req.body;

    try {
        await db.execute(
            "INSERT INTO students_lists (first_name, last_name, student_id, course, year_level, gmail, password) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [first_name, last_name, student_id, course, year_level, gmail, password]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to add students_list" });
    }
});

//Get students to be verified
app.get("/verify", async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT 
                t.\`First_Name\`,
                t.\`Last_Name\`,
                c.course AS Course,
                t.ID
            FROM temp_database t
            LEFT JOIN courses c
                ON t.Course_ID = c.id
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch verification data" });
    }
});

//Verify student with a button - Not Finished - To be Debug
app.post("/verify/:id", async (req, res) => { //to be fixed - should be PUT or PATCH - Not Finished
    console.log(req.params.id);// for debugging
    const { id } = req.params;

    try {
    const [result] = await db.execute(
        "UPDATE temp_database SET Eval_Status = 'DONE' WHERE ID = ? AND Eval_Status = 'PENDING'", // Update only if currently PENDING for Evaulation Status
        [id]
    );

    if (result.affectedRows === 0) {
        return res.json({
            success: false,
            message: "Student already verified or not pending"
        });
    }

    res.json({
        success: true,
        message: "Student evaluation marked as DONE"
    });

} catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to verify student" });
}

});

app.post("/uploadImg/:feeId", async (req, res) => {});
/*
app.post("/register", async (req, res) => { //Student Registration - To be Debug
    const { student_id, first_name, last_name, course, year_level, gmail, password } = req.body;

    try {
        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.execute(
            `INSERT INTO students_lists 
            (student_id, first_name, last_name, course, year_level, gmail, password)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [student_id, first_name, last_name, course, year_level, gmail, hashedPassword]
        );

        res.json({ success: true, message: "Registration successful" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Registration failed" });
    }
}); */

// Start server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
