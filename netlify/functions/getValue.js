exports.handler = async (event) => {
  const params = event.queryStringParameters;
  const key = params.key;

  if (!key) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Key is required" })
    };
  }

  globalThis.tempData = globalThis.tempData || {};
  const stored = globalThis.tempData[key];

  if (!stored) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Not found" })
    };
  }

  // Data dianggap valid selama <= 5 menit
  const FIVE_MINUTES = 5 * 60 * 1000;
  if (Date.now() - stored.timestamp > FIVE_MINUTES) {
    delete globalThis.tempData[key];
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Expired" })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ value: stored.value })
  };
};
