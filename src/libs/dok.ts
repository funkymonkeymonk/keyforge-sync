import {Deck} from "./deck";
import * as request from "request-promise-native";
import {delta, notify} from "./utils";

interface dokDeckData {
  name: string;
  keyforgeId: string;
}

class User {
  constructor(
    public email: string,
    public password: string,
    public username: string
  ) {
  }
}

const getMyDecks = (
  username: string,
  token: string,
  page: number = 0,
  prev: Deck[] = []
): Promise<Deck[]> => {
  return request({
    method: "POST",
    url: "https://decksofkeyforge.com/api/decks/filter",
    headers: {
      authorization: token,
      "content-type": "application/json",
      timezone: 240
    },
    body: {
      page: page,
      sortDirection: "DESC",
      owner: username
    },
    json: true
  }).then(res => {
    // Return all results if complete
    if (res.decks.length === 0) return prev;

    const decks = prev.concat(
      res.decks.map((deck: dokDeckData) => ({
        name: deck.name,
        id: deck.keyforgeId
      }))
    );

    return getMyDecks(username, token, page + 1, decks);
  });
};

const importDecks = async (token: string, decks: Deck[], creds: any, dryRun: boolean) => {
  // Dev flag
  const notifyEnabled = true

  if (decks.length === 0) console.info("No new decks to import.");
  for (let deck of decks) {
    console.info(`Importing ${deck.name} into DoK`);
    if (!dryRun) {
      try {
        await request({
          method: "POST",
          url: `https://decksofkeyforge.com/api/decks/${deck.id}/import-and-add`,
          headers: {authorization: token}
        })
        console.info(`Imported ${deck.name} into DoK`)
        if (notifyEnabled) await notify(creds, deck)
      } catch(err) {
        console.error(`Import failed`)
      }
    } else {
      if (notifyEnabled) notify(creds, deck)
      console.info("Dry run, not importing")
    }
  }
  return decks
};

const login = (email: string, password: string) => {
  return request({
    method: "POST",
    url: "https://decksofkeyforge.com/api/users/login",
    body: {
      email: email,
      password: password
    },
    json: true,
    resolveWithFullResponse: true
  }).then(res => res.headers.authorization);
};

async function diffAndUpload(user: User, token: string, mvDecks: Deck[], creds: any, dryRun: boolean) {
  try {
    const dokDecks: Deck[] = await getMyDecks(user.username, token)
    const newDecks: Deck[] = delta(mvDecks, dokDecks)
    const importedDecks: Deck[] = await importDecks(token, newDecks, creds, dryRun)
    return importedDecks
  } catch (err) {
    console.error("Error syncing Decks Of Keyforge");
    console.error(err.message);
    return []
  }
}

export const sync = async (creds: any, mvDecks: Deck[], dryRun: boolean): Promise<Deck[]>  => {
  const user: User = creds.dok

  try {
    let token: string = await login(user.email, user.password)
    return await diffAndUpload(user, token, mvDecks, creds, dryRun);
  } catch (err) {
    console.error("Error connecting to Decks Of Keyforge");
    console.error(err.message);
    return []
  }
};
