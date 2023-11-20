/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { StoreEntity } from './store.entity';
import { StoreService } from './store.service';

import { faker } from '@faker-js/faker';

describe('StoreService', () => {
  let service: StoreService;
  let repository: Repository<StoreEntity>;
  let storesList: StoreEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [StoreService],
    }).compile();

    service = module.get<StoreService>(StoreService);
    repository = module.get<Repository<StoreEntity>>(getRepositoryToken(StoreEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    storesList = [];
    for(let i = 0; i < 5; i++){
        const store: StoreEntity = await repository.save({
        name: faker.word.noun(),
        city: faker.location.city(),
        address: faker.location.direction()})
        storesList.push(store);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all stores', async () => {
    const store: StoreEntity[] = await service.findAll();
    expect(store).not.toBeNull();
    expect(store).toHaveLength(storesList.length);
  });

  it('findOne should return a store by id', async () => {
    const storedstore: StoreEntity = storesList[0];
    const store: StoreEntity = await service.findOne(storedstore.id);
    expect(store).not.toBeNull();
    expect(store.name).toEqual(storedstore.name)
    expect(store.city).toEqual(storedstore.city)
    expect(store.address).toEqual(storedstore.address)
    
  });

  it('findOne should throw an exception for an invalid store', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The store with the given id was not found")
  });

  it('create should return a new store', async () => {
    const store: StoreEntity = {
      id: "",
      name: faker.word.noun(),
      city: faker.word.noun(),
      address: faker.word.noun(),
      product: []
    }

    const newstore: StoreEntity = await service.create(store);
    expect(newstore).not.toBeNull();

    const storedstore: StoreEntity = await repository.findOne({where: {id: newstore.id}})
    expect(storedstore).not.toBeNull();
    expect(store.name).toEqual(storedstore.name)
    expect(store.city).toEqual(storedstore.city)
    expect(store.address).toEqual(storedstore.address)
  });

  it('update should modify a store', async () => {
    const store: StoreEntity = storesList[0];
    store.name = "New name";
    

    const updatedstore: StoreEntity = await service.update(store.id, store);
    expect(updatedstore).not.toBeNull();

    const storedstore: StoreEntity = await repository.findOne({ where: { id: store.id } })
    expect(storedstore).not.toBeNull();
    expect(storedstore.name).toEqual(store.name)
    
  });

  it('update should throw an exception for an invalid store', async () => {
    let store: StoreEntity = storesList[0];
    store = {
      ...store, name: "New name"
    }
    await expect(() => service.update("0", store)).rejects.toHaveProperty("message", "The store with the given id was not found")
  });

  it('delete should remove a store', async () => {
    const store: StoreEntity = storesList[0];
    await service.delete(store.id);

    const deletedstore: StoreEntity = await repository.findOne({ where: { id: store.id } })
    expect(deletedstore).toBeNull();
  });

  it('delete should throw an exception for an invalid store', async () => {
    const store: StoreEntity = storesList[0];
    await service.delete(store.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The store with the given id was not found")
  });

});