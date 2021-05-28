import amqplib from "amqplib";
import retryable from "amqplib-retryable";
import knexfile from "../knexfile.js";
import knex from "knex";
import request from "request";
import axios from "axios";

const environment = "development";
const configuration = knexfile[environment];
const pg = knex(configuration);

async function messageHandler(msg, channel) {
  const event = msg.content.toString();
  const { customer_id, transaction_id } = msg.properties.headers;
  console.log(" [x] Received %s", event);

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
    const txn_rows = await pg("transaction").select("body", "id").where({
      id: transaction_id,
    });
    for (let i = 0; i < rows.length; i++) {
      try {
        const result = await axios({
          method: "POST",
          url: rows[i].callback_url,
          data: {
            ...txn_rows[0],
            webhook_verif_token: customer.webhook_verif_token,
          },
        });
        console.log("--axios success");
      } catch (e) {
        console.log("--axios error", e.response.status);
        throw e;
      }
    }
  }
}

// try {
//   amqp.connect("amqp://localhost", function (connectionError, connection) {
//     if (connectionError) throw connectionError;

//     connection.createChannel(function (channelError, channel) {
//       if (channelError) throw channelError;

//       const queue = "notif_queue";

//       channel.assertQueue(queue, { durable: false });
//       channel.consume(queue, messageHandler, { noAck: true });
//     });
//   });

Promise.resolve(amqplib.connect("amqp://localhost"))
  .then((conn) => conn.createChannel())
  .then((channel) =>
    retryable(channel, {
      initialDelay: 1000,
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
