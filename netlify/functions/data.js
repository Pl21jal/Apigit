let myData = { message: "Hello world" };

export async function handler(event) {
  if (event.httpMethod === "GET") {
    // Ambil data
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(myData),
    };
  }

  if (event.httpMethod === "POST") {
    try {
      // Terima data dari body
      const body = JSON.parse(event.body);
      myData = { ...myData, ...body }; // update data

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "updated", data: myData }),
      };
    } catch (e) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Invalid JSON" }),
      };
    }
  }

  return { statusCode: 405, body: "Method Not Allowed" };
}
