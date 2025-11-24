const express = require("express");
const app = express();
const { Pool } = require("pg");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "my_super_secret_key";


const pool = new Pool({
  user: "yashnehra",
  host: "localhost",
  database: "myappp_ab",
  password: "root",
  port: 5432,
});

pool.connect()
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.error("Database connection error:", err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access denied, token missing" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    req.user = user; 
    next();
  });
}


app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT sign_up($1, $2, $3) AS message",
      [name, email, password]
    );

    const dbMessage = result.rows[0].message;
    if (dbMessage === "Email already registered") {
      return res.status(400).json({ message: dbMessage });
    }
    res.status(201).json({ message: dbMessage });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Server error during signup" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM login($1, $2)", [email, password]); 
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0]; 
    const token = jwt.sign(
      { id: user.user_id, email: user.user_email_out },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user_id: user.user_id, 
    });

  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

app.post("/addtask", verifyToken, async (req, res) => {
  try {
    const { user_id, title, description, status } = req.body;
    await pool.query("SELECT add_todo_task($1, $2, $3, $4)", [
      user_id,
      title,
      description || "",
      status || "pending",
    ]);
    res.status(201).json({ message: "Task added successfully" });
  } catch (error) {
    console.error("Error inserting task:", error);
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/tasks/:user_id", async (req, res) => {
  const user_id = parseInt(req.params.user_id);
  try {
    const result = await pool.query(
      "SELECT * FROM todo_tasks WHERE user_id = $1 ORDER BY created_at DESC",
      [user_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error fetching tasks" });
  }
});

app.get("/pending/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM pending($1)", [user_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No pending requests found" });
    }
    res.status(200).json(result.rows);
  }
  catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(500).json({ message: "Server error fetching pending requests" });
  }
})

app.get("/completed/:user_id", async (req, res) => {
  const user_id = parseInt(req.params.user_id);

  try {
    const result = await pool.query("SELECT * FROM completed($1)", [user_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No completed tasks found" });
    }
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching completed tasks:", error);
    res.status(500).json({ message: "Server error fetching completed tasks" });
  }
});

app.delete("/delete/:task_id/:user_id", async (req, res) => {
  const task_id = parseInt(req.params.task_id);
  const user_id = parseInt(req.params.user_id);

  try {
    const result = await pool.query("SELECT delete_task($1, $2)", [task_id, user_id]);
    res.status(200).json({ message: result.rows[0].delete_task });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Server error deleting task" });
  }
});

app.patch("/updatestatus/:id", async (req, res) => {
  const task_id = parseInt(req.params.id);
  const { status } = req.body;

  if (!["pending", "completed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }
  if (isNaN(task_id)) {
    return res.status(400).json({ message: "Invalid task id" });
  }
  try {
    await pool.query(
      "UPDATE todo_tasks SET status = $1 WHERE id = $2",
      [status, task_id]
    );
    res.status(200).json({ message: "Status updated", status });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Server error" });
  }
});


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
