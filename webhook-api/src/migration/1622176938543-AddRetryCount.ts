import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddRetryCount1622176938543 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "transaction",
      new TableColumn({
        name: "retry_count",
        type: "int",
        default: 0,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("transaction", "retry_count");
  }
}
