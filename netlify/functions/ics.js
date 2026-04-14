exports.handler = async (event) => {
  const p = event.queryStringParameters || {};
  
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(p)
  };
};
