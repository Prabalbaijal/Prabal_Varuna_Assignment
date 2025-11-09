import express from "express";
import cors from "cors";
import routesRouter from "./routes/routesRouter.js";
import complianceRouter from "./routes/complianceRouter.js";
import bankingRouter from "./routes/bankingRouter.js";
import poolsRouter from "./routes/poolsRouter.js";
import { connectDB } from "../../../../infrastructure/prismaClient.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/routes", routesRouter);
app.use("/compliance", complianceRouter);
app.use("/banking", bankingRouter);
app.use("/pools", poolsRouter);

const PORT = process.env.PORT ?? 4000;
async function startServer() {
  await connectDB(); 
  app.listen(PORT, () => console.log(` Backend running on port ${PORT}`));
}

startServer();

export default app;
