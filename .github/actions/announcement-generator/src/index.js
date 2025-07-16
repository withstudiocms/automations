import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { glob } from 'tinyglobby';
import * as core from "@actions/core";
import * as github from "@actions/github";

const emojis = ['🎉', '🥳', '🚀', '🧑', '🎊', '🏆', '✅', '🤩', '🤖', '🙌'];
const descriptors = [
    'new releases',
    'hot and fresh updates',
    'shiny updates',
    'exciting changes',
    'package updates',
    'awesome updates',
    'bug fixes and features',
    'updates',
];
const verbs = [
    'just went out!',
    'just launched!',
    'now available!',
    'in the wild!',
    'now live!',
    'hit the registry!',
    'to share!',
    'for you!',
    'for y’all! 🤠',
    'comin’ your way!',
    'comin’ atcha!',
    'comin’ in hot!',
    'freshly minted on the blockchain! (jk)',
    '[is] out (now with 100% more reticulated splines!)',
    '(as seen on TV!)',
    'just dropped!',
    '– artisanally hand-crafted just for you.',
    '– oh happy day!',
    '– enjoy!',
    'now out. Be the first on your block to download!',
    'made with love 💕',
    '[is] out! Our best [version] yet!',
    '[is] here. DOWNLOAD! DOWNLOAD! DOWNLOAD!',
    '... HUZZAH!',
    '[has] landed!',
    'landed! The internet just got a little more fun.',
    '– from our family to yours.',
    '– go forth and build!',
];
const extraVerbs = [
    'new',
    'here',
    'released',
    'freshly made',
    'going out',
    'hitting the registry',
    'available',
    'live now',
    'hot and fresh',
    'for you',
    "comin' atcha",
];

function item(items) {
    return items[Math.floor(Math.random() * items.length)];
}

const plurals = new Map([
    ['is', 'are'],
    ['has', 'have'],
]);

function pluralize(text) {
    return text.replace(/(\[([^\]]+)\])/gm, (_, _full, match) =>
        plurals.has(match) ? plurals.get(match) : `${match}s`
    );
}

function singularize(text) {
    return text.replace(/(\[([^\]]+)\])/gm, (_, _full, match) => `${match}`);
}

try {
    const GITHUB_REF = github.context.ref;
    const GITHUB_REPO = github.context.repo;

    const baseUrl = new URL(`https://github.com/${GITHUB_REPO.owner}/${GITHUB_REPO.repo}/blob/${GITHUB_REF}/`);

    const packageMap = new Map();
    async function generatePackageMap() {
        const packageRoot = new URL( process.cwd());
        const packages = await glob(['*/package.json', '*/*/package.json'], {
            cwd: fileURLToPath(packageRoot),
            expandDirectories: false,
            ignore: ['**/node_modules/**'],
        });
        await Promise.all(
            packages.map(async (pkg) => {
                const pkgFile = fileURLToPath(new URL(pkg, packageRoot));
                const content = await readFile(pkgFile).then((res) => JSON.parse(res.toString()));
                packageMap.set(content.name, `./packages/${pkg.replace('/package.json', '')}`);
            })
        );
    }

    async function generateMessage() {
        await generatePackageMap();
        const releases = core.getInput('published-packages');
        let data;
        try {
            data = JSON.parse(releases);
        } catch (error) {
            throw new Error(`Invalid JSON in published-packages input: ${error.message}`);
        }
        const packages = await Promise.all(
            data.map(({ name, version }) => {
                const p = packageMap.get(name);
                if (!p) {
                    throw new Error(`Unable to find entrypoint for "${name}"!`);
                }
                return {
                    name,
                    version,
                    url: new URL(`${p}/CHANGELOG.md#${version.replace(/\./g, '')}`, baseUrl).toString(),
                };
            })
        );

        const emoji = item(emojis);
        const descriptor = item(descriptors);
        const verb = item(verbs);

        const discordRoleId = core.getInput('discord-role-id') || '1309310416362537020';

        let message = `<@&${discordRoleId}>\n`;

        if (packages.length === 1) {
            const { name, version, url } = packages[0];
            message += `${emoji} \`${name}@${version}\` ${singularize(
                verb
            )}\nRead the [release notes →](<${url}>)\n`;
        } else {
            message += `${emoji} Some ${descriptor} ${pluralize(verb)}\n\n`;
            for (const { name, version, url } of packages) {
                message += `• \`${name}@${version}\` Read the [release notes →](<${url}>)\n`;
            }
        }

        if (message.length < 2000) {
            return message;
        }
        const { name, version, url } = packages.find((pkg) => pkg.name === 'astro') ?? packages[0];
        message = `${emoji} Some ${descriptor} ${pluralize(verb)}\n\n`;
        message += `• \`${name}@${version}\` Read the [release notes →](<${url}>)\n`;

        message += `\nAlso ${item(extraVerbs)}:`;

        const remainingPackages = packages.filter((p) => p.name !== name);
        for (const { name, version, _url } of remainingPackages) {
            message += `\n• \`${name}@${version}\``;
        }

        if (message.length < 2000) {
            return message;
        }
        message = `${emoji} Some ${descriptor} ${pluralize(verb)}\n\n`;
        message += `• \`${name}@${version}\` Read the [release notes →](<${url}>)\n`;

        message += `\n\nAlso ${item(extraVerbs)}: ${remainingPackages.length} other packages!`;
        return message;
    }

    const content = await generateMessage();
    core.info(content);
    core.setOutput('DISCORD_MESSAGE', content);
} catch (error) {
    core.setFailed(error.message);
}