import amqp from "amqplib/callback_api";
import { getConnection } from "typeorm";
import { Transaction } from "../entity/Transaction";

export default async function (transactionId) {
  await getConnection()
    .createQueryBuilder()
    .update(Transaction)
    .set({ retry_count: 0 })
    .where("transaction.id = :id", { id: transactionId })
    .execute();

  const [txn] = await getConnection()
    .createQueryBuilder()
    .select("*")
    .from(Transaction, "transaction")
    .where("transaction.id = :id", { id: transactionId })
    .execute();

  try {
    amqp.connect("amqp://localhost", function (error0, connection) {
      if (error0) {
        throw error0;
      }

      connection.createChannel(function (error1, channel) {
        if (error1) throw error1;

        const queue = "notif_queue";

        channel.assertQueue(queue, {
          durable: false,
        });

        channel.sendToQueue(queue, Buffer.from(txn.event), {
          headers: {
            customer_id: txn.customer_id,
            transaction_id: txn.id,
          },
        });
      });
    });
  } catch (e) {
    console.log("MQ error", e);
  }

  return txn;
}
