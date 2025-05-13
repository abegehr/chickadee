# 🐦 Chickadee Analytics

Simple, privacy-focused web analytics you can self-host on Cloudflare.

Deploy with one click:

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/abegehr/chickadee/tree/main/packages/app)

Monorepo:

- `./packages/app` - the service: events endpoint, client script, and dashboard
- `./packages/web` - the landing page: <https://www.chickadee.me>

## Deploy your Own

1. Make sure you have installed the [Cloudflare Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) and authenticated with your Cloudflare account by calling `wrangler login`.
2. Clone the repo: `git clone https://github.com/abegehr/chickadee` and `cd chickadee`.
3. Run `pnpm i` to install the dependencies.
4. Create a new KV namespace on Cloudflare for chickadee: `pnpm app wrangler kv namespace create chickadee` and update the id in `./packages/app/wrangler.toml`. Make sure to keep the binding as "KV" and only update the id of the KV namespace.
5. Run `pnpm app run deploy` to deploy the service to Cloudflare.
6. Make note of your worker URL: `https://<your-worker-name>.workers.dev`.
7. Set all secrets listed in the [Secrets](#secrets) section on you worker: `pnpm app wrangler secret put …`.
8. Open your worker URL in your browser and login with username `admin` and password `BASIC_PASSWORD` configured in step 6.

## Development

### Secrets

Copy `./packages/app/.dev.vars.example` to `./packages/app/.dev.vars` and set the following secrets:

- `ACCOUNT_ID` - your Cloudflare account ID, find it on the [Cloudflare dashboard](https://dash.cloudflare.com) under Workers & Pages on the right side.
- `CLOUDFLARE_API_TOKEN` - Cloudflare account token with "Access: Analytics" Read permission: <https://developers.cloudflare.com/analytics/analytics-engine/get-started/#create-an-api-token>
- `BASIC_PASSWORD` - the password for basic auth to access the dashboard (optional but recommended, since otherwise anyone can view your stats)

## Inspired by

- <http://plausible.io>
- <https://counterscale.dev>
- <https://withcabin.com>
- <https://matomo.org>

### Daily Unique Visitor Count

To count daily unique visitors without cookies, we use a fingerprint hash that rotates daily:

`hash(daily_salt + sid + ip + userAgent + acceptLanguage)`

Props to Plausible.io for the concept: <https://plausible.io/data-policy#how-we-count-unique-users-without-cookies>.

## TODOs

- [x] landing page
- [x] events endpoint
- [x] script for client-side page views
- [x] count daily unique visitors
- [x] dashboard with graphs
- [x] demo dashboard
- [ ] cli for easy deployment
- [ ] live-mode
- [ ] page with grid of all sites
- [ ] add loadTime metric to dashboard
- [ ] add screen size to dashboard?
- [ ] filter dashboard by dimensions
- [ ] add retention to dashboard (based on user id)
