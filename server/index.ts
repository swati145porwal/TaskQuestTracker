import express, { Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { serveStatic, setupVite } from "./vite";

const app = express();
app.use(express.json());

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(status).json({ message });
});

// importantly only setup vite in development and after
// setting up all the other routes so the catch-all route
// doesn't interfere with the other routes
if (app.get("env") === "development" || process.env.NODE_ENV === "development" || !process.env.REPLIT_DEPLOYMENT) {
  const server = createServer(app);
  setupVite(app, server);
    const port = process.env.PORT || 3000;
  server.listen({
    port,
    host: "127.0.0.1",
    reusePort: true,
  }, () => {
    console.log(`serving on port ${port}`);
  })
} else {
  serveStatic(app);
  console.log("serving static files");
  app.listen(process.env.PORT || 3000, () => {
    console.log(`serving on port ${process.env.PORT || 3000}`);
  })
}

