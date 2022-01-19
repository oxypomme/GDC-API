import { Router } from "express";

import mapRoutes from "./maps.js";
import missionRoutes from "./missions.js";
import playerRouter from "./players.js";

const router = Router();

router.use("/maps", mapRoutes);
router.use("/missions", missionRoutes);
router.use("/players", playerRouter);

export default router;
