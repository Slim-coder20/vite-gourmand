import express from "express"
import cors from "cors"
import mysql2 from "mysql2"
import dotenv from "dotenv"
dotenv.config();
const app = express();
const port = 3000;

app.use(express.json())
app.use(cors())

const pool = mysql2
    .createPool({
        host: process.env.DB_HOST,
        database: "vite_gourmand",
        user: "root",
        password: "root"
    }).promise();


app.get('/', async (req, res) => {
    res.send("Hello World"); 
})

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
