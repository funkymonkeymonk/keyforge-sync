const request = require("request-promise-native");

const MasterVaultToken = process.env.MV_TOKEN;
const MasterVaultUserId = process.env.MV_USER;

const getMyDecks = (page = 1, prev = []) => {
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
  }).then(res => {
    const decks = prev.concat(
      res.data.map(deck => ({
        name: deck.name,
        id: deck.id
      }))
    );

    // Return all results if complete
    if (decks.length >= res.count) return decks;
    else return getMyDecks(page + 1, decks);
  });
};

module.exports = { getMyDecks };
