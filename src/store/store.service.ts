import { Injectable } from '@nestjs/common';
import { StoreEntity } from './store.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BussinessError,
  BussinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(StoreEntity)
    private readonly storeRepository: Repository<StoreEntity>,
  ) {}

  async findAll(): Promise<StoreEntity[]> {
    return await this.storeRepository.find({ relations: ['product'] });
  }

  async findOne(id: string): Promise<StoreEntity> {
    const store: StoreEntity = await this.storeRepository.findOne({
      where: { id },
      relations: ['product'],
    });
    if (!store)
      throw new BussinessLogicException(
        'The store with the given id was not found',
        BussinessError.NOT_FOUND,
      );

    return store;
  }

  async create(store: StoreEntity): Promise<StoreEntity> {
    return await this.storeRepository.save(store);
  }

  async update(id: string, store: StoreEntity): Promise<StoreEntity> {
    const persistedstore: StoreEntity = await this.storeRepository.findOne({
      where: { id },
    });
    if (!persistedstore)
      throw new BussinessLogicException(
        'The store with the given id was not found',
        BussinessError.NOT_FOUND,
      );

    store.id = id;

    return await this.storeRepository.save(store);
  }

  async delete(id: string) {
    const store: StoreEntity = await this.storeRepository.findOne({
      where: { id },
    });
    if (!store)
      throw new BussinessLogicException(
        'The store with the given id was not found',
        BussinessError.NOT_FOUND,
      );

    await this.storeRepository.remove(store);
  }
}
