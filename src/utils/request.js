export const request = (url, args = {}) => {
  const { method = "GET", body } = args;
  let headers = {};
  if(method === 'POST' || method === "DELETE") {
    headers = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  }
  return fetch(url, { method, body: JSON.stringify(body), ...headers }).then(r => r.json())
};
