import { Db, ObjectId } from "mongodb";
import { DbClientSingleton } from "../getConnectedDbClient.js";
import {
  ReserveDTO,
  ReserveEntity,
  reserveDTOSchema,
  reserveSchema,
} from "./Reserve.js";

export class ReserveService {
  private readonly db: Db;

  constructor(dbClient: DbClientSingleton) {
    this.db = dbClient.db();
  }

  private getCollection() {
    return this.db.collection<ReserveEntity>("reserves");
  }

  private async createIndexes() {
    await this.getCollection().createIndex({ _placeId: 1, date: 1 });
  }

  private convertFromEntity(entity: ReserveEntity): ReserveDTO {
    const candidate: ReserveDTO = {
      id: entity._id.toHexString(),
      placeId: entity._placeId.toHexString(),
      customersQuantity: entity.customersQuantity,
      date: entity.date,
    };
    return reserveDTOSchema.parse(candidate);
  }

  async findAll(placeId: string, date: Date): Promise<ReserveDTO[]> {
    if (!ObjectId.isValid(placeId)) {
      throw new Error("invalid place id");
    }

    let results: ReserveDTO[] = [];

    const entities = this.getCollection().find({
      _placeId: { $eq: new ObjectId(placeId) },
      date: { $eq: date },
    });

    results = (await entities.toArray()).map(this.convertFromEntity);

    return results;
  }

  async create(dto: Omit<ReserveDTO, "id">): Promise<ReserveDTO> {
    await this.createIndexes();

    const _placeId = new ObjectId(dto.placeId);

    const candidate = reserveSchema.parse({
      ...dto,
      _id: new ObjectId(),
      _placeId,
    });

    const { insertedId } = await this.getCollection().insertOne(candidate);

    return this.convertFromEntity({
      ...dto,
      _id: insertedId,
      _placeId,
    });
  }
}
