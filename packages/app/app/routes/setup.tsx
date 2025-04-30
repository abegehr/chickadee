import { Fragment } from "hono/jsx/jsx-runtime";
import { createRoute } from "honox/factory";
import { ZSid } from "../lib/models";
import { addSite } from "../lib/kv";

export const POST = createRoute(async (c) => {
  const body = await c.req.parseBody();
  const parsed = ZSid.safeParse(body.sid);

  // demo
  if (c.env.ENVIRONMENT === "demo") {
    return c.render(
      <article class="prose prose-lg text-center max-w-full">
        <h1>Demo Mode</h1>
        <p>
          Chickadee is currently in demo mode. Setting up new sites is disabled.
        </p>
        <p>This is a read-only demonstration of the dashboard functionality.</p>
        <a href="/" class="btn btn-primary btn-xl btn-wide">
          Return to Dashboard
        </a>
      </article>,
      { class: "justify-center items-center" },
    );
  }

  // parsing failed
  if (!parsed.success) {
    const error = parsed.error.format()._errors.join(" ");
    return c.render(
      <article class="prose prose-lg text-center max-w-full">
        <h1>Invalid Site Identifier</h1>
        <pre>{body.sid}</pre>
        <p class="text-error">{error}</p>
        <a href="/setup" class="btn btn-primary btn-xl btn-wide">
          Back
        </a>
      </article>,
      { class: "justify-center items-center" },
    );
  }

  // add site
  const sid = parsed.data;
  await addSite(c, sid);
  const script = `
<script
  defer
  data-domain="${sid}"
  src="https://[WORKER_DOMAIN].workers.dev/script.js"
></script>`;
  return c.render(
    <article class="prose prose-lg text-center max-w-full">
      <h1>Setup Complete</h1>
      <p>Add the following script to your website:</p>
      <pre class="relative text-start">
        {script}
        <button
          type="button"
          class="btn btn-ghost btn-sm btn-square absolute right-2 top-2"
          onclick="navigator.clipboard.writeText(this.parentElement.textContent)"
        >
          <span class="icon-[carbon--copy] text-base" />
        </button>
      </pre>
      <a href={`/${sid}`} class="btn btn-primary btn-xl btn-wide">
        Go to site
      </a>
    </article>,
    { class: "justify-center items-center" },
  );
});

export default createRoute(async (c) => {
  return c.render(
    <Fragment>
      <article class="prose prose-lg text-center max-w-full">
        <h1>Setup a Site</h1>
        <p>Enter the domain or subdomain you'd like to add.</p>
      </article>

      <form
        class="flex flex-col gap-4 max-w-xs items-center w-full"
        method="post"
      >
        <label class="input">
          <span class="icon-[carbon--link] scale-150" />
          <input
            name="sid"
            type="text"
            class="grow"
            placeholder="chickadee.me"
          />
        </label>
        <p class="label text-xs">letters, numbers, dots, and hyphens</p>

        <button type="submit" class="btn btn-primary btn-xl btn-wide">
          Setup
        </button>
      </form>
    </Fragment>,
    { class: "justify-center items-center" },
  );
});
