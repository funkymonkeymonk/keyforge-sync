import {Deck} from "../types";
import * as request from "request-promise-native";

interface dokDeckData {
  name: string;
  keyforgeId: string;
}

interface User {
  email: string
  password: string
  username: string
}

export const login = (user: User) => {
  return request({
    method: "POST",
    url: "https://decksofkeyforge.com/api/users/login",
    body: {
      email: user.email,
      password: user.password
    },
    json: true,
    resolveWithFullResponse: true
  })
    .then(res => res.headers.authorization);
};

export const getDecks = (
  user: User,
  token: string,
  page: number = 0,
  prev: Deck[] = []
): Promise<Deck[]> => {
  const username = user.username
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

    return getDecks(user, token, page + 1, decks);
  });
};

async function addDeck(deck: Deck, token: string) {
  console.info(`Importing ${deck.name} into DoK`);
  try {
    await request({
      method: "POST",
      url: `https://decksofkeyforge.com/api/decks/${deck.id}/import-and-add`,
      headers: {authorization: token}
    })
    console.info(`Imported ${deck.name} into DoK`)
  } catch (err) {
    console.error(`Import failed for deck ${deck.name}`)
  }
}

export const addDecks = async (creds: User, token: string, decks: Deck[]) => {
  if (decks.length === 0) console.info("No new decks to import.");
  await Promise.all(decks.map(deck => addDeck(deck, token)))

  // TODO: The return array should only return decks that were successful
  return decks
};
