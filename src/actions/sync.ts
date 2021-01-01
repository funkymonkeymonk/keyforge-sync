import {Deck, Creds} from "../types";

const MasterVault = require("../libs/master-vault");
const Dok = require("../libs/dok");
import {delta, notify} from "../libs/utils";

export async function sync(creds: Creds, dryRun: boolean) {
  // create an interface for all storage locations
  // move credentials to secure storage instead of environment
  // Set up proper monitoring and alerting for errors
  // Extend the push notification to include SAS score

  // I need to fail the app when connection to a deck source fails
  // I should get decks for all sources that are relevant in parallel to speed up the process.
  // Is there other ways to pay for less wait here?
  const mvDecks: Deck[] = await MasterVault.getDecks(creds.mv)
  const dokToken: String = await Dok.login(creds.dok)
  const dokDecks: Deck[] = await Dok.getDecks(creds.dok, dokToken)
  const mvToDokDiff: Deck[] = delta(mvDecks, dokDecks)
  if (!dryRun) {
    const addedDecks: Deck[] = await Dok.addDecks(creds.dok, dokToken, mvToDokDiff)
    await Promise.all(addedDecks.map(deck => notify(creds.pushover, deck)))
  }
}
