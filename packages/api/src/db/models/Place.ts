import { ObjectId } from "mongodb";
import { z } from "zod";

export const placeSchema = z.object({
  _id: z.instanceof(ObjectId),
  name: z.string().trim().min(1),
  tables: z.array(z.number().min(1)).nonempty(), // Eg. 2 tables for 4 customers [4, 4]
});

export type PlaceEntity = z.infer<typeof placeSchema>;

export const placeDTOSchema = z.object({
  id: z.string(),
  name: placeSchema.shape.name,
  tables: placeSchema.shape.tables,
});

export type PlaceDTO = z.infer<typeof placeDTOSchema>;
