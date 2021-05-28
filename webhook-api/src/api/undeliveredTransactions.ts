import { getConnection } from "typeorm";
import { Transaction } from "../entity/Transaction";

export default async function () {
  const result = await getConnection()
    .createQueryBuilder()
    .select(["id", "customer_id", "retry_count"])
    .from(Transaction, "transaction")
    .where("NOT transaction.retry_count = -1")
    .execute();

  return result;
}
