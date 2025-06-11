async function trackPageView() {
  const script = document.currentScript;
  const ep = new URL(`/api/events`, script.src);

  const d = (
    script.getAttribute("data-domain") ?? window.location.hostname
  ).toLowerCase();
  const u = window.location.href;
  const url = new URL(u);
  const r = url.searchParams.get("ref") ?? document.referrer;
  const w = window.screen.width; // device screen width
  const t = performance.now(); // load time of the page
  const body = { d, u, r, w, t };
  console.debug("Chickadee Page View:", ep.href, body);

  try {
    const res = await fetch(ep, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.text();
    console.debug("Chickadee ->", data);
  } catch (err) {
    console.error("Chickadee Error:", err);
  }
}

trackPageView(); // TODO auto-track client-side navigation?
