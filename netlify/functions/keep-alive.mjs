// Runs once a day on Netlify. A trivial query counts as database activity, so the
// Supabase free tier doesn't pause the project after a week of no use.
import pg from "pg";

const keepAlive = async () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("keep-alive: DATABASE_URL is not set");
    return new Response("DATABASE_URL is not set", { status: 500 });
  }

  const client = new pg.Client({ connectionString: url });
  try {
    await client.connect();
    await client.query("select 1");
    console.log("keep-alive: database ping ok");
    return new Response("ok");
  } catch (err) {
    console.error("keep-alive: database ping failed", err.message);
    return new Response("ping failed", { status: 500 });
  } finally {
    await client.end().catch(() => {});
  }
};

export default keepAlive;

export const config = {
  schedule: "@daily",
};
