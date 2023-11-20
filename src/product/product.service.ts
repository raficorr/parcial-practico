import { Injectable } from '@nestjs/common';
import { ProductEntity } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BussinessError,
  BussinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async findAll(): Promise<ProductEntity[]> {
    return await this.productRepository.find({ relations: ['store'] });
  }

  async findOne(id: string): Promise<ProductEntity> {
    const product: ProductEntity = await this.productRepository.findOne({
      where: { id },
      relations: ['store'],
    });
    if (!product)
      throw new BussinessLogicException(
        'The product with the given id was not found',
        BussinessError.NOT_FOUND,
      );

    return product;
  }

  async create(product: ProductEntity): Promise<ProductEntity> {
    return await this.productRepository.save(product);
  }

  async update(id: string, product: ProductEntity): Promise<ProductEntity> {
    const persistedProduct: ProductEntity =
      await this.productRepository.findOne({ where: { id } });
    if (!persistedProduct)
      throw new BussinessLogicException(
        'The product with the given id was not found',
        BussinessError.NOT_FOUND,
      );

    product.id = id;

    return await this.productRepository.save(product);
  }

  async delete(id: string) {
    const product: ProductEntity = await this.productRepository.findOne({
      where: { id },
    });
    if (!product)
      throw new BussinessLogicException(
        'The product with the given id was not found',
        BussinessError.NOT_FOUND,
      );

    await this.productRepository.remove(product);
  }
}
