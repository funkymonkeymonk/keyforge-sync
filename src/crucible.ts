import { Deck } from "./deck";
import * as request from "request-promise-native";
import { delta } from "./utils";

interface crucibleDeckData {
  identity: string;
  uuid: string;
}

class User {
  constructor(
    public username: string,
    public password: string,
    public userId: string
  ) {}
}

import { read, write } from "./credentials";

const loadCreds = () => {
  const user: User = read("will_crucible.dat");
  return user;
};

const saveCreds = (user: any) => {
  return write("will_crucible.dat", user);
};

const getMyDecks = (token: string, userId: string) => {
  return request({
    method: "GET",
    url: "https://www.thecrucible.online/api/decks",
    qs: { _: userId },
    headers: {
      authorization: "Bearer " + token
    },
    json: true
  }).then(res => {
    return res.decks.map((deck: crucibleDeckData) => ({
      name: deck.identity,
      id: deck.uuid
    }));
  });
};

const importDecks = (token: string, decks: Deck[], dryRun: boolean) => {
  if (decks.length === 0) console.log("No new decks to import.");

  for (let deck of decks) {
    console.log(`Importing ${deck.name} into Crucible`);
    if (!dryRun) {
      request({
        method: "POST",
        url: "https://www.thecrucible.online/api/decks/",
        headers: {
          authorization: "Bearer " + token,
          "content-type": "application/json"
        },
        body: { uuid: deck.id },
        json: true
      })
        .then(resp => console.log(`Imported ${deck.name} into Crucible`))
        .catch(err => console.log(`Import failed`));
    } else console.log("Dry run, not importing");
  }
};

const login = (username: string, password: string) => {
  return request({
    method: "POST",
    url: "https://www.thecrucible.online/api/account/login",
    body: {
      username: username,
      password: password
    },
    json: true
  }).then(res => res.token);
};

export const sync = (mvDecks: Deck[], dryRun: boolean) => {
  const user = loadCreds();

  login(user.username, user.password)
    .then(token => {
      getMyDecks(token, user.userId)
        .then((crucibleDecks: Deck[]) => delta(mvDecks, crucibleDecks))
        .then((decks: Deck[]) => importDecks(token, decks, dryRun))
        .then(() => saveCreds(user))
        .catch(err => {
          console.log("Error syncing Crucible");
          console.log(err.message);
        });
    })
    .catch(err => {
      console.log("Error connecting to Crucible");
      console.log(err.message);
    });
};
