const delta = (source, destination) => {
  console.log(
    `${source.length} decks in source -> ${
      destination.length
    } decks in destination`
  );
  return source.filter(deck => !destination.map(d => d.id).includes(deck.id));
};

module.exports = { delta };
