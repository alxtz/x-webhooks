import express from "express";
const router = express.Router();

import addWebhook from "./addWebhook";
import triggerWebhook from "./triggerWebhook";

type Events = "va_created" | "va_paid" | "disb_sent" | "batch_disb_sent";

router.post(
  "/api/webhook/add",
  async (
    req: {
      body: { event: Events; callback_url: string };
    },
    resp
  ) => {
    try {
      const created = await addWebhook({
        event: req.body.event,
        callbackUrl: req.body.callback_url,
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

export default router;
