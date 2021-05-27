import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class WebhookLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  webhook_id: number;
}
