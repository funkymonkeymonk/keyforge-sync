import { Deck } from "./deck";

export const delta = (source: Deck[], destination: Deck[]) => {
  console.log(
    `${source.length} decks in source -> ${
    destination.length
    } decks in destination`
  );
  return source.filter(deck => !destination.map(d => d.id).includes(deck.id));
};