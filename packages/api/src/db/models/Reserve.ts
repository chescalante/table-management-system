import { ObjectId } from "mongodb";
import { z } from "zod";

export const reserveSchema = z.object({
  _id: z.instanceof(ObjectId),
  _placeId: z.instanceof(ObjectId),
  customersQuantity: z.number().min(1),
  date: z.date(),
});

export type ReserveEntity = z.infer<typeof reserveSchema>;

export const reserveDTOSchema = z.object({
  id: z.string(),
  placeId: z.string(),
  customersQuantity: reserveSchema.shape.customersQuantity,
  date: reserveSchema.shape.date,
});

export type ReserveDTO = z.infer<typeof reserveDTOSchema>;
