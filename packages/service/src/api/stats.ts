import { type Context, Hono } from "hono";
import type { Bindings, Env } from "..";
import { cors } from "hono/cors";
import { basicAuth } from "hono/basic-auth";

const app = new Hono<Env>();

// auth
app.use((c, next) =>
  basicAuth({
    username: c.env.BASIC_USERNAME,
    password: c.env.BASIC_PASSWORD,
  })(c, next)
);

// cors
app.use(
  // TODO! how to cors for dashboard?
  cors({
    origin: "*", // allow all origins
    allowMethods: ["OPTIONS", "GET", "POST"],
  })
);

// get stats for dashboard
app.get("/", async (c) => {
  return c.json(await getStats(c));
});

// helpers

// TODO! how to query?
async function getStats(c: Context<Env>) {
  const data = await query(
    c.env,
    `
    SELECT *
    FROM chickadee
    WHERE timestamp > NOW() - INTERVAL '7' DAY AND timestamp > toDateTime('2025-04-16 12:30:00')
    ORDER BY timestamp DESC
    `
  );
  console.debug("getStats - data:", data);
  return { data };
}

async function query(
  env: Pick<Bindings, "ACCOUNT_ID" | "API_TOKEN">,
  query: string
) {
  const ep = `https://api.cloudflare.com/client/v4/accounts/${env.ACCOUNT_ID}/analytics_engine/sql`;
  const res = await fetch(ep, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.API_TOKEN}`,
    },
    body: query,
  });

  // handle error
  if (!res.ok) {
    const err = await res.text();
    console.error("query - Error:", err);
    throw err;
  }

  // return data
  const data = await res.json();
  console.debug("query ->", data);
  return data;
}

export default app;
