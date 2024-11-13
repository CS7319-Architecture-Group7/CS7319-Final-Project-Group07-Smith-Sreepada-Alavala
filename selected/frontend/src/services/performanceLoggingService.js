export async function logPerformance(method, start, end, delta) {
  const url = process.env.REACT_APP_API_BASE_URL;
  await fetch(`${url}/performance`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      method: method,
      start: start,
      end: end,
      delta: delta,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      console.log("Performance logged: ", response);
    })
    .catch((error) => {
      console.log("Error logging performance: ", error);
    });
}
