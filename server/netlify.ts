import serverless from "serverless-http";
import { createApp } from "./app.ts";

type ServerlessHandler = ReturnType<typeof serverless>;

let cachedHandler: ServerlessHandler | undefined;
let initPromise: Promise<void> | undefined;

async function getHandler(): Promise<ServerlessHandler> {
  if (cachedHandler) {
    return cachedHandler;
  }

  if (!initPromise) {
    initPromise = createApp().then(({ app }) => {
      cachedHandler = serverless(app);
    });
  }

  await initPromise;
  return cachedHandler!;
}

export async function handler(event: unknown, context: unknown) {
  const fn = await getHandler();
  return fn(event, context);
}
