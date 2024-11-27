# withstudiocms/automations

Our Automation workflows

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

## first-time-pr

### Usage
```yml
name: First time PR merged Check

on: 
  pull_request:
    types: [closed]

jobs:
  welcome:
    if: ${{ github.repository_owner == 'withstudiocms' }}
    uses: withstudiocms/automations/.github/workflows/first-time-pr.yml@main
    secrets:
      SERVICE_TOKEN: ${{ secrets.STUDIOCMS_SERVICE_TOKEN }}
      DISCORD_WEBHOOK: ${{ secrets.DISCORD_WEBHOOK_MERGEBOT }}
      DISCORD_ROLE_HONOURED: ${{ secrets.DISCORD_ROLE_HONOURED }}
      DISCORD_ROLE_REVERED: ${{ secrets.DISCORD_ROLE_REVERED }}
      DISCORD_ROLE_EXALTED: ${{ secrets.DISCORD_ROLE_EXALTED }}
```


## Acknowledgements

### MergeBot
This is a "Fork" of [bombshell-dev/automation](https://github.com/bombshell-dev/automation)

This repository borrows heavily from [`withastro/automation`](https://github.com/withastro/automation), published under the MIT License&mdash;Copyright (c) 2023 Astro.
