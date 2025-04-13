import { Hono } from "hono";
import { renderer } from "./renderer";

const app = new Hono();

app.use(renderer);

app.get("/", (c) => {
  return c.render(
    <article class="prose lg:prose-xl">
      <h1>Hello!</h1>
    </article>,
  );
});

export default app;
