import fetch from 'node-fetch';

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const repoOwner = process.env.GITHUB_OWNER;
  const repoName = process.env.GITHUB_REPO;
  const filePath = 'data.json';
  const token = process.env.GITHUB_TOKEN;

  try {
    const body = JSON.parse(event.body);
    const newValue = { value: body.value };

    // Get SHA dari file lama
    const getRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
      headers: { Authorization: `token ${token}` }
    });
    const getData = await getRes.json();
    const sha = getData.sha;

    // Update file di GitHub
    const updateRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Update value',
        content: Buffer.from(JSON.stringify(newValue)).toString('base64'),
        sha
      })
    });

    if (!updateRes.ok) throw new Error('Gagal update file');

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, value: newValue })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
