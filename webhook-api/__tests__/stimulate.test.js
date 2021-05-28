const frisby = require("frisby");

const HOST = "http://localhost:3001";

test("[happy] should be able to stimulate a webhook call", () => {
  return frisby
    .post(`${HOST}/api/webhook/stimulate`, {
      event: "fva_paid",
      callback_url: "http://www.google.com",
    })
    .expect("status", 200)
    .then((res) => {
      expect(res.json).toHaveProperty("received_status");
    });
});

test("[sad] should be able to show 404 status", () => {
  return frisby
    .post(`${HOST}/api/webhook/stimulate`, {
      event: "fva_paid",
      callback_url: "http://non-exist.ngrok.io",
    })
    .expect("status", 200)
    .then((res) => {
      expect(res.json).toHaveProperty("received_status", 404);
    });
});
