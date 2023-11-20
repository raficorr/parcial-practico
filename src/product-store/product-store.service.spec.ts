/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { StoreEntity } from 'src/store/store.entity';
import { Repository } from 'typeorm';
import { ProductEntity } from 'src/product/product.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ProductStoreService } from './product-store.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ProductStoreService', () =>{
  let service: ProductStoreService;
  let ProductRepository: Repository<ProductEntity>;
  let storeRepository: Repository<ProductEntity>;
  let product: ProductEntity;
  let storeList : ProductEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductStoreService],
    }).compile();

    service = module.get<ProductStoreService>(ProductStoreService);
    ProductRepository = module.get<Repository<ProductEntity>>(getRepositoryToken(ProductEntity));
    storeRepository = module.get<Repository<ProductEntity>>(getRepositoryToken(ProductEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    storeRepository.clear();
    ProductRepository.clear();

    storesList = [];
    for(let i = 0; i < 5; i++){
        const store: ProductEntity = await storeRepository.save({
        name: faker.word.noun(),
        city: faker.location.city(),
        address: faker.location.direction()})
        })
        storesList.push(store);
      }
    product = await ProductRepository.save({
      name: faker.word.noun(),
      price: faker.word.noun(),
      type: faker.word.noun(),
      stores: storeList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addstoreproduct should add an store to a product', async () => {
    const newstore: ProductEntity = await storeRepository.save({
      name: faker.word.noun(),
        city: faker.location.city(),
        address: faker.location.direction()})
    });

    const newproduct: ProductEntity = await ProductRepository.save({
      name: faker.word.noun(),
      price: faker.word.noun(),
      type: faker.word.noun(),
    })

    const result: ProductEntity = await service.addstoreproduct(newproduct.id, newstore.id);
    
    expect(result.stores.length).toBe(1);
    expect(result.stores[0]).not.toBeNull();
    expect(result.stores[0].name).toBe(newstore.name)
    expect(result.stores[0].year).toBe(newstore.year)
    expect(result.stores[0].description).toBe(newstore.description)
    expect(result.stores[0].type).toBe(newstore.type)
    expect(result.stores[0].mainImage).toBe(newstore.mainImage)
  });

  it('addstoreproduct should thrown exception for an invalid store', async () => {
    const newproduct: ProductEntity = await ProductRepository.save({
      name: faker.word.noun(),
      price: faker.word.noun(),
      type: faker.word.noun(),
    })

    await expect(() => service.addstoreproduct(newproduct.id, "0")).rejects.toHaveProperty("message", "The store with the given id was not found");
  });

  it('addstoreproduct should throw an exception for an invalid product', async () => {
    const newstore: ProductEntity = await storeRepository.save({
      name: faker.word.noun(),
        city: faker.location.city(),
        address: faker.location.direction()})
    });

    await expect(() => service.addstoreproduct("0", newstore.id)).rejects.toHaveProperty("message", "The product with the given id was not found");
  });

  it('findstoreByproductIdstoreId should return store by product', async () => {
    const store: ProductEntity = storeList[0];
    const storedstore: ProductEntity = await service.findstoreByproductIdstoreId(product.id, store.id, )
    expect(storedstore).not.toBeNull();
    expect(storedstore.name).toBe(store.name);
    expect(storedstore.year).toBe(store.year);
    expect(storedstore.description).toBe(store.description);
    expect(storedstore.type).toBe(store.type);
    expect(storedstore.mainImage).toBe(store.mainImage);
  });

  it('findstoreByproductIdstoreId should throw an exception for an invalid store', async () => {
    await expect(()=> service.findstoreByproductIdstoreId(product.id, "0")).rejects.toHaveProperty("message", "The store with the given id was not found"); 
  });

  it('findstoreByproductIdstoreId should throw an exception for an invalid product', async () => {
    const store: ProductEntity = storeList[0]; 
    await expect(()=> service.findstoreByproductIdstoreId("0", store.id)).rejects.toHaveProperty("message", "The product with the given id was not found"); 
  });

  it('findstoreByproductIdstoreId should throw an exception for an store not associated to the product', async () => {
    const newstore: ProductEntity = await storeRepository.save({
      name: faker.word.noun(),
        city: faker.location.city(),
        address: faker.location.direction()})
    });

    await expect(()=> service.findstoreByproductIdstoreId(product.id, newstore.id)).rejects.toHaveProperty("message", "The store with the given id is not associated to the product"); 
  });

  it('findstoresByproductId should return stores by product', async ()=>{
    const stores: ProductEntity[] = await service.findstoresByproductId(product.id);
    expect(stores.length).toBe(5)
  });

  it('findstoresByproductId should throw an exception for an invalid product', async () => {
    await expect(()=> service.findstoresByproductId("0")).rejects.toHaveProperty("message", "The product with the given id was not found"); 
  });

  it('associatestoresproduct should update stores list for a product', async () => {
    const newstore: ProductEntity = await storeRepository.save({
      name: faker.word.noun(),
        city: faker.location.city(),
        address: faker.location.direction()})
    });

    const updatedproduct: ProductEntity = await service.associatestoresproduct(product.id, [newstore]);
    expect(updatedproduct.stores.length).toBe(1);

    expect(updatedproduct.stores[0].name).toBe(newstore.name);
    expect(updatedproduct.stores[0].year).toBe(newstore.year);
    expect(updatedproduct.stores[0].description).toBe(newstore.description);
    expect(updatedproduct.stores[0].type).toBe(newstore.type);
    expect(updatedproduct.stores[0].mainImage).toBe(newstore.mainImage);
  });

  it('associatestoresproduct should throw an exception for an invalid product', async () => {
    const newstore: ProductEntity = await storeRepository.save({
      name: faker.word.noun(),
        city: faker.location.city(),
        address: faker.location.direction()})
    });

    await expect(()=> service.associatestoresproduct("0", [newstore])).rejects.toHaveProperty("message", "The product with the given id was not found"); 
  });

  it('associatestoresproduct should throw an exception for an invalid store', async () => {
    const newstore: ProductEntity = storeList[0];
    newstore.id = "0";

    await expect(()=> service.associatestoresproduct(product.id, [newstore])).rejects.toHaveProperty("message", "The store with the given id was not found"); 
  });

  it('deletestoreToproduct should remove an store from a product', async () => {
    const store: ProductEntity = storeList[0];
    
    await service.deletestoreproduct(product.id, store.id);

    const storedproduct: ProductEntity = await ProductRepository.findOne({where: {id: product.id}, relations: ["stores"]});
    const deletedstore: ProductEntity = storedproduct.stores.find(a => a.id === store.id);

    expect(deletedstore).toBeUndefined();

  });

  it('deletestoreToproduct should thrown an exception for an invalid store', async () => {
    await expect(()=> service.deletestoreproduct(product.id, "0")).rejects.toHaveProperty("message", "The store with the given id was not found"); 
  });

  it('deletestoreToproduct should thrown an exception for an invalid product', async () => {
    const store: ProductEntity = storeList[0];
    await expect(()=> service.deletestoreproduct("0", store.id)).rejects.toHaveProperty("message", "The product with the given id was not found"); 
  });

  it('deletestoreToproduct should thrown an exception for an non asocciated store', async () => {
    const newstore: ProductEntity = await storeRepository.save({
      name: faker.word.noun(),
        city: faker.location.city(),
        address: faker.location.direction()})
    });

    await expect(()=> service.deletestoreproduct(product.id, newstore.id)).rejects.toHaveProperty("message", "The store with the given id is not associated to the product"); 
  }); 

});