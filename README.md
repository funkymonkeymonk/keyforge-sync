# keyforge-sync

Syncs keyforge decks between mastervault and decksofkeyforge.com

**_USE THIS AT YOUR OWN RISK_**

Seriously. I make no promises that any one of these sites won't shut down your account, ban you, or any other type of stuff.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/keyforge-sync.svg)](https://npmjs.org/package/keyforge-sync)
[![CircleCI](https://circleci.com/gh/funkymonkeymonk/keyforge-sync/tree/master.svg?style=shield)](https://circleci.com/gh/funkymonkeymonk/keyforge-sync/tree/master)
[![Codecov](https://codecov.io/gh/funkymonkeymonk/keyforge-sync/branch/master/graph/badge.svg)](https://codecov.io/gh/funkymonkeymonk/keyforge-sync)
[![Downloads/week](https://img.shields.io/npm/dw/keyforge-sync.svg)](https://npmjs.org/package/keyforge-sync)
[![License](https://img.shields.io/npm/l/keyforge-sync.svg)](https://github.com/funkymonkeymonk/keyforge-sync/blob/master/package.json)

<!-- toc -->
* [keyforge-sync](#keyforge-sync)
* [Usage](#usage)
* [Commands](#commands)
* [TODO](#todo)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g keyforge-sync
$ keyforge-sync COMMAND
running command...
$ keyforge-sync (-v|--version|version)
keyforge-sync/1.0.0 darwin-x64 node-v11.12.0
$ keyforge-sync --help [COMMAND]
USAGE
  $ keyforge-sync COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`keyforge-sync hello [FILE]`](#keyforge-sync-hello-file)
* [`keyforge-sync help [COMMAND]`](#keyforge-sync-help-command)
* [`keyforge-sync sync [FILE]`](#keyforge-sync-sync-file)

## `keyforge-sync hello [FILE]`

describe the command here

```
USAGE
  $ keyforge-sync hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ keyforge-sync hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/funkymonkeymonk/keyforge-sync/blob/v1.0.0/src/commands/hello.ts)_

## `keyforge-sync help [COMMAND]`

display help for keyforge-sync

```
USAGE
  $ keyforge-sync help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.6/src/commands/help.ts)_

## `keyforge-sync sync [FILE]`

describe the command here

```
USAGE
  $ keyforge-sync sync [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/sync.ts](https://github.com/funkymonkeymonk/keyforge-sync/blob/v1.0.0/src/commands/sync.ts)_
<!-- commandsstop -->

# TODO
- [X] CI
- [ ] Test coverage
- [ ] Codecov
- [ ] "Easy" credential setup
  - [ ] Decks of Keyforge
  - [ ] Crucible
  - [ ] Master Vault (This may not be doable given existing setup)
- [ ] Multiuser
- [ ] Sync only hearted decks
- [ ] GUI?
