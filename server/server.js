/*
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();

const port = process.env.PORT || 8080;

const corsOptions = {
  origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Get all Users
app.get('/api/v1/users', async (req, res) => {
  try {
    const results = await db.query('SELECT * FROM account');

    res.status(201).json({
      status: "success",
      results: results.rows.length,
      data: {
        users: results.rows,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// Get a User
app.get("/api/v1/users/:id", async (req, res) => {
  console.log(req.params);

  try {
    const results = await db.query("SELECT * FROM account WHERE account_id = $1", [req.params.id]);

    res.status(200).json({
      status: "success",
      data: {
        account: results.rows[0],
      },
    })
  } catch (err) {
    console.log(err);
  }
});

// Create a User 
app.post("/api/v1/users", async (req, res) => {
  console.log(req.body);

  try {
    const results = await db.query("INSERT INTO account (username, password) VALUES ($1, $2) RETURNING *", [req.body.username, req.body.password]);
    
    res.status(201).json({
      status: "success",
      data: {
        account: results.rows[0],
      },
    })
  } catch (err) {
    console.log(err);
  }
  
});

// Update a User
app.put("/api/v1/users/:id", async (req, res) => {
  console.log(req.params.id);
  console.log(req.body);

  try {
    const results = await db.query("UPDATE account SET username = $1, password = $2 WHERE account_id = $3 RETURNING *", [req.body.username, req.body.password, req.params.id]);
  
    res.status(200).json({
      status: "success",
      data: {
        account: results.rows[0],
      },
    })
  } catch (err) {
    console.log(err);
  }

  
});

// Delete a User
app.delete("/api/v1/users/:id", async (req, res) => {
  console.log(req.params.id);

  try {
    const results = await db.query("DELETE FROM account WHERE account_id = $1", [req.params.id]);
  
    res.status(204).json({
      status: "success",
      data: {
        account: results.rows[0],
      },
    })
  } catch (err) {
    console.log(err);
  }

  
});

app.listen(port, () => {
  console.log(`Server is up and listening on port ${port}`);
});

*/