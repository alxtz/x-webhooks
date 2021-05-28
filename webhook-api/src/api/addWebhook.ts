import { Webhook } from "../entity/Webhook";

export default async function ({ event, callbackUrl, customer_id }) {
  const result = await Webhook.create({
    event,
    callback_url: callbackUrl,
    customer_id,
  }).save();

  return result;
}
