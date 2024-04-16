import { NextFunction, Request, Response, Router } from "express";
import { ObjectId } from "mongodb";
import { z } from "zod";
import getConnectedDbClient from "../../db/getConnectedDbClient.js";
import { PlaceService } from "../../db/models/PlaceService.js";

const router = Router();

const placesListSchema = z.object({
  lastId: z
    .string()
    .optional()
    .refine((value) => !value || ObjectId.isValid(value), {
      message: "Invalid lastId",
    }),
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { lastId } = placesListSchema.parse(req.query);

    const dbClient = await getConnectedDbClient();

    const pService = new PlaceService(dbClient);

    let results = await pService.findMany(lastId);

    if (results.total === 0) {
      // TODO: move this to a seed script

      await pService.initialize();

      results = await pService.findMany(lastId);
    }

    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
});

export default router;
