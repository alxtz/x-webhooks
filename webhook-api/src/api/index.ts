import express from "express";
const router = express.Router();

import addWebhook from "./addWebhook";
import triggerWebhook from "./triggerWebhook";
import newCustomer from "./newCustomer";

type Events =
  | "fva_created"
  | "fva_paid"
  | "disb_created"
  | "batch_disb_created";

router.post(
  "/api/webhook/add",
  async (
    req: {
      body: { event: Events; callback_url: string; customer_id: number };
    },
    resp
  ) => {
    try {
      const created = await addWebhook({
        event: req.body.event,
        callbackUrl: req.body.callback_url,
        customer_id: req.body.customer_id,
      });
      resp.status(200).send(created);
    } catch (e) {
      resp.status(400).send({ error: e });
    }
  }
);

router.post(
  "/api/webhook/trigger",
  async (
    req: {
      body: { event: Events };
    },
    resp
  ) => {
    triggerWebhook({ event: req.body.event });
    resp.status(200).send({ foo: "triggered" });
  }
);

router.post("/api/customer/new", async (req, resp) => {
  const result = await newCustomer();

  resp.status(200).send(result);
});

export default router;
