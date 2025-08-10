import fetch from 'node-fetch';

export async function handler() {
  const repoOwner = process.env.GITHUB_OWNER;
  const repoName = process.env.GITHUB_REPO;
  const filePath = 'data.json';
  const token = process.env.GITHUB_TOKEN;

  try {
    const res = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3.raw'
      }
    });
    if (!res.ok) throw new Error('Gagal membaca file');
    const data = await res.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
