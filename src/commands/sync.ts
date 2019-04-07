import { Command, flags } from "@oclif/command";
import { Deck } from "../libs/deck";
const MasterVault = require("../libs/master-vault");
import { read } from "../libs/credentials";

const creds = read("creds.dat");

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

    const dok = flags.dok || flags.all || false;
    const crucible = flags.crucible || flags.all || false;
    const dryRun = flags.dry;

    MasterVault.getMyDecks(creds.mv).then((mvDecks: Deck[]) => {
      if (dok) {
        const DoK = require("../libs/dok");
        DoK.sync(creds.dok, mvDecks, dryRun);
      }

      if (crucible) {
        const Crucible = require("../libs/crucible");
        Crucible.sync(creds.crucible, mvDecks, dryRun);
      }
    });
  }
}
