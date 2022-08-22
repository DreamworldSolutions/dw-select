export const list = ["PDF", "EXCEL", "CUSTOM"];

export const groupList = [
  {
    name: "Steve",
    type: "CONTACT",
  },
  {
    name: "John",
    type: "CONTACT",
  },
  {
    name: "SBI Bank",
    type: "BANK_ACCOUNT",
  },

  {
    name: "Capital Gain",
    type: "ACCOUNT",
  }
];

export const groups = [
  {
    name: "BANK_ACCOUNT",
    label: "Bank Accounts",
    collapsible: false,
    collapsed: false,
  },
  {
    name: "CONTACT",
    label: "Contacts",
    collapsible: false,
    collapsed: false,
  },
  {
    name: "ACCOUNT",
    label: "Custom Accounts",
    collapsible: false,
    collapsed: false,
  },
];

export const accounts = [
  {
      "type": "BANK_ACCOUNT",
      "traceId": "b43e112182952b53",
      "spanId": "9dd2fb4cb8337861",
      "name": "Cash on hand",
      "accType": "CASH",
      "openingBalance": 0,
      "creditLimit": 0,
      "currency": "",
      "isClosed": false,
      "auditInfo": {
          "createdAt": 1651036674580,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674580,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "_id": "b64c5eb884052bbc0a23de45d533a5b5",
      "_rev": "1-5da624bde8a510bbd9f3f724531904c7"
  },
  {
      "type": "BANK_ACCOUNT",
      "traceId": "b43e112182952b53",
      "spanId": "9dd2fb4cb8337861",
      "name": "My bank account",
      "accType": "BANK",
      "openingBalance": 0,
      "creditLimit": 0,
      "currency": "",
      "isClosed": false,
      "auditInfo": {
          "createdAt": 1651036674580,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674580,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "_id": "b64c5eb884052bbc0a23de45d533b21e",
      "_rev": "1-346b32953676c3fec4a8bafd0487c84f"
  },
  {
      "type": "BANK_ACCOUNT",
      "traceId": "b43e112182952b53",
      "spanId": "9dd2fb4cb8337861",
      "name": "My credit card",
      "accType": "CREDIT_CARD",
      "openingBalance": 0,
      "creditLimit": 0,
      "currency": "",
      "isClosed": false,
      "auditInfo": {
          "createdAt": 1651036674580,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674580,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "_id": "b64c5eb884052bbc0a23de45d533b770",
      "_rev": "1-dcdaa2d2766ed6cf0fbebaaeb716ccea"
  },
  {
      "pan": "AABCA2957L",
      "openingBalanceForexRate": null,
      "address": {
          "country": {
              "code": "IN",
              "name": "India"
          },
          "state": "Gujarat",
          "address1": "804, SHIKHAR",
          "address2": "MITHAKHALI SIX ROAD NR ADANI HOUSE NAVRANGPURA",
          "pinCode": "380009",
          "city": "Ahmedabad"
      },
      "shippingAddress": {
          "country": {
              "code": "IN",
              "name": "India"
          },
          "state": "Gujarat",
          "address1": "804, SHIKHAR",
          "address2": "MITHAKHALI SIX ROAD NR ADANI HOUSE NAVRANGPURA",
          "pinCode": "380009",
          "city": "Ahmedabad",
          "sameAsBillingAddress": true
      },
      "auditInfo": {
          "createdAt": 1654604250652,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1654604250652,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "type": "CONTACT",
      "gstin": "24AABCA2957L2ZL",
      "name": "ADANI POWER LIMITED",
      "nameOnInvoice": "ADANI POWER LIMITED",
      "currency": null,
      "foreignOpeningBalance": null,
      "openingBalance": 0,
      "traceId": "ff166800ff166800",
      "spanId": "ff166800ff166800",
      "_id": "20c6b430-a7b6-4dc0-9d7f-9d4fbd68c9d7",
      "_rev": "1-2cbf1fb301cbb1314d5d8ac7c4279f6c"
  },
  {
      "pan": null,
      "openingBalanceForexRate": 6191473,
      "address": {
          "country": {
              "name": "Canada",
              "code": "CA"
          },
          "city": ""
      },
      "shippingAddress": {
          "country": {
              "name": "Canada",
              "code": "CA"
          },
          "city": "",
          "sameAsBillingAddress": true
      },
      "auditInfo": {
          "createdAt": 1654521240302,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1654521275465,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "type": "CONTACT",
      "gstin": "",
      "name": "Foreign Contact",
      "nameOnInvoice": "Foreign Contact",
      "currency": "CAD",
      "foreignOpeningBalance": 500000,
      "openingBalance": 30957365,
      "traceId": "a0be1500a0be1500",
      "spanId": "a0be1500a0be1500",
      "contactNo": "9429829884",
      "_id": "666ae117-c5d1-4ec2-ba41-3bd8677a3560",
      "_rev": "3-c35e22490a4e71937df738411862c30f"
  },
  {
      "pan": "AAKFH4973K",
      "address": {
          "country": {
              "code": "IN",
              "name": "India"
          },
          "state": "Gujarat",
          "address1": "OFFICE NO.414,, ROYAL SQUARE",
          "address2": "UTRAN SURAT",
          "pinCode": "394105",
          "city": "Surat"
      },
      "shippingAddress": {
          "country": {
              "code": "IN",
              "name": "India"
          },
          "state": "Gujarat",
          "address1": "OFFICE NO.414,, ROYAL SQUARE",
          "address2": "UTRAN SURAT",
          "pinCode": "394105",
          "city": "Surat",
          "sameAsBillingAddress": true
      },
      "openingBalanceForexRate": null,
      "auditInfo": {
          "createdAt": 1654671165727,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1654671165727,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "type": "CONTACT",
      "gstin": "24AAKFH4973K1ZY",
      "name": "HISAB TECHNOLOGIES LLP",
      "nameOnInvoice": "HISAB TECHNOLOGIES LLP",
      "currency": null,
      "foreignOpeningBalance": null,
      "openingBalance": 0,
      "traceId": "0f8db0000f8db000",
      "spanId": "0f8db0000f8db000",
      "_id": "5ae5b712-b28d-4a33-9868-cf4a0edefea5",
      "_rev": "1-f932ba46d6c6d53871bc81d7529af03d"
  },
  {
      "pan": "AGYPD0962C",
      "address": {
          "country": {
              "name": "India",
              "code": "IN"
          },
          "state": "Jharkhand",
          "address1": "VARA, DHONI FARM HOUSE, ",
          "address2": "RING ROAD VILL.SIMALIYA,P.S.-RATU",
          "pinCode": "835222",
          "city": "Ranchi"
      },
      "shippingAddress": {
          "country": {
              "name": "India",
              "code": "IN"
          },
          "state": "Jharkhand",
          "address1": "VARA, DHONI FARM HOUSE, ",
          "address2": "RING ROAD VILL.SIMALIYA,P.S.-RATU",
          "pinCode": "835222",
          "city": "Ranchi",
          "sameAsBillingAddress": true
      },
      "openingBalanceForexRate": null,
      "auditInfo": {
          "createdAt": 1654669763664,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1654669763664,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "type": "CONTACT",
      "gstin": "20AGYPD0962C1ZR",
      "name": "MAHENDRA SINGH DHONI",
      "nameOnInvoice": "MAHENDRA SINGH DHONI",
      "currency": null,
      "foreignOpeningBalance": null,
      "openingBalance": 0,
      "traceId": "0acd74000acd7400",
      "spanId": "0acd74000acd7400",
      "_id": "61ad0a86-3f5f-41be-bfe2-356b12a3eeac",
      "_rev": "1-a9e48f31278aec4fc5c9c38f1015e8a3"
  },
  {
      "pan": "AABCI6363G",
      "openingBalanceForexRate": null,
      "address": {
          "country": {
              "code": "IN",
              "name": "India"
          },
          "state": "Maharashtra",
          "address1": "RELIANCE CORPORATE PARK, RCP",
          "address2": "5 TTC Industrial Area, Ghansoli Thane Belapur Road , Navi Mumbai",
          "pinCode": "400701",
          "city": "Thane"
      },
      "shippingAddress": {
          "country": {
              "code": "IN",
              "name": "India"
          },
          "state": "Maharashtra",
          "address1": "RELIANCE CORPORATE PARK, RCP",
          "address2": "5 TTC Industrial Area, Ghansoli Thane Belapur Road , Navi Mumbai",
          "pinCode": "400701",
          "city": "Thane",
          "sameAsBillingAddress": true
      },
      "auditInfo": {
          "createdAt": 1654604109903,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1654604109903,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "type": "CONTACT",
      "gstin": "27AABCI6363G1ZJ",
      "name": "RELIANCE JIO INFOCOMM LIMITED",
      "nameOnInvoice": "RELIANCE JIO INFOCOMM LIMITED",
      "currency": null,
      "foreignOpeningBalance": null,
      "openingBalance": 0,
      "traceId": "b2285c00b2285c00",
      "spanId": "b2285c00b2285c00",
      "_id": "e8a1f8a2-f030-4f81-a595-bd36e2ee0688",
      "_rev": "1-1b6a28067c681a7010e7bda3d4d3cfd9"
  },
  {
      "pan": "EYKPB",
      "openingBalanceForexRate": null,
      "auditInfo": {
          "createdAt": 1651124309910,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1654498453283,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "type": "CONTACT",
      "gstin": "",
      "address": {
          "country": {
              "name": "India",
              "code": "IN"
          }
      },
      "shippingAddress": {
          "country": {
              "name": "India",
              "code": "IN"
          },
          "sameAsBillingAddress": true
      },
      "name": "Sahil",
      "nameOnInvoice": "Sahil",
      "currency": null,
      "foreignOpeningBalance": null,
      "openingBalance": 500000,
      "traceId": "1210bc001210bc00",
      "spanId": "1210bc001210bc00",
      "contactNo": "7984307562",
      "_id": "58a40b9b-641c-469f-bb3b-a76fb7c7fc6a",
      "_rev": "10-86515dc8783ea55bf1b11c195decf1c4"
  },
  {
      "pan": null,
      "openingBalanceForexRate": null,
      "auditInfo": {
          "createdAt": 1651833975950,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651833975950,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "type": "CONTACT",
      "gstin": "",
      "address": {
          "country": {
              "code": "IN",
              "name": "India"
          }
      },
      "shippingAddress": {
          "country": {
              "code": "IN",
              "name": "India"
          },
          "sameAsBillingAddress": true
      },
      "name": "Sahil-1",
      "nameOnInvoice": "Sahil-1",
      "currency": null,
      "foreignOpeningBalance": null,
      "openingBalance": 0,
      "traceId": "be487800be487800",
      "spanId": "be487800be487800",
      "contactNo": "7984307562",
      "_id": "e54ba9aa-0c49-417b-8e21-2c6e108d91b4",
      "_rev": "2-0551f9eae6a73b84d53a18a50f422580"
  },
  {
      "pan": "AWYPK2556P",
      "openingBalanceForexRate": null,
      "address": {
          "country": {
              "name": "India",
              "code": "IN"
          },
          "state": "Delhi",
          "address1": "A-43, ",
          "address2": "MEERA BAGH PASCHIM VIHAR",
          "pinCode": "110087",
          "city": "New Delhi"
      },
      "shippingAddress": {
          "country": {
              "name": "India",
              "code": "IN"
          },
          "state": "Delhi",
          "address1": "A-43, ",
          "address2": "MEERA BAGH PASCHIM VIHAR",
          "pinCode": "110087",
          "city": "New Delhi",
          "sameAsBillingAddress": true
      },
      "auditInfo": {
          "createdAt": 1654603959203,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1654603959203,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "type": "CONTACT",
      "gstin": "07AWYPK2556P1ZI",
      "name": "Test 1",
      "nameOnInvoice": "Test 1",
      "currency": null,
      "foreignOpeningBalance": null,
      "openingBalance": 0,
      "traceId": "aba05000aba05000",
      "spanId": "aba05000aba05000",
      "_id": "5d48525c-70fc-4130-a772-c60c9e121bdd",
      "_rev": "1-d3bebaf2de5a3dc6c5ae80f6bd653812"
  },
  {
      "pan": null,
      "openingBalanceForexRate": null,
      "auditInfo": {
          "createdAt": 1654671275129,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1654671275129,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "type": "CONTACT",
      "gstin": "",
      "address": {
          "country": {
              "code": "IN",
              "name": "India"
          }
      },
      "shippingAddress": {
          "country": {
              "code": "IN",
              "name": "India"
          },
          "sameAsBillingAddress": true
      },
      "name": "hiten",
      "nameOnInvoice": "hiten",
      "currency": null,
      "foreignOpeningBalance": null,
      "openingBalance": 0,
      "traceId": "57f2e00057f2e000",
      "spanId": "57f2e00057f2e000",
      "_id": "01a99188-deeb-4c6f-8af3-056ca3c26c41",
      "_rev": "1-0933b7fcf2e663216c451e7bf45e92a6"
  },
  {
      "type": "ACCOUNT",
      "traceId": "97b124b136540a46",
      "spanId": "26d806bd022be46d",
      "accType": "BALANCE_SHEET",
      "systemAccount": false,
      "level": 1,
      "parents": [
          "a420e46e-8d61-4128-8dd0-872f5d292a15"
      ],
      "name": "2 wheelers",
      "parentNames": [
          "Movable assets"
      ],
      "description": "Track the valuations of the motorcycles you owns",
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674921,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674921,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "isClosed": false,
      "_id": "8220cd0d-236f-4164-9185-74944eb0d631",
      "_rev": "1-bcae8d70cbf2890deba769f19cac8a8d"
  },
  {
      "type": "ACCOUNT",
      "traceId": "c56018c341f30c12",
      "spanId": "2b466f0865bc3a14",
      "accType": "BALANCE_SHEET",
      "systemAccount": true,
      "level": 1,
      "parents": [
          "TAXES"
      ],
      "name": "CGST",
      "parentNames": [
          "Taxes"
      ],
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674342,
          "createdBy": "hisab-tax",
          "updatedAt": 1651036674342,
          "updatedBy": "hisab-tax"
      },
      "_id": "CGST",
      "_rev": "1-a124d1b093add4427ac024f53423bae4"
  },
  {
      "type": "ACCOUNT",
      "traceId": "c56018c341f30c12",
      "spanId": "d677c4690b418908",
      "accType": "BALANCE_SHEET",
      "systemAccount": true,
      "level": 1,
      "parents": [
          "TAX-CREDITS"
      ],
      "name": "CGST Credit",
      "parentNames": [
          "Tax Credits"
      ],
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674439,
          "createdBy": "hisab-tax",
          "updatedAt": 1651036674439,
          "updatedBy": "hisab-tax"
      },
      "_id": "CGST-CREDIT",
      "_rev": "1-e5654376c59813fcef450dfab8673e4d"
  },
  {
      "type": "ACCOUNT",
      "traceId": "97b124b136540a46",
      "spanId": "26d806bd022be46d",
      "accType": "BALANCE_SHEET",
      "systemAccount": false,
      "equityAccount": true,
      "level": 0,
      "parents": [],
      "name": "Capital accounts",
      "parentNames": [],
      "description": "Used to track investment or withdrawals of the owners",
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674921,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674921,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "isClosed": false,
      "_id": "892d4638-7f42-4892-8eab-88ac166930b0",
      "_rev": "1-c1713dea502b74da6b8b954171ee00ca"
  },
  {
      "type": "ACCOUNT",
      "traceId": "97b124b136540a46",
      "spanId": "26d806bd022be46d",
      "accType": "BALANCE_SHEET",
      "systemAccount": false,
      "level": 1,
      "parents": [
          "a420e46e-8d61-4128-8dd0-872f5d292a15"
      ],
      "name": "Cars",
      "parentNames": [
          "Movable assets"
      ],
      "description": "Track the valuations of the cars you own",
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674921,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674921,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "isClosed": false,
      "_id": "da2b9346-7ee2-4ec8-898c-2a72b96fa835",
      "_rev": "1-cb8fd3d3b4bda099b080ccefee5ebe3c"
  },
  {
      "type": "ACCOUNT",
      "traceId": "97b124b136540a46",
      "spanId": "26d806bd022be46d",
      "accType": "PROFIT_LOSS",
      "systemAccount": false,
      "level": 0,
      "parents": [],
      "name": "Depreciation",
      "parentNames": [],
      "description": "Track amount of depreciation on assets",
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674921,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674921,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "isClosed": false,
      "_id": "6862ea58-2d1b-4692-b39c-96b1a2db6280",
      "_rev": "1-a781a14060d3f6fe2ca2f8f6541c0987"
  },
  {
      "type": "ACCOUNT",
      "traceId": "97b124b136540a46",
      "spanId": "26d806bd022be46d",
      "accType": "BALANCE_SHEET",
      "systemAccount": false,
      "level": 1,
      "parents": [
          "a420e46e-8d61-4128-8dd0-872f5d292a15"
      ],
      "name": "Electronic assets",
      "parentNames": [
          "Movable assets"
      ],
      "description": "Track valuations of electronic devices you owns",
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674921,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674921,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "isClosed": false,
      "_id": "a0002b28-5ada-412b-a2ab-2447747e7660",
      "_rev": "1-24f50dc3a6447ef1cd86d251b8b75777"
  },
  {
      "type": "ACCOUNT",
      "traceId": "97b124b136540a46",
      "spanId": "26d806bd022be46d",
      "accType": "BALANCE_SHEET",
      "systemAccount": false,
      "level": 1,
      "parents": [
          "a420e46e-8d61-4128-8dd0-872f5d292a15"
      ],
      "name": "Equipments",
      "parentNames": [
          "Movable assets"
      ],
      "description": "Track Machinery, equipment or devices you own for your business.",
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674921,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674921,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "isClosed": false,
      "_id": "fde2b57a-905c-4dee-89ce-6215d0b73fa7",
      "_rev": "1-6912b9142593dd3ebb0a3541bff94b4f"
  },
  {
      "type": "ACCOUNT",
      "traceId": "97b124b136540a46",
      "spanId": "26d806bd022be46d",
      "accType": "BALANCE_SHEET",
      "systemAccount": false,
      "level": 1,
      "parents": [
          "9f93e365-0f49-4626-96c6-7088f753cba8"
      ],
      "name": "Equity",
      "parentNames": [
          "Investments"
      ],
      "description": "",
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674921,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674921,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "isClosed": false,
      "_id": "7a949df1-baf1-4622-908a-610b6613d8a7",
      "_rev": "1-8e19b021c836ba3c979e4f523502d070"
  },
  {
      "type": "ACCOUNT",
      "traceId": "97b124b136540a46",
      "spanId": "26d806bd022be46d",
      "accType": "BALANCE_SHEET",
      "systemAccount": false,
      "level": 0,
      "parents": [],
      "name": "Fixed assets",
      "parentNames": [],
      "description": "Track assets that are not easily convertible to cash like land, flat bungalows or other commercial properties",
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674921,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674921,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "isClosed": false,
      "_id": "b84b1a25-7372-4eca-ad9d-632c80673e3c",
      "_rev": "1-a2b1a82fc89e4caffe743bc8c73cfc77"
  },
  {
      "type": "ACCOUNT",
      "traceId": "97b124b136540a46",
      "spanId": "26d806bd022be46d",
      "accType": "PROFIT_LOSS",
      "systemAccount": true,
      "level": 0,
      "parents": [],
      "name": "Forex gain/loss",
      "parentNames": [],
      "description": "",
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674921,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674921,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "isClosed": false,
      "_id": "FOREX_GAIN_LOSS",
      "_rev": "1-16b8e2078d63bde707a3acb8f9733b50"
  },
  {
      "type": "ACCOUNT",
      "traceId": "97b124b136540a46",
      "spanId": "26d806bd022be46d",
      "accType": "BALANCE_SHEET",
      "systemAccount": false,
      "level": 1,
      "parents": [
          "a420e46e-8d61-4128-8dd0-872f5d292a15"
      ],
      "name": "Furniture",
      "parentNames": [
          "Movable assets"
      ],
      "description": "Track any furniture yous owns and uses, like a chair, sofa, tables etc.",
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674921,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674921,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "isClosed": false,
      "_id": "6ff71874-ed9a-49b1-b8c0-a82dc72e53e2",
      "_rev": "1-43ab16b1a92d794abf20afb8d1e21cdb"
  },
  {
      "type": "ACCOUNT",
      "traceId": "97b124b136540a46",
      "spanId": "26d806bd022be46d",
      "accType": "PROFIT_LOSS",
      "systemAccount": false,
      "level": 0,
      "parents": [],
      "name": "Gain on sale of assets",
      "parentNames": [],
      "description": "Track profit incurred on the sale of assets",
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674921,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674921,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "isClosed": false,
      "_id": "5e8939e9-6edc-4a3d-aad2-4a5bddee8d62",
      "_rev": "1-d9ffb14eff03763c6f5c35ec1cfa2fd6"
  },
  {
      "type": "ACCOUNT",
      "traceId": "97b124b136540a46",
      "spanId": "26d806bd022be46d",
      "accType": "BALANCE_SHEET",
      "systemAccount": false,
      "level": 1,
      "parents": [
          "a420e46e-8d61-4128-8dd0-872f5d292a15"
      ],
      "name": "Gold ornaments",
      "parentNames": [
          "Movable assets"
      ],
      "description": "Track valuations of gold jewellery, gold coins you own",
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674921,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674921,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "isClosed": false,
      "_id": "1d7b53c3-121c-4098-a4c4-f9b8750c5275",
      "_rev": "1-aa8ac9657764e2a51da3e4af8ca705b0"
  },
  {
      "type": "ACCOUNT",
      "traceId": "97b124b136540a46",
      "spanId": "26d806bd022be46d",
      "accType": "BALANCE_SHEET",
      "systemAccount": false,
      "level": 2,
      "parents": [
          "9f93e365-0f49-4626-96c6-7088f753cba8",
          "d20a91d1-8a63-461f-a6e4-96e2e528d866"
      ],
      "name": "HDFC life",
      "parentNames": [
          "Investments",
          "Life insurance"
      ],
      "description": "",
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674921,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674921,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "isClosed": false,
      "_id": "7b3b9440-db83-410d-8d91-0e627de313fb",
      "_rev": "1-de4b973dfff3928d882a9391922b6879"
  },
  {
      "type": "ACCOUNT",
      "traceId": "c56018c341f30c12",
      "spanId": "f6dcebd1db4589d7",
      "accType": "BALANCE_SHEET",
      "systemAccount": true,
      "level": 1,
      "parents": [
          "TAXES"
      ],
      "name": "IGST",
      "parentNames": [
          "Taxes"
      ],
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674134,
          "createdBy": "hisab-tax",
          "updatedAt": 1651036674134,
          "updatedBy": "hisab-tax"
      },
      "_id": "IGST",
      "_rev": "1-72b656e85c069b7d42fd551fd1355cbf"
  },
  {
      "type": "ACCOUNT",
      "traceId": "c56018c341f30c12",
      "spanId": "5e30f932eb541a34",
      "accType": "BALANCE_SHEET",
      "systemAccount": true,
      "level": 1,
      "parents": [
          "TAX-CREDITS"
      ],
      "name": "IGST Credit",
      "parentNames": [
          "Tax Credits"
      ],
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674236,
          "createdBy": "hisab-tax",
          "updatedAt": 1651036674236,
          "updatedBy": "hisab-tax"
      },
      "_id": "IGST-CREDIT",
      "_rev": "1-7094657b19ea0c9bf25bc149bf79cccb"
  },
  {
      "type": "ACCOUNT",
      "traceId": "97b124b136540a46",
      "spanId": "26d806bd022be46d",
      "accType": "PROFIT_LOSS",
      "systemAccount": false,
      "level": 0,
      "parents": [],
      "name": "Indirect expense",
      "parentNames": [],
      "description": "Track expenses for activities not related to your primary business",
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674921,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674921,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "isClosed": false,
      "_id": "fa54e553-b664-4265-8da4-fc8f0b2f1056",
      "_rev": "1-798e178e2ecf37ad89e6f703851e7ecc"
  },
  {
      "type": "ACCOUNT",
      "traceId": "97b124b136540a46",
      "spanId": "26d806bd022be46d",
      "accType": "PROFIT_LOSS",
      "systemAccount": false,
      "level": 0,
      "parents": [],
      "name": "Indirect income",
      "parentNames": [],
      "description": "Track incomes from sources other than your primary income",
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674921,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674921,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "isClosed": false,
      "_id": "d471d5c6-157f-43ca-80ef-9a506bc697c1",
      "_rev": "1-506857d3f61b2b630bf1b942d3e0a4d3"
  },
  {
      "type": "ACCOUNT",
      "traceId": "97b124b136540a46",
      "spanId": "26d806bd022be46d",
      "accType": "PROFIT_LOSS",
      "systemAccount": false,
      "level": 1,
      "parents": [
          "d471d5c6-157f-43ca-80ef-9a506bc697c1"
      ],
      "name": "Interest income",
      "parentNames": [
          "Indirect income"
      ],
      "description": "Track interest from bank account or from loans you have given to others",
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674921,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674921,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "isClosed": false,
      "_id": "649cbb84-fc03-439b-983f-5e8572f8555c",
      "_rev": "1-8ad50a245869d994e71c89eaa04f28fb"
  },
  {
      "type": "ACCOUNT",
      "traceId": "97b124b136540a46",
      "spanId": "26d806bd022be46d",
      "accType": "PROFIT_LOSS",
      "systemAccount": false,
      "level": 1,
      "parents": [
          "fa54e553-b664-4265-8da4-fc8f0b2f1056"
      ],
      "name": "Interest paid",
      "parentNames": [
          "Indirect expense"
      ],
      "description": "Track interest you have paid to bank, credit cards or any other loans like mortgage, personal loan etc.",
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674921,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674921,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "isClosed": false,
      "_id": "2bf5580e-7275-4937-9437-facbe7dda24d",
      "_rev": "1-85e8f40a6a0ca85823e74d7d8cf4fe1a"
  },
  {
      "type": "ACCOUNT",
      "traceId": "97b124b136540a46",
      "spanId": "26d806bd022be46d",
      "accType": "BALANCE_SHEET",
      "systemAccount": false,
      "level": 0,
      "parents": [],
      "name": "Investments",
      "parentNames": [],
      "description": "Track investments in mutual funds, bonds, stock or life insurance policies",
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674921,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674921,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "isClosed": false,
      "_id": "9f93e365-0f49-4626-96c6-7088f753cba8",
      "_rev": "1-9b048ca92352f4c49d6714dbb600b741"
  },
  {
      "type": "ACCOUNT",
      "traceId": "97b124b136540a46",
      "spanId": "26d806bd022be46d",
      "accType": "BALANCE_SHEET",
      "systemAccount": false,
      "level": 2,
      "parents": [
          "9f93e365-0f49-4626-96c6-7088f753cba8",
          "d20a91d1-8a63-461f-a6e4-96e2e528d866"
      ],
      "name": "LIC",
      "parentNames": [
          "Investments",
          "Life insurance"
      ],
      "description": "",
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674921,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674921,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "isClosed": false,
      "_id": "0ccc4fc7-35a1-4c0e-bd83-d427bc652410",
      "_rev": "1-cda9bc2775de9d3d5d71d15d9729dfa5"
  },
  {
      "type": "ACCOUNT",
      "traceId": "97b124b136540a46",
      "spanId": "26d806bd022be46d",
      "accType": "BALANCE_SHEET",
      "systemAccount": false,
      "level": 1,
      "parents": [
          "9f93e365-0f49-4626-96c6-7088f753cba8"
      ],
      "name": "Life insurance",
      "parentNames": [
          "Investments"
      ],
      "description": "",
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674921,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674921,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "isClosed": false,
      "_id": "d20a91d1-8a63-461f-a6e4-96e2e528d866",
      "_rev": "1-de0e1d49cd05263c0bb64ce2aaca5579"
  },
  {
      "type": "ACCOUNT",
      "traceId": "97b124b136540a46",
      "spanId": "26d806bd022be46d",
      "accType": "BALANCE_SHEET",
      "systemAccount": false,
      "level": 0,
      "parents": [],
      "name": "Loans",
      "parentNames": [],
      "description": "Track the loan you have taken from bank or institutions",
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674921,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674921,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "isClosed": false,
      "_id": "86940dd1-99b6-4b01-8810-92a428aeb1f8",
      "_rev": "1-b1dd6f44c1d450ac96991f72acccc15d"
  },
  {
      "type": "ACCOUNT",
      "traceId": "97b124b136540a46",
      "spanId": "26d806bd022be46d",
      "accType": "PROFIT_LOSS",
      "systemAccount": false,
      "level": 0,
      "parents": [],
      "name": "Loss on sale of assets",
      "parentNames": [],
      "description": "Track losses incurred on the sale or disposal of assets",
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674921,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674921,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "isClosed": false,
      "_id": "abb18328-2c50-4d73-bfaf-47b3fb6044a2",
      "_rev": "1-efd920a410153cd0bd93d3031f372d37"
  },
  {
      "type": "ACCOUNT",
      "traceId": "97b124b136540a46",
      "spanId": "26d806bd022be46d",
      "accType": "BALANCE_SHEET",
      "systemAccount": false,
      "level": 2,
      "parents": [
          "9f93e365-0f49-4626-96c6-7088f753cba8",
          "d20a91d1-8a63-461f-a6e4-96e2e528d866"
      ],
      "name": "Max life",
      "parentNames": [
          "Investments",
          "Life insurance"
      ],
      "description": "",
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674921,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674921,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "isClosed": false,
      "_id": "a916ab0a-bf80-49ee-9cb7-64e3a00c349d",
      "_rev": "1-1b457f6da825694b9593117de8c56ab3"
  },
  {
      "type": "ACCOUNT",
      "traceId": "97b124b136540a46",
      "spanId": "26d806bd022be46d",
      "accType": "BALANCE_SHEET",
      "systemAccount": false,
      "level": 0,
      "parents": [],
      "name": "Movable assets",
      "parentNames": [],
      "description": "Track assets that are easily convertible to cash",
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674921,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674921,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "isClosed": false,
      "_id": "a420e46e-8d61-4128-8dd0-872f5d292a15",
      "_rev": "1-8d8065c6f22c462c60e47ab71ac6df78"
  },
  {
      "type": "ACCOUNT",
      "traceId": "97b124b136540a46",
      "spanId": "26d806bd022be46d",
      "accType": "BALANCE_SHEET",
      "systemAccount": false,
      "level": 1,
      "parents": [
          "9f93e365-0f49-4626-96c6-7088f753cba8"
      ],
      "name": "Mutual funds",
      "parentNames": [
          "Investments"
      ],
      "description": "",
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674921,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674921,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "isClosed": false,
      "_id": "4b64866b-70bd-4cff-8190-1ee1120aa68d",
      "_rev": "1-7b5b48c7fd275246659f3fab8de8b966"
  },
  {
      "type": "ACCOUNT",
      "traceId": "97b124b136540a46",
      "spanId": "26d806bd022be46d",
      "accType": "BALANCE_SHEET",
      "systemAccount": false,
      "level": 1,
      "parents": [
          "b84b1a25-7372-4eca-ad9d-632c80673e3c"
      ],
      "name": "My resident home",
      "parentNames": [
          "Fixed assets"
      ],
      "description": "",
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674921,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674921,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "isClosed": false,
      "_id": "09b3464e-e692-4969-8c00-0e27b6dd89bd",
      "_rev": "1-d51449cb30c07278fc527003f742d36c"
  },
  {
      "type": "ACCOUNT",
      "traceId": "97b124b136540a46",
      "spanId": "26d806bd022be46d",
      "accType": "BALANCE_SHEET",
      "systemAccount": false,
      "equityAccount": true,
      "level": 1,
      "parents": [
          "892d4638-7f42-4892-8eab-88ac166930b0"
      ],
      "name": "Owner1",
      "parentNames": [
          "Capital accounts"
      ],
      "description": "",
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674921,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674921,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "isClosed": false,
      "_id": "17496c4e-3800-4cbf-ab7c-e2c975277e00",
      "_rev": "1-f9ce080a9971da89db834314ba09d91c"
  },
  {
      "type": "ACCOUNT",
      "traceId": "97b124b136540a46",
      "spanId": "26d806bd022be46d",
      "accType": "BALANCE_SHEET",
      "systemAccount": false,
      "equityAccount": true,
      "level": 1,
      "parents": [
          "892d4638-7f42-4892-8eab-88ac166930b0"
      ],
      "name": "Owner2",
      "parentNames": [
          "Capital accounts"
      ],
      "description": "",
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674921,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674921,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "isClosed": false,
      "_id": "1ac75c53-fe2f-4970-9193-d8d1544ba0ba",
      "_rev": "1-a543ed3a5b30aa3eb5397ae0d1c6d93a"
  },
  {
      "type": "ACCOUNT",
      "traceId": "97b124b136540a46",
      "spanId": "26d806bd022be46d",
      "accType": "BALANCE_SHEET",
      "systemAccount": false,
      "level": 1,
      "parents": [
          "b84b1a25-7372-4eca-ad9d-632c80673e3c"
      ],
      "name": "Pali hill flat",
      "parentNames": [
          "Fixed assets"
      ],
      "description": "",
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674921,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674921,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "isClosed": false,
      "_id": "1071ec70-2373-41f9-b7d0-c2bde928e84f",
      "_rev": "1-4cd3874c8206f2bb7f601051058e626d"
  },
  {
      "type": "ACCOUNT",
      "traceId": "97b124b136540a46",
      "spanId": "26d806bd022be46d",
      "accType": "BALANCE_SHEET",
      "systemAccount": true,
      "equityAccount": true,
      "level": 0,
      "parents": [],
      "name": "Retained earnings",
      "parentNames": [],
      "description": "",
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674921,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674921,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "isClosed": false,
      "_id": "RETAINED-EARNING",
      "_rev": "1-8af465f96be0e739fd852cf2fbd35ae0"
  },
  {
      "type": "ACCOUNT",
      "traceId": "97b124b136540a46",
      "spanId": "26d806bd022be46d",
      "accType": "PROFIT_LOSS",
      "systemAccount": true,
      "level": 0,
      "parents": [],
      "name": "Round off",
      "parentNames": [],
      "description": "",
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674921,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674921,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "isClosed": false,
      "_id": "ROUND_OFF",
      "_rev": "1-7f1592b7cc85452745a4bf85b78bbea9"
  },
  {
      "type": "ACCOUNT",
      "traceId": "c56018c341f30c12",
      "spanId": "a83e3bc0d5873c29",
      "accType": "BALANCE_SHEET",
      "systemAccount": true,
      "level": 1,
      "parents": [
          "TAXES"
      ],
      "name": "SGST",
      "parentNames": [
          "Taxes"
      ],
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674518,
          "createdBy": "hisab-tax",
          "updatedAt": 1651036674518,
          "updatedBy": "hisab-tax"
      },
      "_id": "SGST",
      "_rev": "1-9b4088af9436d612354bafac760d6c6b"
  },
  {
      "type": "ACCOUNT",
      "traceId": "c56018c341f30c12",
      "spanId": "067392a76eb3f743",
      "accType": "BALANCE_SHEET",
      "systemAccount": true,
      "level": 1,
      "parents": [
          "TAX-CREDITS"
      ],
      "name": "SGST Credit",
      "parentNames": [
          "Tax Credits"
      ],
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674715,
          "createdBy": "hisab-tax",
          "updatedAt": 1651036674715,
          "updatedBy": "hisab-tax"
      },
      "_id": "SGST-CREDIT",
      "_rev": "1-67c1351fc50bab06460a504f54531ace"
  },
  {
      "type": "ACCOUNT",
      "traceId": "97b124b136540a46",
      "spanId": "26d806bd022be46d",
      "accType": "BALANCE_SHEET",
      "systemAccount": false,
      "level": 1,
      "parents": [
          "86940dd1-99b6-4b01-8810-92a428aeb1f8"
      ],
      "name": "Secured loans",
      "parentNames": [
          "Loans"
      ],
      "description": "",
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674921,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674921,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "isClosed": false,
      "_id": "99e4ae6d-af93-40b1-aca4-216f117734e9",
      "_rev": "1-fbe2b8b1e358e104d9c0700f9f674cb1"
  },
  {
      "type": "ACCOUNT",
      "traceId": "97b124b136540a46",
      "spanId": "26d806bd022be46d",
      "accType": "BALANCE_SHEET",
      "systemAccount": false,
      "level": 1,
      "parents": [
          "b84b1a25-7372-4eca-ad9d-632c80673e3c"
      ],
      "name": "Security deposits",
      "parentNames": [
          "Fixed assets"
      ],
      "description": "",
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674921,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674921,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "isClosed": false,
      "_id": "b7148329-d88c-4664-8aec-b94edc1855a6",
      "_rev": "1-1bacfc5d444b6cacf241c0d4dbb249e0"
  },
  {
      "type": "ACCOUNT",
      "traceId": "97b124b136540a46",
      "spanId": "26d806bd022be46d",
      "accType": "BALANCE_SHEET",
      "systemAccount": true,
      "level": 0,
      "parents": [],
      "name": "TCS Payable",
      "parentNames": [],
      "description": "",
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674921,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674921,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "isClosed": false,
      "_id": "TCS-PAYABLE",
      "_rev": "1-d6e7f8d02ff4b6c7b5899446397b450a"
  },
  {
      "type": "ACCOUNT",
      "traceId": "97b124b136540a46",
      "spanId": "26d806bd022be46d",
      "accType": "BALANCE_SHEET",
      "systemAccount": true,
      "level": 0,
      "parents": [],
      "name": "TCS Receivable",
      "parentNames": [],
      "description": "",
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674921,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674921,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "isClosed": false,
      "_id": "TCS-RECEIVABLE",
      "_rev": "1-3234231a4f3b40c696b335fb0d8058fe"
  },
  {
      "type": "ACCOUNT",
      "traceId": "97b124b136540a46",
      "spanId": "26d806bd022be46d",
      "accType": "BALANCE_SHEET",
      "systemAccount": true,
      "level": 0,
      "parents": [],
      "name": "TDS Payable",
      "parentNames": [],
      "description": "",
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674921,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674921,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "isClosed": false,
      "_id": "TDS-PAYABLE",
      "_rev": "1-af2f4de86fde2ad0ec1b9134cd1aced1"
  },
  {
      "type": "ACCOUNT",
      "traceId": "97b124b136540a46",
      "spanId": "26d806bd022be46d",
      "accType": "BALANCE_SHEET",
      "systemAccount": true,
      "level": 0,
      "parents": [],
      "name": "TDS Receivable",
      "parentNames": [],
      "description": "",
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674921,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674921,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "isClosed": false,
      "_id": "TDS-RECEIVABLE",
      "_rev": "1-e6be86e6bd7f86738b46aa4ba09104cb"
  },
  {
      "type": "ACCOUNT",
      "traceId": "c56018c341f30c12",
      "spanId": "4398586ef270a0f2",
      "accType": "BALANCE_SHEET",
      "systemAccount": true,
      "level": 0,
      "parents": [],
      "name": "Tax Credits",
      "parentNames": [],
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674057,
          "createdBy": "hisab-tax",
          "updatedAt": 1651036674057,
          "updatedBy": "hisab-tax"
      },
      "_id": "TAX-CREDITS",
      "_rev": "1-658adfd9b118e06bc4dad5c4877ca9df"
  },
  {
      "type": "ACCOUNT",
      "traceId": "c56018c341f30c12",
      "spanId": "99ff3403d39a1255",
      "accType": "BALANCE_SHEET",
      "systemAccount": true,
      "level": 0,
      "parents": [],
      "name": "Taxes",
      "parentNames": [],
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036673975,
          "createdBy": "hisab-tax",
          "updatedAt": 1651036673975,
          "updatedBy": "hisab-tax"
      },
      "_id": "TAXES",
      "_rev": "1-6431be84a64d30a4c56136053f8e1752"
  },
  {
      "type": "ACCOUNT",
      "traceId": "97b124b136540a46",
      "spanId": "26d806bd022be46d",
      "accType": "BALANCE_SHEET",
      "systemAccount": false,
      "level": 1,
      "parents": [
          "86940dd1-99b6-4b01-8810-92a428aeb1f8"
      ],
      "name": "Unsecured loans",
      "parentNames": [
          "Loans"
      ],
      "description": "",
      "openingBalance": 0,
      "auditInfo": {
          "createdAt": 1651036674921,
          "createdBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef",
          "updatedAt": 1651036674921,
          "updatedBy": "67610969-fdfe-4e12-a4a6-54b2dea95bef"
      },
      "isClosed": false,
      "_id": "974d6bf8-9f34-4b8f-b299-1f74bcdcf464",
      "_rev": "1-021106aae11dc92f5cb9dc12634986bd"
  }
]

export const country_list = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antigua &amp; Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bhutan",
  "Bolivia",
  "Bosnia &amp; Herzegovina",
  "Botswana",
  "Brazil",
  "British Virgin Islands",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Cape Verde",
  "Cayman Islands",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Congo",
  "Cook Islands",
  "Costa Rica",
  "Cote D Ivoire",
  "Croatia",
  "Cruise Ship",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Estonia",
  "Ethiopia",
  "Falkland Islands",
  "Faroe Islands",
  "Fiji",
  "Finland",
  "France",
  "French Polynesia",
  "French West Indies",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Gibraltar",
  "Greece",
  "Greenland",
  "Grenada",
  "Guam",
  "Guatemala",
  "Guernsey",
  "Guinea",
  "Guinea Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Isle of Man",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jersey",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kuwait",
  "Kyrgyz Republic",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Macau",
  "Macedonia",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Montserrat",
  "Morocco",
  "Mozambique",
  "Namibia",
  "Nepal",
  "Netherlands",
  "Netherlands Antilles",
  "New Caledonia",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "Norway",
  "Oman",
  "Pakistan",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Puerto Rico",
  "Qatar",
  "Reunion",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Pierre &amp; Miquelon",
  "Samoa",
  "San Marino",
  "Satellite",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "South Africa",
  "South Korea",
  "Spain",
  "Sri Lanka",
  "St Kitts &amp; Nevis",
  "St Lucia",
  "St Vincent",
  "St. Lucia",
  "Sudan",
  "Suriname",
  "Swaziland",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor L'Este",
  "Togo",
  "Tonga",
  "Trinidad &amp; Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Turks &amp; Caicos",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "Uruguay",
  "Uzbekistan",
  "Venezuela",
  "Vietnam",
  "Virgin Islands (US)",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

export const country_list_with_code = [
  { name: "Afghanistan", code: "AF" },
  { name: "land Islands", code: "AX" },
  { name: "Albania", code: "AL" },
  { name: "Algeria", code: "DZ" },
  { name: "American Samoa", code: "AS" },
  { name: "AndorrA", code: "AD" },
  { name: "Angola", code: "AO" },
  { name: "Anguilla", code: "AI" },
  { name: "Antarctica", code: "AQ" },
  { name: "Antigua and Barbuda", code: "AG" },
  { name: "Argentina", code: "AR" },
  { name: "Armenia", code: "AM" },
  { name: "Aruba", code: "AW" },
  { name: "Australia", code: "AU" },
  { name: "Austria", code: "AT" },
  { name: "Azerbaijan", code: "AZ" },
  { name: "Bahamas", code: "BS" },
  { name: "Bahrain", code: "BH" },
  { name: "Bangladesh", code: "BD" },
  { name: "Barbados", code: "BB" },
  { name: "Belarus", code: "BY" },
  { name: "Belgium", code: "BE" },
  { name: "Belize", code: "BZ" },
  { name: "Benin", code: "BJ" },
  { name: "Bermuda", code: "BM" },
  { name: "Bhutan", code: "BT" },
  { name: "Bolivia", code: "BO" },
  { name: "Bosnia and Herzegovina", code: "BA" },
  { name: "Botswana", code: "BW" },
  { name: "Bouvet Island", code: "BV" },
  { name: "Brazil", code: "BR" },
  { name: "British Indian Ocean Territory", code: "IO" },
  { name: "Brunei Darussalam", code: "BN" },
  { name: "Bulgaria", code: "BG" },
  { name: "Burkina Faso", code: "BF" },
  { name: "Burundi", code: "BI" },
  { name: "Cambodia", code: "KH" },
  { name: "Cameroon", code: "CM" },
  { name: "Canada", code: "CA" },
  { name: "Cape Verde", code: "CV" },
  { name: "Cayman Islands", code: "KY" },
  { name: "Central African Republic", code: "CF" },
  { name: "Chad", code: "TD" },
  { name: "Chile", code: "CL" },
  { name: "China", code: "CN" },
  { name: "Christmas Island", code: "CX" },
  { name: "Cocos (Keeling) Islands", code: "CC" },
  { name: "Colombia", code: "CO" },
  { name: "Comoros", code: "KM" },
  { name: "Congo", code: "CG" },
  { name: "Congo, The Democratic Republic of the", code: "CD" },
  { name: "Cook Islands", code: "CK" },
  { name: "Costa Rica", code: "CR" },
  { name: "Cote D'Ivoire", code: "CI" },
  { name: "Croatia", code: "HR" },
  { name: "Cuba", code: "CU" },
  { name: "Cyprus", code: "CY" },
  { name: "Czech Republic", code: "CZ" },
  { name: "Denmark", code: "DK" },
  { name: "Djibouti", code: "DJ" },
  { name: "Dominica", code: "DM" },
  { name: "Dominican Republic", code: "DO" },
  { name: "Ecuador", code: "EC" },
  { name: "Egypt", code: "EG" },
  { name: "El Salvador", code: "SV" },
  { name: "Equatorial Guinea", code: "GQ" },
  { name: "Eritrea", code: "ER" },
  { name: "Estonia", code: "EE" },
  { name: "Ethiopia", code: "ET" },
  { name: "Falkland Islands (Malvinas)", code: "FK" },
  { name: "Faroe Islands", code: "FO" },
  { name: "Fiji", code: "FJ" },
  { name: "Finland", code: "FI" },
  { name: "France", code: "FR" },
  { name: "French Guiana", code: "GF" },
  { name: "French Polynesia", code: "PF" },
  { name: "French Southern Territories", code: "TF" },
  { name: "Gabon", code: "GA" },
  { name: "Gambia", code: "GM" },
  { name: "Georgia", code: "GE" },
  { name: "Germany", code: "DE" },
  { name: "Ghana", code: "GH" },
  { name: "Gibraltar", code: "GI" },
  { name: "Greece", code: "GR" },
  { name: "Greenland", code: "GL" },
  { name: "Grenada", code: "GD" },
  { name: "Guadeloupe", code: "GP" },
  { name: "Guam", code: "GU" },
  { name: "Guatemala", code: "GT" },
  { name: "Guernsey", code: "GG" },
  { name: "Guinea", code: "GN" },
  { name: "Guinea-Bissau", code: "GW" },
  { name: "Guyana", code: "GY" },
  { name: "Haiti", code: "HT" },
  { name: "Heard Island and Mcdonald Islands", code: "HM" },
  { name: "Holy See (Vatican City State)", code: "VA" },
  { name: "Honduras", code: "HN" },
  { name: "Hong Kong", code: "HK" },
  { name: "Hungary", code: "HU" },
  { name: "Iceland", code: "IS" },
  { name: "India", code: "IN" },
  { name: "Indonesia", code: "ID" },
  { name: "Iran, Islamic Republic Of", code: "IR" },
  { name: "Iraq", code: "IQ" },
  { name: "Ireland", code: "IE" },
  { name: "Isle of Man", code: "IM" },
  { name: "Israel", code: "IL" },
  { name: "Italy", code: "IT" },
  { name: "Jamaica", code: "JM" },
  { name: "Japan", code: "JP" },
  { name: "Jersey", code: "JE" },
  { name: "Jordan", code: "JO" },
  { name: "Kazakhstan", code: "KZ" },
  { name: "Kenya", code: "KE" },
  { name: "Kiribati", code: "KI" },
  { name: "Korea, Democratic People'S Republic of", code: "KP" },
  { name: "Korea, Republic of", code: "KR" },
  { name: "Kuwait", code: "KW" },
  { name: "Kyrgyzstan", code: "KG" },
  { name: "Lao People'S Democratic Republic", code: "LA" },
  { name: "Latvia", code: "LV" },
  { name: "Lebanon", code: "LB" },
  { name: "Lesotho", code: "LS" },
  { name: "Liberia", code: "LR" },
  { name: "Libyan Arab Jamahiriya", code: "LY" },
  { name: "Liechtenstein", code: "LI" },
  { name: "Lithuania", code: "LT" },
  { name: "Luxembourg", code: "LU" },
  { name: "Macao", code: "MO" },
  { name: "Macedonia, The Former Yugoslav Republic of", code: "MK" },
  { name: "Madagascar", code: "MG" },
  { name: "Malawi", code: "MW" },
  { name: "Malaysia", code: "MY" },
  { name: "Maldives", code: "MV" },
  { name: "Mali", code: "ML" },
  { name: "Malta", code: "MT" },
  { name: "Marshall Islands", code: "MH" },
  { name: "Martinique", code: "MQ" },
  { name: "Mauritania", code: "MR" },
  { name: "Mauritius", code: "MU" },
  { name: "Mayotte", code: "YT" },
  { name: "Mexico", code: "MX" },
  { name: "Micronesia, Federated States of", code: "FM" },
  { name: "Moldova, Republic of", code: "MD" },
  { name: "Monaco", code: "MC" },
  { name: "Mongolia", code: "MN" },
  { name: "Montenegro", code: "ME" },
  { name: "Montserrat", code: "MS" },
  { name: "Morocco", code: "MA" },
  { name: "Mozambique", code: "MZ" },
  { name: "Myanmar", code: "MM" },
  { name: "Namibia", code: "NA" },
  { name: "Nauru", code: "NR" },
  { name: "Nepal", code: "NP" },
  { name: "Netherlands", code: "NL" },
  { name: "Netherlands Antilles", code: "AN" },
  { name: "New Caledonia", code: "NC" },
  { name: "New Zealand", code: "NZ" },
  { name: "Nicaragua", code: "NI" },
  { name: "Niger", code: "NE" },
  { name: "Nigeria", code: "NG" },
  { name: "Niue", code: "NU" },
  { name: "Norfolk Island", code: "NF" },
  { name: "Northern Mariana Islands", code: "MP" },
  { name: "Norway", code: "NO" },
  { name: "Oman", code: "OM" },
  { name: "Pakistan", code: "PK" },
  { name: "Palau", code: "PW" },
  { name: "Palestinian Territory, Occupied", code: "PS" },
  { name: "Panama", code: "PA" },
  { name: "Papua New Guinea", code: "PG" },
  { name: "Paraguay", code: "PY" },
  { name: "Peru", code: "PE" },
  { name: "Philippines", code: "PH" },
  { name: "Pitcairn", code: "PN" },
  { name: "Poland", code: "PL" },
  { name: "Portugal", code: "PT" },
  { name: "Puerto Rico", code: "PR" },
  { name: "Qatar", code: "QA" },
  { name: "Reunion", code: "RE" },
  { name: "Romania", code: "RO" },
  { name: "Russian Federation", code: "RU" },
  { name: "RWANDA", code: "RW" },
  { name: "Saint Helena", code: "SH" },
  { name: "Saint Kitts and Nevis", code: "KN" },
  { name: "Saint Lucia", code: "LC" },
  { name: "Saint Pierre and Miquelon", code: "PM" },
  { name: "Saint Vincent and the Grenadines", code: "VC" },
  { name: "Samoa", code: "WS" },
  { name: "San Marino", code: "SM" },
  { name: "Sao Tome and Principe", code: "ST" },
  { name: "Saudi Arabia", code: "SA" },
  { name: "Senegal", code: "SN" },
  { name: "Serbia", code: "RS" },
  { name: "Seychelles", code: "SC" },
  { name: "Sierra Leone", code: "SL" },
  { name: "Singapore", code: "SG" },
  { name: "Slovakia", code: "SK" },
  { name: "Slovenia", code: "SI" },
  { name: "Solomon Islands", code: "SB" },
  { name: "Somalia", code: "SO" },
  { name: "South Africa", code: "ZA" },
  { name: "South Georgia and the South Sandwich Islands", code: "GS" },
  { name: "Spain", code: "ES" },
  { name: "Sri Lanka", code: "LK" },
  { name: "Sudan", code: "SD" },
  { name: "Suriname", code: "SR" },
  { name: "Svalbard and Jan Mayen", code: "SJ" },
  { name: "Swaziland", code: "SZ" },
  { name: "Sweden", code: "SE" },
  { name: "Switzerland", code: "CH" },
  { name: "Syrian Arab Republic", code: "SY" },
  { name: "Taiwan, Province of China", code: "TW" },
  { name: "Tajikistan", code: "TJ" },
  { name: "Tanzania, United Republic of", code: "TZ" },
  { name: "Thailand", code: "TH" },
  { name: "Timor-Leste", code: "TL" },
  { name: "Togo", code: "TG" },
  { name: "Tokelau", code: "TK" },
  { name: "Tonga", code: "TO" },
  { name: "Trinidad and Tobago", code: "TT" },
  { name: "Tunisia", code: "TN" },
  { name: "Turkey", code: "TR" },
  { name: "Turkmenistan", code: "TM" },
  { name: "Turks and Caicos Islands", code: "TC" },
  { name: "Tuvalu", code: "TV" },
  { name: "Uganda", code: "UG" },
  { name: "Ukraine", code: "UA" },
  { name: "United Arab Emirates", code: "AE" },
  { name: "United Kingdom", code: "GB" },
  { name: "United States", code: "US" },
  { name: "United States Minor Outlying Islands", code: "UM" },
  { name: "Uruguay", code: "UY" },
  { name: "Uzbekistan", code: "UZ" },
  { name: "Vanuatu", code: "VU" },
  { name: "Venezuela", code: "VE" },
  { name: "Viet Nam", code: "VN" },
  { name: "Virgin Islands, British", code: "VG" },
  { name: "Virgin Islands, U.S.", code: "VI" },
  { name: "Wallis and Futuna", code: "WF" },
  { name: "Western Sahara", code: "EH" },
  { name: "Yemen", code: "YE" },
  { name: "Zambia", code: "ZM" },
  { name: "Zimbabwe", code: "ZW" },
];
