const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    let key = event.queryStringParameters.key || "defaultKey"; // default key
    const body = JSON.parse(event.body);
    const value = body.value;

    const GITHUB_OWNER = process.env.GITHUB_OWNER;
    const GITHUB_REPO = process.env.GITHUB_REPO;
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

    const path = `data/${key}.json`;
    const getUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;

    let sha;
    const getResponse = await fetch(getUrl, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });

    if (getResponse.ok) {
      const fileData = await getResponse.json();
      sha = fileData.sha;
    }

    const putResponse = await fetch(getUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: `Update ${key}`,
        content: Buffer.from(JSON.stringify({ value })).toString("base64"),
        sha
      })
    });

    if (!putResponse.ok) {
      throw new Error(`Failed to save data: ${putResponse.statusText}`);
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
