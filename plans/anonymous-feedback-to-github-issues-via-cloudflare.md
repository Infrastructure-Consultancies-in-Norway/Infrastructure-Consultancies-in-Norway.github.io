# Anonymous Website Feedback to GitHub Issues via Cloudflare - Implementation Plan

## Problem and proposed approach

The site is a static Vite/React application deployed to GitHub Pages. It can render and validate a custom feedback form, but it cannot safely contain a GitHub credential or create anonymous GitHub issues by itself.

Implement an owned, bilingual feedback widget in the React app and submit to a Cloudflare Worker maintained in this repository. The Worker validates anonymous requests, verifies a Cloudflare Turnstile challenge, uses D1 for minimal rate-limit/idempotency records, holds the GitHub credential as an encrypted Worker secret, and creates a public issue in `Infrastructure-Consultancies-in-Norway/Infrastructure-Consultancies-in-Norway.github.io`.

The initial flow covers:

- A feedback button available throughout the app
- Category selection
- Automatically captured page URL, route/title, language, and deployed app version
- A required feedback description
- A success/error result after submission

Contact details and file attachments are out of scope. Feedback content and captured page context are public once the GitHub issue is created. The API creates issues immediately after validation and abuse checks; moderation remains a documented future option.

Implementation takes place in a sibling git worktree created from `develop` on the `feature/feedback-issues` branch.

## Current-state findings

- `snacks-app/` is React 19 + TypeScript + Vite with Bootstrap styling.
- `snacks-app/src/App.tsx` provides a shared app-level surface suitable for a global widget.
- The app supports Norwegian and English through `LanguageContext` and `translations.ts`.
- Routes include a one-page homepage, contact, properties, glossary detail, and utility pages. Context capture must work for both path routes and homepage hash sections.
- GitHub Pages deploys the static `snacks-app/dist` artifact from `master`.
- The public repository has GitHub Issues enabled but no issue templates or feedback labels.
- Existing contact copy links users to GitHub for feedback, but there is no in-app submission flow.

## Architecture and key decisions

### Browser application

- Add a global `FeedbackWidget` mounted by `App.tsx`.
- Use an accessible dialog with two concise stages: category/context, then description/review.
- Derive context from `window.location`, React Router location, `document.title`, current language, and a build-time version identifier. Show captured context before submission.
- Send a typed JSON request to a build-time-configured `VITE_FEEDBACK_API_URL`.
- Do not collect names, email addresses, cookies, arbitrary hidden fields, or files.
- Add a honeypot and client-side length validation for usability while treating the API as the security boundary.
- Show an explicit success state with the returned issue reference/link and actionable localized errors. Do not claim success if the endpoint fails.

### Cloudflare feedback API

- Define `POST /feedback` with a narrow versioned contract:
  - Request: category enum, description, page URL/path/title, language, app version, honeypot, idempotency key, and Turnstile token.
  - Success: issue number and public issue URL.
  - Errors: stable error code plus a safe user-facing classification; no secret/provider details.
- Restrict methods, content type, request size, accepted origins, field lengths, category values, URL host, and language values.
- Verify a Cloudflare Turnstile token server-side for every submission. Reject filled honeypots and malformed, duplicate, expired, or replayed payloads.
- Use D1 only for short-lived hashed rate-limit keys and idempotency records. Do not duplicate feedback bodies in D1, store tickets as repository commits, or build a second ticket database.
- Apply rate limits to a privacy-conscious keyed hash of Cloudflare-provided network signals. Set an explicit cleanup/retention policy and do not log raw feedback, Turnstile tokens, GitHub credentials, or full IP addresses.
- Create issues through GitHub's REST API using a GitHub App installation token where organizational ownership is available. A fine-grained repository token is acceptable only as a short-lived bootstrap option and must remain in Worker secret storage.
- Generate issue title/body entirely on the server from validated fields, normalize user content, apply managed labels, and place source/context metadata in a separate section.

### Free-tier fit

- Cloudflare Workers Free currently includes 100,000 requests per day and encrypted Worker secrets.
- Cloudflare D1 on Workers Free currently includes 5 million rows read per day, 100,000 rows written per day, and 5 GB total storage.
- Cloudflare Turnstile Free currently permits unlimited verification requests and up to 20 widgets.
- Keep the static site on GitHub Pages; only the feedback endpoint, Turnstile verification, and minimal anti-abuse state run on Cloudflare.

### Worktree workflow

- Perform all source changes, dependency installation, tests, and validation in the sibling worktree.
- Do not copy `node_modules` or build output from the original checkout and do not commit either.
- Keep commits focused so the feature branch can be reviewed or abandoned without disturbing `develop`. No merge, push, or pull request is included unless requested.

## Todos

1. Define the shared feedback contract and Cloudflare resources.
2. Build the bilingual, accessible feedback widget.
3. Implement secure anonymous submission with Turnstile, D1, and GitHub Issues.
4. Configure issue tracking, GitHub Pages, and Worker deployment.
5. Test and verify the complete flow.

## Alternatives retained

- **GitHub-native issue form:** no API or secret, but users must sign in to GitHub.
- **Managed form plus automation:** less custom backend code, but adds another data processor and vendor dependency.
- **Private moderation queue:** safer review flow, but adds retention and reviewer operations.
- **Self-hosted D1 ticket tracker:** feasible, but requires authenticated maintainer APIs, an admin UI, audit behavior, backup/export, and access-control operations. Repository commits must not be used as a ticket database.

## Notes

- Turnstile, D1-backed throttling/idempotency, strict validation, and a kill switch are launch requirements.
- CORS and an origin allowlist are not authentication; server-side validation and throttling remain mandatory.
- Feedback is untrusted user input. Future automation must never execute or interpolate issue text into privileged commands.
- If Cloudflare cannot be approved, use a signed-in GitHub issue form rather than exposing credentials or an unprotected webhook.
- Free-tier references: [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/), [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/), [Worker secrets](https://developers.cloudflare.com/workers/configuration/secrets/), and [Turnstile plans](https://developers.cloudflare.com/turnstile/plans/).
