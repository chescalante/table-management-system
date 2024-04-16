import { Db, ObjectId } from "mongodb";
import { PAGE_SIZE } from "../constants.js";
import { DbClientSingleton } from "../getConnectedDbClient.js";
import { PaginatedResults } from "../types.js";
import { PlaceDTO, PlaceEntity, placeDTOSchema, placeSchema } from "./Place.js";

export class PlaceService {
  private readonly db: Db;

  constructor(dbClient: DbClientSingleton) {
    this.db = dbClient.db();
  }

  private getCollection() {
    return this.db.collection<PlaceEntity>("places");
  }

  private async createIndexes() {}

  private convertFromEntity(entity: PlaceEntity): PlaceDTO {
    const candidate: PlaceDTO = {
      id: entity._id.toHexString(),
      name: entity.name,
      tables: entity.tables,
    };
    return placeDTOSchema.parse(candidate);
  }

  async find(id: string): Promise<PlaceDTO | null> {
    if (!ObjectId.isValid(id)) return null;

    const entity = await this.getCollection().findOne({
      _id: { $eq: new ObjectId(id) },
    });

    return entity ? this.convertFromEntity(entity) : null;
  }

  async findMany(lastID?: string): Promise<PaginatedResults<PlaceDTO>> {
    let filterLastId = {};

    if (lastID && ObjectId.isValid(lastID)) {
      filterLastId = { _id: { $gt: new ObjectId(lastID) } };
    }

    const total = await this.getCollection().countDocuments();

    let results: PlaceDTO[] = [];

    if (total > 0) {
      const entities = this.getCollection()
        .find({
          ...filterLastId,
        })
        .sort({ _id: 1 })
        .limit(PAGE_SIZE);

      results = (await entities.toArray()).map(this.convertFromEntity);
    }

    const lastResult =
      results.length > 0 ? results[results.length - 1] : undefined;

    return {
      results,
      total,
      lastResult,
    };
  }

  async create(dto: Omit<PlaceDTO, "id">): Promise<PlaceDTO> {
    await this.createIndexes();

    const candidate = placeSchema.parse({
      ...dto,
      _id: new ObjectId(),
    });

    const { insertedId } = await this.getCollection().insertOne(candidate);

    return this.convertFromEntity({
      ...dto,
      _id: insertedId,
    });
  }

  async initialize() {
    this.create({ name: "The Italian Corner", tables: [2, 2, 4, 4, 6] });
    for (let index = 0; index < 100; index++) {
      this.create({ name: `Place ${index + 1}`, tables: [2, 2, 4, 4, 6] });
    }
  }
}
