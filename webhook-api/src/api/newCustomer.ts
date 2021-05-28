import { uuid } from "uuidv4";
import { Customer } from "../entity/Customer";

export default async function () {
  const result = await Customer.create({
    webhook_verif_token: uuid(),
  }).save();

  return result;
}
