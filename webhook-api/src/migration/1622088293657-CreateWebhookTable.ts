import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateWebhookTable1622088293657 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "webhook",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "callback_url",
            type: "varchar",
          },
          {
            name: "event",
            type: "varchar",
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
