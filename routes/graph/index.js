import { Router } from "express";

import playerRouter from "./players.js";

const router = Router();

router.use("/players", playerRouter);

export default router;
