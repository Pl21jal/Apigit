const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const value = body.value;

    if (!value) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Value tidak boleh kosong" }),
      };
    }

    const repoOwner = process.env.GITHUB_OWNER;
    const repoName = process.env.GITHUB_REPO;
    const token = process.env.GITHUB_TOKEN;
    const filePath = "data.json";

    // Ambil isi file lama dari GitHub
    const getRes = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      {
        headers: {
          Authorization: `token ${token}`,
          "User-Agent": "NetlifyFunction",
        },
      }
    );

    if (!getRes.ok) {
      const errText = await getRes.text();
      return {
        statusCode: getRes.status,
        body: JSON.stringify({ error: "Gagal ambil file", details: errText }),
      };
    }

    const fileData = await getRes.json();
    const sha = fileData.sha;

    // Data baru
    const newContent = Buffer.from(JSON.stringify({ value })).toString("base64");

    // Update file di GitHub
    const updateRes = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${token}`,
          "User-Agent": "NetlifyFunction",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Update value",
          content: newContent,
          sha: sha,
        }),
      }
    );

    if (!updateRes.ok) {
      const errText = await updateRes.text();
      return {
        statusCode: updateRes.status,
        body: JSON.stringify({
          error: "Gagal update file",
          details: errText,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
