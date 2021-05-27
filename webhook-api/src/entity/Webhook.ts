import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class Webhook extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  callback_url: string;

  @Column()
  event: string;
}
