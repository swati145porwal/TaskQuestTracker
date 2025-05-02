import express from "express";
import { createServer } from "http";

const app = express();
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

const server = createServer(app);
const port = 3000;

server.listen(port, '127.0.0.1', () => {
  console.log(`Server is running on http://127.0.0.1:${port}`);
});
