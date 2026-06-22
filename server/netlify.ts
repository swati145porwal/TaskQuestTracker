import serverless from "serverless-http";
import { createApp } from "./app.ts";

const { app } = await createApp();

export const handler = serverless(app);
