import amqp from "amqplib/callback_api";
import { Transaction } from "../entity/Transaction";
import { uuid } from "uuidv4";

const getEventBody = (event) => {
  let body = {};

  switch (event) {
    case "fva_created": {
      body = {
        is_closed: false,
        status: "PENDING",
        currency: "IDR",
        owner_id: "60acbab451f94a40ba5ded41",
        external_id: "VA_fixed-1622106098",
        bank_code: "MANDIRI",
        merchant_code: "88608",
        name: "Steve Wozniak",
        account_number: "886089999255322",
        is_single_use: false,
        expiration_date: "2052-05-26T17:00:00.000Z",
      };
      break;
    }

    default:
      break;
  }

  return body;
};

export default async function ({ event, customerId }) {
  const body = getEventBody(event);

  const result = await Transaction.create({
    body,
    customer_id: customerId,
    event,
  }).save();

  console.log("result", result);

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

        channel.sendToQueue(queue, Buffer.from(event), {
          headers: {
            customer_id: customerId,
            transaction_id: result.id,
          },
        });
      });
    });
  } catch (e) {
    console.log("MQ error", e);
  }

  return result;
}
