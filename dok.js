const request = require("request-promise-native");

const getMyDecks = (username, token, page = 0, prev = []) => {
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
      res.decks.map(deck => ({
        name: deck.name,
        id: deck.keyforgeId
      }))
    );

    return getMyDecks(username, token, page + 1, decks);
  });
};

const importDecks = (token, decks) => {
  if (decks.length === 0) console.log("No new decks to import.");
  for (let deck of decks) {
    console.log(`Importing ${deck.name} into DoK`);
    request({
      method: "POST",
      url: `https://decksofkeyforge.com/api/decks/${deck.id}/import-and-add`,
      headers: { authorization: token }
    })
      .then(console.log(`Imported ${deck.name} into DoK`))
      .catch(err => console.log(`Import failed`));
  }
};

const login = (email, password) => {
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

module.exports = { getMyDecks, importDecks, login };
