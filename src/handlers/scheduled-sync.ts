require('dotenv').config()

import {
  ScheduledHandler
} from "aws-lambda";
import {Deck} from "../libs/deck";

const MasterVault = require("../libs/master-vault");
const DoK = require("../libs/dok");

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

  // Move the sync flow to a command for easier reuse
  // create an interface for all storage locations
  // move credentials to secure storage instead of environment
  // Set up proper monitoring and alerting for errors
  // Extend the push notification to include SAS score
  // Fan out for each deck that needs to be loaded? Redesign the flow?

  const mvDecks: Deck[] = await MasterVault.getMyDecks(creds.mv)
  const dokDecks: Deck[] = await DoK.sync(creds, mvDecks, dryRun);
  // Crucible.sync(creds.crucible, mvDecks, dryRun);
}
