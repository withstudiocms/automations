# mergebot
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
    uses: withstudiocms/mergebot/.github/workflows/mergebot.yml@main
    secrets:
      DISCORD_WEBHOOK: ${{ secrets.DISCORD_WEBHOOK_MERGEBOT }}
```

## Acknowledgements

This is a "Fork" of [bombshell-dev/automation](https://github.com/bombshell-dev/automation)

This repository borrows heavily from [`withastro/automation`](https://github.com/withastro/automation), published under the MIT License&mdash;Copyright (c) 2023 Astro.
