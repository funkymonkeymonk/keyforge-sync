import {Deck} from "../types";
import * as request from "request-promise-native";

interface mvDeckData {
  name: string;
  id: string;
}

class User {
  constructor(public name: string, public id: string, public token: string) {
  }
}

export const getDecks = (
  user: User,
  page: number = 1,
  prev: Deck[] = []
): Promise<Deck[]> => {
  return request({
    method: "GET",
    url: `https://www.keyforgegame.com/api/users/${user.id}/decks/`,
    qs: {
      page: page,
      page_size: "30",
      ordering: "-date"
    },
    headers: {authorization: user.token},
    json: true
  })
    .then(res => {
      const decks: Deck[] = prev.concat(
        res.data.map((deck: mvDeckData) => {deck.name, deck.id})
      );

      // Return all results if complete
      if (decks.length >= res.count) return decks;
      else return getDecks(user, page + 1, decks);
    })
    .catch(err => {
      console.error("Error connecting to Master Vault for user: " + user.name);
      console.error(err.message);
      return [];
    });
};
