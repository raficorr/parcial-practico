/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreEntity } from 'src/store/store.entity';
import { ProductEntity } from 'src/product/product.entity';
import { Repository } from 'typeorm';
import { BussinessError, BussinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ProductStoreService {
   constructor(
       @InjectRepository(ProductEntity)
       private readonly ProductRepository: Repository<ProductEntity>,
   
       @InjectRepository(StoreEntity)
       private readonly storeRepository: Repository<StoreEntity>
   ) {}

   async addStoreToProduct(ProductId: string, StoreId: string): Promise<ProductEntity> {
       const store: StoreEntity = await this.storeRepository.findOne({where: {id: StoreId}});
       if (!store)
         throw new BussinessLogicException("The store with the given id was not found", BussinessError.NOT_FOUND);
     
       const product: ProductEntity = await this.ProductRepository.findOne({where: {id: ProductId}, relations: ["store", "product"]})
       if (!product)
         throw new BussinessLogicException("The product with the given id was not found", BussinessError.NOT_FOUND);
   
       product.store = [...product.store, store];
       return await this.ProductRepository.save(product);
     }
   
   async findStoresFromProduct(ProductId: string, StoreId: string): Promise<StoreEntity> {
       const store: StoreEntity = await this.storeRepository.findOne({where: {id: StoreId}});
       if (!store)
         throw new BussinessLogicException("The store with the given id was not found", BussinessError.NOT_FOUND)
      
       const product: ProductEntity = await this.ProductRepository.findOne({where: {id: ProductId}, relations: ["store"]});
       if (!product)
         throw new BussinessLogicException("The product with the given id was not found", BussinessError.NOT_FOUND)
  
       const productStore: StoreEntity = product.store.find(e => e.id === store.id);
  
       if (!productStore)
         throw new BussinessLogicException("The store with the given id is not associated to the product", BussinessError.PRECONDITION_FAILED)
  
       return productStore;
   }
   
   async findStoreFromProduct(ProductId: string): Promise<StoreEntity[]> {
       const product: ProductEntity = await this.ProductRepository.findOne({where: {id: ProductId}, relations: ["store"]});
       if (!product)
         throw new BussinessLogicException("The product with the given id was not found", BussinessError.NOT_FOUND)
      
       return product.store;
   }
   
   async updateStoreFromProduct(ProductId: string, store: StoreEntity[]): Promise<ProductEntity> {
       const product: ProductEntity = await this.ProductRepository.findOne({where: {id: ProductId}, relations: ["store"]});
   
       if (!product)
         throw new BussinessLogicException("The product with the given id was not found", BussinessError.NOT_FOUND)
   
       for (let i = 0; i < store.length; i++) {
         const currenstore: StoreEntity = await this.storeRepository.findOne({where: {id: store[i].id}});
         if (!currenstore)
           throw new BussinessLogicException("The store with the given id was not found", BussinessError.NOT_FOUND)
       }
   
       product.store = store;
       return await this.ProductRepository.save(product);
     }
   
   async deleteStoreFromProduct(ProductId: string, StoreId: string){
       const store: StoreEntity = await this.storeRepository.findOne({where: {id: StoreId}});
       if (!store)
         throw new BussinessLogicException("The store with the given id was not found", BussinessError.NOT_FOUND)
   
       const product: ProductEntity = await this.ProductRepository.findOne({where: {id: ProductId}, relations: ["store"]});
       if (!product)
         throw new BussinessLogicException("The product with the given id was not found", BussinessError.NOT_FOUND)
   
       const productStore: StoreEntity = product.store.find(e => e.id === store.id);
   
       if (!productStore)
           throw new BussinessLogicException("The store with the given id is not associated to the museum", BussinessError.PRECONDITION_FAILED)

       product.store = product.store.filter(e => e.id !== StoreId);
       await this.ProductRepository.save(product);
   }  
}