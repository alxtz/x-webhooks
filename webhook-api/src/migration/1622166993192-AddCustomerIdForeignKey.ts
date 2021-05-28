import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class AddCustomerIdForeignKey1622166993192
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "webhook",
      new TableColumn({
        name: "customer_id",
        type: "int",
      })
    );

    await queryRunner.createForeignKey(
      "webhook",
      new TableForeignKey({
        columnNames: ["customer_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "customer",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("webhook");
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("customer_id") !== -1
    );
    await queryRunner.dropForeignKey("webhook", foreignKey);

    await queryRunner.dropColumn("webhook", "customer_id");
  }
}
