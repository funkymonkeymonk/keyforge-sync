import { Deck } from "./deck";
import * as request from "request-promise-native";

const MasterVaultToken = process.env.MV_TOKEN;
const MasterVaultUserId = process.env.MV_USER;

interface mvDeckData {
  name: string;
  id: string;
}

const getMyDecks = (page: number = 1, prev: Deck[] = []): Promise<Deck[]> => {
  return request({
    method: "GET",
    url: `https://www.keyforgegame.com/api/users/${MasterVaultUserId}/decks/`,
    qs: {
      page: page,
      page_size: "30",
      ordering: "-date"
    },
    headers: { authorization: MasterVaultToken },
    json: true
  })
    .then(res => {
      const decks = prev.concat(
        res.data.map((deck: mvDeckData) => new Deck(deck.name, deck.id))
      );

      // Return all results if complete
      if (decks.length >= res.count) return decks;
      else return getMyDecks(page + 1, decks);
    })
    .catch(err => {
      console.log("Error connecting to Master Vault");
      console.log(err.message);
      return [];
    });
};

module.exports = { getMyDecks };
