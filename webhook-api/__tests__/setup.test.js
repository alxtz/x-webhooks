const frisby = require("frisby");

const HOST = "http://localhost:3001";

test("[happy] should be able to create a customer", () => {
  return frisby
    .post(`${HOST}/api/create_customer`)
    .expect("status", 200)
    .then((res) => {
      expect(res.json).toHaveProperty("webhook_verif_token");
      expect(res.json).toHaveProperty("id");
    });
});

test("[happy] should be able to register a webhook with existing customer id", () => {
  return frisby
    .post(`${HOST}/api/create_customer`)
    .expect("status", 200)
    .then((res) => {
      const customer_id = res.json.id;
      const event = "fva_paid";
      const callback_url = "http://74c813030d20.ngrok.io";

      return frisby
        .post(`${HOST}/api/webhook/add`, {
          event,
          callback_url,
          customer_id,
        })
        .expect("status", 200)
        .then((res) => {
          expect(res.json).toHaveProperty("callback_url", callback_url);
          expect(res.json).toHaveProperty("event", event);
          expect(res.json).toHaveProperty("customer_id", customer_id);
        });
    });
});
