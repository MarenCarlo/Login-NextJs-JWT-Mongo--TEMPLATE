import Cookies from 'js-cookie'
const serverURL = process.env.NEXT_PUBLIC_SV_URL;

export async function consumeService({ url, method, body = null }) {
  const authToken = Cookies.get("token");
  const baseUrl = `${serverURL}${url}`;
  if (authToken) {
    const res = await fetch(baseUrl, {
      method,
      body,
      headers: {
        'authorization': `${authToken}`,
        'accept': 'application/json',
        'content-type': 'application/json',
      }
    });
    if (res.status === 401) {
      window.location.href = '/';
    }
    const content = await res.json();
    return content;
  } else {
    const res = await fetch(baseUrl, {
      method,
      body,
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
      }
    })
    if (res.status === 401) {
      window.location.href = '/';
    }
    const content = await res.json();
    return content;
  }
}