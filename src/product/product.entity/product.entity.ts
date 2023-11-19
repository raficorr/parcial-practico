import { StoreEntity } from 'src/store/store.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  price: string;

  @Column()
  Type: string;

  @OneToMany(() => StoreEntity, (store) => store.product)
  store: StoreEntity[];
}
