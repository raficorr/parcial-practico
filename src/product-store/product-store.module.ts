import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/product/product.entity';
import { ProductService } from 'src/product/product.service';


@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  providers: [ProductService],
})
export class ProductModule {}
