import { NextFunction, Request, Response, Router } from "express";
import { ObjectId } from "mongodb";
import { z } from "zod";
import getConnectedDbClient from "../../db/getConnectedDbClient.js";
import { PlaceService } from "../../db/models/PlaceService.js";
import { ReserveService } from "../../db/models/ReserveService.js";

const router = Router();

const reserveParamsSchema = z.object({
  placeId: z
    .string()
    .min(1)
    .refine((value) => ObjectId.isValid(value), {
      message: "Invalid placeId",
    }),
});

const reserveBodySchema = z.object({
  date: z.string().min(1).pipe(z.coerce.date()),
  customersQuantity: z.coerce.number().int().gt(0),
});

router.post(
  "/:placeId/make",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { placeId } = reserveParamsSchema.parse(req.params);
      const { date, customersQuantity } = reserveBodySchema.parse(req.body);

      const dbClient = await getConnectedDbClient();

      const pService = new PlaceService(dbClient);

      const place = await pService.find(placeId);

      if (!place) {
        res.status(404).json({ message: "Place not found" });

        return;
      }

      const numberOfTablesForCustomers = place.tables.filter(
        (x) => x === customersQuantity
      ).length;

      if (numberOfTablesForCustomers < 1) {
        res
          .status(400)
          .json({ message: "Place does not have table for that quantity" });

        return;
      }

      const rService = new ReserveService(dbClient);

      const currentReserves = await rService.findAll(placeId, date);

      const reservedTablesForQuantity = currentReserves.filter(
        (x) => x.customersQuantity === customersQuantity
      ).length;

      if (numberOfTablesForCustomers <= reservedTablesForQuantity) {
        res.status(400).json({
          message: "Place does not have a table available for that quantity",
        });
        return;
      }

      const result = await rService.create({
        placeId,
        date,
        customersQuantity,
      });

      res.status(200).json({ id: result.id });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
