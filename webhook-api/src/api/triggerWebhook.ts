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

    case "fva_paid": {
      body = {
        status: "COMPLETED",
        message:
          "Payment for the Fixed VA with external id VA_fixed-1622106098 is currently being processed. Please ensure that you have set a callback URL for VA payments via Dashboard Settings and contact us if you do not receive a VA payment callback within the next 5 mins.",
      };
      break;
    }

    case "disb_created": {
      body = {
        status: "PENDING",
        user_id: "60acbab451f94a40ba5ded41",
        external_id: "disb-1622106241",
        amount: 15000,
        bank_code: "BCA",
        account_holder_name: "Joe",
        disbursement_description: "Disbursement from Postman",
        id: "60af608195de440018bfbace",
      };
      break;
    }

    case "batch_disb_created": {
      body = {
        status: "UPLOADING",
        reference: "disb_batch-1622106291",
        total_uploaded_amount: 50000,
        total_uploaded_count: 2,
        created: "2021-05-27T09:04:52.452Z",
        id: "60af60b44f705c0017912a57",
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
