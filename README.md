# withstudiocms/automations

Our Automation workflows

## actions/install

Setups up Node, and pnpm for StudioCMS workflows

### Usage

Example usage of the Install action, being used in a format workflow

```yml
name: Format code

on:
  push:
    branches: [main]

jobs:
  format:
    name: Format Code
    runs-on: ubuntu-latest
    env:
      NODE_OPTIONS: "--max_old_space_size=4096"
    steps:
      - name: Checkout Repo
        uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          ref: ${{ github.head_ref }}
          token: ${{ secrets.STUDIOCMS_SERVICE_TOKEN }}

      - name: Install Tools & Dependencies
        uses: withstudiocms/automations/.github/actions/install@main

      - name: Format code
        run: pnpm run lint:fix

      - name: Commit changes
        uses: stefanzweifel/git-auto-commit-action@778341af668090896ca464160c2def5d1d1a3eb0 # v6.0.1
        with:
          commit_message: '[ci] lint'
          branch: ${{ github.head_ref }}
          commit_user_name: studiocms-no-reply
          commit_user_email: no-reply@studiocms.dev
          commit_author: StudioCMS <no-reply@studiocms.dev>
```

## releasebot

TODO: Update this with information after testing

## mergebot

Posts a celebratory message in a Discord channel of your choice for each commit

This workflow posts a celebratory message in a Discord channel of your choice for each commit. For example:

> 🥳 Merged! user-a: commit (#001)
> With essential contributions from user-b and user-c! 💣

### Usage

```yml
name: mergebot

on:
  push:
    branches: [main]

jobs:
  mergebot:
    if: ${{ github.repository_owner == 'withstudiocms' }}
    uses: withstudiocms/automations/.github/workflows/mergebot.yml@main
    secrets:
      DISCORD_WEBHOOK: ${{ secrets.DISCORD_WEBHOOK_MERGEBOT }}
```

## Acknowledgements

### MergeBot
This is a "Fork" of [bombshell-dev/automation](https://github.com/bombshell-dev/automation)

This repository borrows heavily from [`withastro/automation`](https://github.com/withastro/automation), published under the MIT License&mdash;Copyright (c) 2023 Astro.
