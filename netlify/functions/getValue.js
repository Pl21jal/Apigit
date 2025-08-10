const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    let key = event.queryStringParameters.key || "defaultKey"; // default key
    const GITHUB_OWNER = process.env.GITHUB_OWNER;
    const GITHUB_REPO = process.env.GITHUB_REPO;
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/data/${key}.json`;

    const response = await fetch(url, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });

    if (!response.ok) {
      return { statusCode: response.status, body: JSON.stringify({ error: "Data not found" }) };
    }

    const data = await response.json();
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    return { statusCode: 200, body: content };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
