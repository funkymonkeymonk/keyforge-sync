require('dotenv').config()

import {ScheduledHandler} from "aws-lambda"
const Sync = require("../actions/sync")

export const handler: ScheduledHandler = async event => {
  const dryRun = false
  const creds = {
    mv: {
      name: process.env.MV_NAME,
      token: process.env.MV_TOKEN,
      id: process.env.MV_ID
    },
    dok: {
      username: process.env.DOK_USERNAME,
      password: process.env.DOK_PASSWORD,
      email: process.env.DOK_EMAIL
    },
    pushover: {
      apiKey: process.env.PUSHOVER_API_KEY,
      userKey: process.env.PUSHOVER_USER_KEY
    }
  }

  await Sync.sync(creds, dryRun);
}
