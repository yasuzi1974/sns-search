export async function onRequest(context) {
  const password = context.env.SITE_PASSWORD;

  if (!password) {
    return new Response("Access unavailable", { status: 503 });
  }

  const expected = "Basic " + btoa(
    String.fromCharCode(...new TextEncoder().encode("owner:" + password))
  );

  if (context.request.headers.get("Authorization") !== expected) {
    return new Response("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Private Site", charset="UTF-8"',
        "Cache-Control": "no-store"
      }
    });
  }

  const response = new Response(await context.next());
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
