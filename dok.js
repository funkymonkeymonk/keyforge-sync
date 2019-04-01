const request = require("request-promise-native");

const DoKBearerToken = process.env.DOK_TOKEN;

const getMyDecks = (page = 0, prev = []) => {
  return request({
    method: "POST",
    url: "https://decksofkeyforge.com/api/decks/filter",
    headers: {
      authorization:
        "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ3aWxsaWFtZHdlYXZlckBnbWFpbC5jb20iLCJpYXQiOjE1NTQwNjkyNjAsImV4cCI6MTU1NDY3NDA2MCwiUm9sZSI6IlVTRVIifQ.vk4mkrxlxpDLWtQUmr4Kp8J1lrb7Ssl9PlCX6f7-r73AetJz3ohpQrTZzo9qCzvGxUSamAM_J6S1ReBPJbqjoQ",
      "content-type": "application/json"
    },
    body: {
      page: page,
      sortDirection: "DESC",
      owner: "funkymonkeymonk"
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

    return getMyDecks(page + 1, decks);
  });
};

const importDecks = decks => {
  if (decks.length === 0) console.log("No new decks to import.");
  for (let deck of decks) {
    console.log(`Importing ${deck.name} into DoK`);
    request({
      method: "POST",
      url: `https://decksofkeyforge.com/api/decks/${deck.id}/import-and-add`,
      headers: { authorization: DoKBearerToken }
    })
      .then(console.log(`Imported ${deck.name} into DoK`))
      .catch(err => console.log(`Import failed`));
  }
};

module.exports = { getMyDecks, importDecks };
