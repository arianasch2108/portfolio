# Portfolio analytics setup

## Create the property
1. In Google Analytics, create an account/property named Ariana Sierra-Chacón Portfolio. Use the United States / New York reporting timezone. Do not connect Google Ads; leave optional Google account data-sharing features off.
2. Create a Web data stream for https://www.ascdigitalstrategy.com. Copy its G-… measurement ID.
3. In the web stream, enable **Enhanced measurement**, then open its settings and enable **Scrolls** only among the optional measurements. Disable outbound clicks, site search, video engagement, file downloads, and form interactions. Under Page views → Advanced settings, disable page changes based on browser history events. The implementation suppresses the initial automatic page view with `send_page_view: false` and sends its own sanitized page view and controlled click events; GA4 still provides automatic engagement measurement. Save these settings before enabling production tracking. Do not install a second tag through GTM, Vercel, or another integration.
4. Under data collection, keep Google Signals and user-provided data collection off. Disable granular location/device collection if you don't need it. Do not enable advertising integrations.
5. Under data retention, select **2 months** for event/user data and disable “Reset user data on new activity.” This retention setting does not remove standard aggregated reports after two months.
6. Add event-scoped custom dimensions: `project_slug`, `link_location`, and `cta_action`. Use those exact parameter names. Avoid marking all clicks as key events; optionally mark `portfolio_cta_click` once you understand what it records.

## Enable only in production
The public measurement ID `G-GD3PVMX91G` is configured through `PUBLIC_GA_MEASUREMENT_ID` in the tracked `.env.production` file. Astro loads it for production builds; development stays unconfigured. Vercel environment variables can override this value, so remove any stale or blank override before deploying. Set `SITE_URL=https://www.ascdigitalstrategy.com` in Vercel's Production environment, then rebuild/deploy. Preview deployments and local hostnames remain blocked by the integration. No account credentials belong in this repository.

Both a production build and an HTTPS production hostname (www.ascdigitalstrategy.com or ascdigitalstrategy.com) are required. Vercel preview deployments are excluded. Without a valid ID, the banner and Cookie settings control stay inactive. The privacy page remains available.

Before enabling tracking, complete the account settings above and review the privacy page against those settings and your actual use. The six-month preference lifetime is a product default, not a statement that every jurisdiction has the same legal requirement.

## Consent behavior
No Google tag or analytics request loads until acceptance. Advertising consent stays denied. A versioned localStorage record (`portfolio-analytics-consent`) stores choice and expiry for 183 days; blocked storage falls back to page-memory only. Reject and accept have equal prominence. The banner is not modal and does not block browsing.

Withdrawal disables this property's collection, removes accessible _ga and property cookies, then reloads. Reloading also handles already-running Google code. Existing collection in other tabs is disabled through storage events. Changes made while storage is blocked cannot synchronize across tabs. No pre-consent actions are replayed. Requests already in flight cannot be recalled.

## Read your reports
- **Realtime:** accept analytics, open a project, then check the active page and custom events. Use a clean browser without blockers for this check. Do not enable debug mode for all visitors.
- **Engagement → Pages and screens:** use Page path to compare project page views and average engagement time. Titles in analytics intentionally use controlled paths, not potentially variable text. Engagement is time in focus, not all time a tab exists.
- **Engagement → Events → scroll:** see visits that reached 90% of the page. In Explore, filter Event name to `scroll` and break down by Page path to compare projects. This is one threshold per page, not 25%/50%/75% depth tracking, and does not measure scrolling inside phone or laptop mockups. It runs only after analytics consent.
- **Explore → Free form:** compare `project_click` by `project_slug` and `link_location`; compare `portfolio_cta_click` by `cta_action` and `link_location`. Custom dimensions/report processing are not instantaneous.
- `cta_action`: resume_page, resume_pdf, email, linkedin. `link_location`: header, footer, home_intro, project_card, page_content.
- CTA clicks indicate interest, not a completed email, job opportunity, PDF read, or LinkedIn visit. Declined consent, blockers, failed network requests, and immediate navigation can reduce totals. Don't delay navigation to force event delivery.

## Validation
Run `pnpm check` and `pnpm build`. For browser tests use a production build with a fake measurement ID and route **all** production-host and Google requests to local fixtures/mocks; never send test traffic to Google. There is no runtime test bypass in the application.

Verify no tag/cookies before consent or after rejection; accept produces one page_view per document; revisiting settings doesn't duplicate initialization; controlled click events fire once without preventing link actions; query/fragment/email values are absent from payloads. Verify expiry, withdrawal, blocked storage, cross-tab updates, pageshow restoration, narrow screens, keyboard controls, and no overlap with Back to top.

After deployment, verify the real measurement ID in network requests and GA4 Realtime. With consent accepted, scroll a long project page past 90% and confirm one `scroll` event; confirm no scroll requests before acceptance or after rejection. This requires the actual web-stream Scrolls setting and is not covered by the mocked Google tag. Until that check is complete, describe the integration as implemented but not verified live.

## References
- https://support.google.com/analytics/answer/9216061
- https://developers.google.com/tag-platform/security/concepts/consent-mode
- https://developers.google.com/tag-platform/security/guides/consent
- https://support.google.com/analytics/answer/11109416

### Run the mocked browser suite
With Playwright installed in your development environment:
```sh
PUBLIC_GA_MEASUREMENT_ID=G-TEST12345 SITE_URL=https://www.ascdigitalstrategy.com VERCEL_ENV=production pnpm build
node tests/analytics-consent.cjs
```
If Playwright is provided by a bundled runtime, set `PLAYWRIGHT_MODULE` to its module directory. The suite serves `dist` through browser request interception and mocks the Google tag and collection endpoint; it does not test Google's internal implementation or report delivery. Rebuild without the fake ID override before any deployment to restore the configured production ID. Test real delivery separately after deployment.
