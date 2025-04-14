import { Hono } from "hono";
import { renderer } from "./renderer";

const app = new Hono();

app.use(renderer);

app.get("*", (c) => {
  return c.render(
    <article class="prose lg:prose-xl">
      <h1>Hello Test!</h1>
      <a href="./test/test">Test</a>
    </article>,
  );
});

export default app;
