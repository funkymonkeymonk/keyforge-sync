import { Command, flags } from "@oclif/command";
import { Deck } from "../libs/deck";
const MasterVault = require("../libs/master-vault");
import { read } from "../libs/credentials";

const credFile = read("creds.dat");

export default class Sync extends Command {
  static description = "sync mastervault with other sources";

  static flags = {
    help: flags.help({ char: "h" }),
    dry: flags.boolean(),
    dok: flags.boolean({ char: "d" }),
    crucible: flags.boolean({ char: "c" }),
    all: flags.boolean({ char: "a" })
  };

  static args = [{ name: "file" }];

  async run() {
    const { args, flags } = this.parse(Sync);
    const dryRun = flags.dry;

    // Handle no credsfile or empty creds file cases
    credFile.credsets.forEach((creds: { mv: any; dok: any; crucible: any; }) => {
      MasterVault.getMyDecks(creds.mv).then((mvDecks: Deck[]) => {
        //Sync dok
        const DoK = require("../libs/dok");
        DoK.sync(creds, mvDecks, dryRun);

        //Sync crucible
        const Crucible = require("../libs/crucible");
        Crucible.sync(creds.crucible, mvDecks, dryRun);

        //TODO: Remove Favorites from Crucible

        //TODO: Remove favorites from MV
      })
    })
  }
}
