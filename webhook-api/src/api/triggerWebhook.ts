import amqp from "amqplib/callback_api";

export default async function ({ event }) {
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

        channel.sendToQueue(queue, Buffer.from(event));
      });
    });
  } catch (e) {
    console.log("MQ error", e);
  }

  return;
}
