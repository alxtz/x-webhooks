import amqp from "amqplib/callback_api";

export default async function ({ event }) {
  try {
    amqp.connect("amqp://localhost", function (error0, connection) {
      if (error0) {
        throw error0;
      }

      connection.createChannel(function (error1, channel) {
        if (error1) throw error1;

        const queue = "hello";
        const msg = "world";

        channel.assertQueue(queue, {
          durable: false,
        });

        channel.sendToQueue(queue, Buffer.from(msg));

        console.log(" [x] Sent %s", msg);
      });
    });
  } catch (e) {
    console.log("MQ error", e);
  }

  return;
}
