const {
	GITHUB_ACTION,
	GITHUB_EVENT_NAME,
	GITHUB_EVENT_PATH,
	DISCORD_WEBHOOK,
	DISCORD_MESSAGE,
	DISCORD_MESSAGE_EMBEDS,
	DISCORD_USERNAME,
	DISCORD_AVATAR,
} = process.env;
if (!GITHUB_ACTION || !DISCORD_WEBHOOK) {
	throw new Error(
		`Missing input.\nRequired environment variables: GITHUB_ACTION, GITHUB_EVENT_NAME, DISCORD_WEBHOOK\n\nAvailable environment variables: ${Object.keys(
			process.env,
		).join(", ")}\n`,
	);
}

console.log("DISCORD_MESSAGE", DISCORD_MESSAGE);
console.log("DISCORD_MESSAGE_EMBEDS", DISCORD_MESSAGE_EMBEDS);

function parseDiscordEmbeds(jsonString) {
    try {
        // Fix common JSON formatting issues:
        const fixedJsonString = jsonString
            .replace(/,\s*}/g, '}') // Remove trailing commas in objects
            .replace(/,\s*]/g, ']') // Remove trailing commas in arrays
            .replace(/\\n/g, '')    // Remove literal newline escape sequences
            .replace(/'/g, '"');    // Replace single quotes with double quotes (for JSON)

        // Parse the fixed JSON string
        return JSON.parse(fixedJsonString);
    } catch (error) {
        throw new Error(`Failed to parse JSON: ${error.message}`);
    }
}

function getBody() {
	if (DISCORD_MESSAGE_EMBEDS) {
		if (DISCORD_MESSAGE) {
			return {
				content: DISCORD_MESSAGE,
				embeds: parseDiscordEmbeds(DISCORD_MESSAGE_EMBEDS),
			};
		}
		return {
			content: "",
			embeds: DISCORD_MESSAGE_EMBEDS,
		};
	}
	return {
		content: DISCORD_MESSAGE,
	}
}

const body = getBody();

console.log("MESSAGE_BODY", body);

if (DISCORD_USERNAME) {
	body.username = DISCORD_USERNAME;
}
if (DISCORD_AVATAR) {
	body.avatar_url = DISCORD_AVATAR;
}
const headers = {
	"Content-Type": "application/json",
	"X-GitHub-Event": GITHUB_EVENT_NAME,
};

await fetch(`${DISCORD_WEBHOOK}?wait=true`, {
	body: JSON.stringify(body),
	headers,
	method: "POST",
});
