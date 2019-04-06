import { Deck } from "./deck";
import * as request from "request-promise-native";

const delta = require("./utils").delta;

const CrucibleUserId = process.env.CRUCIBLE_USER;

interface crucibleDeckData {
  identity: string;
  uuid: string;
}

const getMyDecks = (token: string) => {
  return request({
    method: "GET",
    url: "https://www.thecrucible.online/api/decks",
    qs: { _: CrucibleUserId },
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

const sync = (mvDecks: boolean, dryRun: boolean) => {
  const username = process.env.CRUCIBLE_USERNAME;
  const password = process.env.CRUCIBLE_PASSWORD;

  login(username, password)
    .then(token => {
      getMyDecks(token)
        .then(crucibleDecks => delta(mvDecks, crucibleDecks))
        .then(decks => importDecks(token, decks, dryRun))
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

module.exports = { sync };
