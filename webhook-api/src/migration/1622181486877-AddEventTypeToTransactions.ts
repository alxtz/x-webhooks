import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddEventTypeToTransactions1622181486877
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "transaction",
      new TableColumn({
        name: "event",
        type: "varchar",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("transaction", "event");
  }
}
