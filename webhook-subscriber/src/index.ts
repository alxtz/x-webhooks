import amqplib from "amqplib";
import retryable from "amqplib-retryable";
import knexfile from "../knexfile.js";
import knex from "knex";
import axios from "axios";
import sha1 from "js-sha1";

const environment = "development";
const configuration = knexfile[environment];
const pg = knex(configuration);

async function messageHandler(msg, channel) {
  const event = msg.content.toString();
  const { customer_id, transaction_id } = msg.properties.headers;

  const [customer] = await pg("customer").select("*").where({
    id: customer_id,
  });

  const rows = await pg("webhook")
    .select("callback_url", "event", "customer_id")
    .where({
      event,
      customer_id,
    });

  if (rows.length > 0) {
    const txn_rows = await pg("transaction")
      .select("body", "id", "retry_count")
      .where({
        id: transaction_id,
      });

    for (let i = 0; i < rows.length; i++) {
      const originalCount = txn_rows[0].retry_count;

      if (originalCount === -1) {
        return;
      } else {
        console.log(" [x] Received %s", event);
      }

      console.log("   retried", originalCount);

      console.log("txn_id", transaction_id);

      try {
        const hash = sha1.create();
        hash.update(String(transaction_id));

        const result = await axios({
          method: "POST",
          url: rows[i].callback_url,
          data: {
            ...txn_rows[0],
            webhook_verif_token: customer.webhook_verif_token,
            event_id: hash.hex(),
          },
        });
        console.log("   axios success");

        await pg("transaction")
          .where({
            id: transaction_id,
          })
          .update({
            retry_count: -1,
          });

        msg.ack();
      } catch (e) {
        console.log("   axios error", e.response.status);

        await pg("transaction")
          .where({
            id: transaction_id,
          })
          .update({
            retry_count: originalCount + 1,
          });

        throw e;
      }
    }
  }
}

Promise.resolve(amqplib.connect("amqp://localhost"))
  .then((conn) => conn.createChannel())
  .then((channel) =>
    retryable(channel, {
      initialDelay: 4000,
      maxRetries: 5,
      separator: ".",
    })
  )
  .then((channel) => {
    const queue = "notif_queue";
    channel.assertQueue(queue, { durable: false });
    return channel.consume("notif_queue", messageHandler);
  })
  .catch((err) => {
    console.error("Failed to process", err);
  });
