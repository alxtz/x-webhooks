const TEST_EVENTS = {
  fva_created: {
    is_closed: false,
    status: "PENDING",
    currency: "IDR",
    owner_id: "60acbab451f94a40ba5ded41",
    external_id: "VA_fixed-1622106098",
    bank_code: "MANDIRI",
    merchant_code: "88608",
    name: "Steve Wozniak",
    account_number: "886089999255322",
    is_single_use: false,
    expiration_date: "2052-05-26T17:00:00.000Z",
    id: "60af5ff212573e4719efc85d",
  },
  fva_paid: {
    status: "COMPLETED",
    message:
      "Payment for the Fixed VA with external id VA_fixed-1622106098 is currently being processed. Please ensure that you have set a callback URL for VA payments via Dashboard Settings and contact us if you do not receive a VA payment callback within the next 5 mins.",
  },
  disb_created: {
    status: "PENDING",
    user_id: "60acbab451f94a40ba5ded41",
    external_id: "disb-1622106241",
    amount: 15000,
    bank_code: "BCA",
    account_holder_name: "Joe",
    disbursement_description: "Disbursement from Postman",
    id: "60af608195de440018bfbace",
  },
  batch_disb_created: {
    status: "UPLOADING",
    reference: "disb_batch-1622106291",
    total_uploaded_amount: 50000,
    total_uploaded_count: 2,
    created: "2021-05-27T09:04:52.452Z",
    id: "60af60b44f705c0017912a57",
  },
} as const;

export default TEST_EVENTS;
