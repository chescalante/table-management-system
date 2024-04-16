import { Router } from "express";

import placesRoute from "./places/route.js";
import reservesRoute from "./reserves/route.js";
import testRoute from "./test/route.js";

const router = Router();

router.use("/test", testRoute);
router.use("/places", placesRoute);
router.use("/reserves", reservesRoute);

export default router;
