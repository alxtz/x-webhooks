const frisby = require("frisby");

const HOST = "http://localhost:3001";

test("[happy] should be able to create a transaction correctly with fva_created", () => {
  return frisby
    .post(`${HOST}/api/create_customer`)
    .expect("status", 200)
    .then((res) => {
      const customer_id = res.json.id;
      const event = "fva_created";

      return frisby
        .post(`${HOST}/api/customer/${customer_id}/${event}`)
        .expect("status", 200)
        .then((res) => {
          expect(res.json).toHaveProperty("customer_id", customer_id);
          expect(res.json).toHaveProperty("event", event);
          expect(res.json).toHaveProperty("id");
          expect(res.json.body).toHaveProperty("is_closed");
          expect(res.json.body).toHaveProperty("currency");
        });
    });
});

test("[happy] should be able to create a transaction correctly with fva_paid", () => {
  return frisby
    .post(`${HOST}/api/create_customer`)
    .expect("status", 200)
    .then((res) => {
      const customer_id = res.json.id;
      const event = "fva_paid";

      return frisby
        .post(`${HOST}/api/customer/${customer_id}/${event}`)
        .expect("status", 200)
        .then((res) => {
          expect(res.json).toHaveProperty("customer_id", customer_id);
          expect(res.json).toHaveProperty("event", event);
          expect(res.json).toHaveProperty("id");
          expect(res.json.body).toHaveProperty("status");
          expect(res.json.body).toHaveProperty("message");
        });
    });
});
