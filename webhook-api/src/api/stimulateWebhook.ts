import axios from "axios";
import TEST_EVENTS from "./testEvents";

export default async function ({ event, callbackUrl }) {
  try {
    const resp = await axios({
      method: "POST",
      url: callbackUrl,
      data: TEST_EVENTS[event],
    });

    return {
      received_status: resp.status,
      sample_body: TEST_EVENTS[event],
    };
  } catch (e) {
    console.log("axios error", e);

    return {
      received_status: e.response.status,
    };
  }
}
