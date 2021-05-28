const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

app.post("*", function (req, res) {
  console.log("received webhook", req.body);

  // res.sendStatus(200);
  const rndm = Math.random();
  console.log("rndm", rndm);

  if (rndm < 0.5) {
    res.sendStatus(404);
  } else {
    res.sendStatus(200);
  }
});

const i = app.listen(0);
console.log("test-server running at", i.address().port);
