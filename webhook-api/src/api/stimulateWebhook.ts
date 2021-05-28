import axios from "axios";
import { uuid } from "uuidv4";
import TEST_EVENTS from "./testEvents";

export default async function ({ event, callbackUrl }) {
  try {
    const data = {
      ...TEST_EVENTS[event],
      event_id: uuid(),
      webhook_verif_token: null,
    };
    const resp = await axios({
      method: "POST",
      url: callbackUrl,
      data,
    });

    return {
      received_status: resp.status,
      sample_body: data,
    };
  } catch (e) {
    console.log("axios error", e);

    return {
      received_status: e.response.status,
    };
  }
}
