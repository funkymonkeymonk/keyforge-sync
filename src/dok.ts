import { Deck } from "./deck";
import * as request from "request-promise-native";
import { delta } from "./utils";

interface dokDeckData {
  name: string;
  keyforgeId: string;
}

class User {
  constructor(
    public email: string,
    public password: string,
    public username: string
  ) {}
}

import { read, write } from "./credentials";

const loadCreds = () => {
  const user: User = read("will_dok.dat");
  return user;
};

const saveCreds = (user: any) => {
  return write("will_dok.dat", user);
};

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
      "content-type": "application/json"
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

const importDecks = (token: string, decks: Deck[], dryRun: boolean) => {
  if (decks.length === 0) console.log("No new decks to import.");
  for (let deck of decks) {
    console.log(`Importing ${deck.name} into DoK`);
    if (!dryRun) {
      request({
        method: "POST",
        url: `https://decksofkeyforge.com/api/decks/${deck.id}/import-and-add`,
        headers: { authorization: token }
      })
        .then(res => console.log(`Imported ${deck.name} into DoK`))
        .catch(err => console.log(`Import failed`));
    } else console.log("Dry run, not importing");
  }
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

export const sync = (mvDecks: Deck[], dryRun: boolean) => {
  const user = loadCreds();

  login(user.email, user.password)
    .then((token: string) => {
      getMyDecks(user.username, token)
        .then((dokDecks: Deck[]) => delta(mvDecks, dokDecks))
        .then((decks: Deck[]) => importDecks(token, decks, dryRun))
        .catch(err => {
          console.log("Error syncing Decks Of Keyforge");
          console.log(err.message);
        });
    })
    .catch(err => {
      console.log("Error connecting to Decks Of Keyforge");
      console.log(err.message);
    });
};
