import { Webhook } from "../entity/Webhook";

export default async function ({ event, callbackUrl }) {
  const result = await Webhook.create({
    event,
    callback_url: callbackUrl,
  }).save();

  return result;
}
