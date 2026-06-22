import { createApp } from "./app.js";
import { log } from "./log";

const { app, server } = await createApp();

const isServerless = !!(
  process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
);

if (!isServerless) {
  const { setupVite, serveStatic } = await import("./vite.js");

  if (process.env.REPLIT_DEPLOYMENT) {
    serveStatic(app);
  } else if (
    app.get("env") === "development" ||
    process.env.NODE_ENV === "development"
  ) {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = process.env.PORT || 5000;
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
}

export default app;
