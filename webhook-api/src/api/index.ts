import express from "express";
const router = express.Router();

import addWebhook from "./addWebhook";
import triggerWebhook from "./triggerWebhook";
import newCustomer from "./newCustomer";
import stimulateWebhook from "./stimulateWebhook";

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
  "/api/webhook/stimulate",
  async (
    req: {
      body: { event: Events; callback_url: string };
    },
    resp
  ) => {
    try {
      const created = await stimulateWebhook({
        event: req.body.event,
        callbackUrl: req.body.callback_url,
      });
      resp.status(200).send(created);
    } catch (e) {
      resp.status(400).send({ error: e });
    }
  }
);

router.post("/api/create_customer", async (req, resp) => {
  const result = await newCustomer();

  resp.status(200).send(result);
});

router.post("/api/customer/:id/:event", async (req, resp) => {
  try {
    const result = await triggerWebhook({
      event: req.params.event,
      customerId: Number(req.params.id),
    });
    resp.status(200).send(result);
  } catch (e) {
    resp.status(400).send({ error: e });
  }
});

export default router;
