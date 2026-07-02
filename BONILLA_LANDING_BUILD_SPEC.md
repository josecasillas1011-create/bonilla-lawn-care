# Bonilla Lawn Care — Landing Page Build Spec

**Hand to:** Claude Code | **Owner:** JC | **Timebox:** one evening
**Deal type:** Trade — scope is locked in Section 1. Do not build past it.

---

## 0. Context & Hard Rules

- One-page lead-gen site for Bonilla Lawn Care (landscaping niche, Inland Empire). Mirrors the existing print flyer so print → web message matches.
- Primary conversion = **tap-to-call/text**. The form is the after-hours backup, wired into the Axis CRM (Supabase).
- **Hard rules:** No fake reviews, no fake stats, no stock photos passed off as Bonilla's work, no invented "years in business." If a trust element isn't real, the section is omitted.
- Stack matches Axis infrastructure: vanilla HTML/CSS/JS, Supabase, Netlify with **Git auto-deploy from day one** (marketing-site pattern, not the CRM's manual-deploy pattern).
- Equivalent market value of this deliverable: $500–$1,000 (Tier 1). Treat the trade accordingly — one revision round, then done.

---

## 1. Trade Scope — Lock Before Building

**Included in the trade:**
- One-page site at `bonillalawncare.netlify.app`
- Lead form → Axis CRM
- One revision round after Bonilla sees it
- Launch-week fixes only

**NOT included (quote separately if asked):**
- Custom .com domain + email
- Google Business Profile setup/optimization
- Social content, ads, review-generation system
- Ongoing edits after launch week

**Copy-paste text to send Bonilla (send this BEFORE building):**

> So we're clear on the site trade — it covers: a one-page website (bonillalawncare.netlify.app), the lead form, and one round of changes after you see it. To build it I need from you by [DATE]: your logo file (or I'll recreate it from the flyer), 5+ photos of real jobs (before/afters are best), the cities you serve, your hours, and the email you want leads sent to. Anything past that — Google profile, socials, a .com domain — we can talk about separately.

---

## 2. Stack, Repo, Deploy

```
Repo: bonilla-lawn-care (public — enables free Netlify auto-deploy)

bonilla-lawn-care/
├── index.html
├── styles.css
├── form.js                 ← adapted from landing-page-form.js
├── supabase-client.js      ← copied from CRM repo (same anon key)
├── netlify.toml
├── netlify/functions/
│   └── notify-new-lead.js  ← optional, see Section 3 step 4
└── assets/
    ├── logo.png / logo-white.png
    ├── flyer.png           ← drop the flyer in; sample exact colors from it
    ├── photos/             ← real Bonilla job photos only
    └── favicon.png
```

- Deploy: connect repo to Netlify → verify auto-deploy by pushing a commit before styling anything.
- Site: `bonillalawncare.netlify.app`. Buy the .com only if the relationship graduates past the trade.

---

## 3. Lead Capture Wiring (the part that stalls evening builds — do it first)

**Step 1 — Create the client record.** In Supabase (`AXIS_CRM`, project `dohtzpbbkgmydrfpgupf`) → `clients` table → insert row: name `Bonilla Lawn Care`, contact `[BONILLA_EMAIL]` / `(909) 278-0082`. Copy the UUID.

**Step 2 — Verify RLS.** The form does a direct anon insert into `leads`. Check that an anon INSERT policy exists; if not:

```sql
create policy "anon_insert_leads" on public.leads
  for insert to anon
  with check (true);
```

(Insert-only. Anon must NOT have select/update/delete. Spam protection = honeypot field, Step 3.)

**Step 3 — Configure form.js.** From `landing-page-form.js`:
- `CLIENT_ID = '[CLIENT_UUID]'`, `CLIENT_NAME = 'Bonilla Lawn Care'`
- The `leads` table has no `city` column — do NOT migrate the schema. Fold city into notes: `notes: 'City: ' + city + (notes ? ' — ' + notes : '')`
- Add a hidden honeypot input named `website`; if filled, silently drop the submission.
- `source: 'bonilla-landing'`

**Step 4 — Notifications (optional v1.1).** `email-notifications.js` is ready as a Netlify function but needs a Resend API key + env vars. If time allows: deploy it, set `to:` = JC + `[BONILLA_EMAIL]`, and update its hardcoded `#B11226` maroon (retired palette) to navy `#001A3B`. If skipped: JC checks the CRM daily during launch week and texts leads to Bonilla. Either way, leads land in the CRM — tap-to-call is the primary path regardless.

**Fallback (timebox protection):** If RLS or Supabase fights back past 30 minutes, ship v1 with Netlify Forms (`data-netlify="true"`, email notifications on) and migrate to Supabase in v1.1. Do not let the wiring eat the evening.

---

## 4. Page Structure & Copy (copy-paste ready)

### 4.1 Hero
- Logo top-left. Background: real photo or dark-green panel — no cheesy stock.
- **H1:** `TAKE BACK YOUR YARD`
- **Sub:** `From weeds and overgrown bushes. Professional weed control, bush trimming & monthly maintenance in [CITY], CA.`
- **Primary button:** `Call or Text (562) 756-3592` → `href="tel:+15627563592"`, with a small `Prefer to text?` link → `sms:+15627563592`
- **Secondary button:** `Get a Free Estimate` → anchors to form
- Trust line under buttons: `Free estimates • Fast response` (+ `Licensed & insured` ONLY if true)

### 4.2 Services (flyer copy, verbatim)
Three cards, same icons/order as the flyer:
1. **Weed Control** — Eliminate weeds and help prevent future growth.
2. **Bush Trimming** — Keep shrubs and hedges neat, healthy & shaped.
3. **Monthly Maintenance** — Reliable scheduled service to keep your property looking its best year-round.

### 4.3 Before / After Gallery
- Minimum 4 real Bonilla photos, before/after pairs preferred. Captions: `[Service] — [City]`.
- **If Bonilla hasn't sent photos, this section ships hidden — not with placeholders visible.**

### 4.4 How It Works
1. **Call or text** — Tell us what's going on with your yard.
2. **Free estimate** — We walk the property and give you a straight price.
3. **We handle it** — One-time cleanup or a monthly schedule. Your call.

### 4.5 Reviews (conditional)
Only real Google reviews, quoted with first name + city. Zero reviews → omit the section entirely. (Post-launch: run the review-generation system from `07-review-generation-scripts.md` and add this section in v1.1.)

### 4.6 Quote Form
- Heading: `Get Your Free Estimate`
- Sub: `Fill this out and Bonilla will get back to you within 24 hours — or skip the form and call (562) 756-3592.`
- Fields: Name*, Phone*, City*, Service (select: Weed Control / Bush Trimming / Monthly Maintenance / One-Time Cleanup / Other), Notes (optional), hidden honeypot `website`
- Submit: `Request My Free Estimate`
- Success: `✅ Got it — Bonilla will reach out within 24 hours.`

### 4.7 Footer
- Logo (white version), `Call or Text: (562) 756-3592` • `Office: (909) 278-0082`
- `Serving [CITIES]` • `Hours: [HOURS]`
- `© 2026 Bonilla Lawn Care`

### 4.8 Sticky Mobile Call Bar
Fixed bottom bar, `< 768px` only, appears after scrolling past the hero: bright-green, `📞 Call (562) 756-3592` → `tel:` link. Highest-converting element on the page — don't skip it.

---

## 5. Design System

**Palette (sample exact values from `assets/flyer.png`):**
```css
--green-dark:   #1B3D1F;  /* panels, headings — flyer's forest green */
--green-bright: #7AC142;  /* CTAs, accents — flyer's lawn green */
--black:        #0F0F0F;  /* contact bars */
--off-white:    #F6F5F0;  /* backgrounds */
```

**Type:** Google Fonts — `Anton` (display/H1, uppercase, matches flyer's condensed weight) + `Inter` (body). Two fonts max. Skip trying to replicate the brush-script effect — clean beats gimmicky on web.

**Layout:** Mobile-first. Buttons ≥ 48px tap targets. Section rhythm mirrors the flyer: green hero → white services → dark contact band.

---

## 6. SEO & Schema

- `<title>`: `Bonilla Lawn Care | Weed Control & Bush Trimming in [CITY], CA`
- Meta description: `Professional weed control, bush trimming & monthly yard maintenance in [CITY] and the surrounding [AREA]. Free estimates — call or text (562) 756-3592.`
- One `<h1>` only. Alt text on every photo: `before and after [service] in [city]`.
- OG tags + OG image (hero crop).
- JSON-LD (note: the 5/12 competitor research found none of the top IE landscaping sites have schema — cheap edge):

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Bonilla Lawn Care",
  "telephone": "+15627563592",
  "areaServed": ["[CITY]", "[CITIES]"],
  "description": "Weed control, bush trimming, and monthly yard maintenance in [CITY], CA. Free estimates.",
  "image": "https://bonillalawncare.netlify.app/assets/og-image.jpg"
}
```

---

## 7. Blocking Assets from Bonilla (collect BEFORE the build evening)

- [ ] Logo file (or approval to recreate the leaf wordmark from the flyer)
- [ ] 5+ real job photos (before/after pairs best)
- [ ] Cities served
- [ ] Hours
- [ ] Email address for leads
- [ ] License # if any (omit trust line otherwise)
- [ ] Link to Google profile / any real reviews

---

## 8. Acceptance Checklist

- [ ] `tel:` and `sms:` links fire correctly on a real phone
- [ ] Test form submission appears in Axis CRM under Bonilla within 1 minute
- [ ] Honeypot silently drops a bot-style submission
- [ ] Grep the HTML for `[` — zero placeholders left visible
- [ ] Zero fake trust elements anywhere on the page
- [ ] Push a commit → Netlify auto-deploys (verified, not assumed)
- [ ] Mobile Lighthouse performance ≥ 90 (nice-to-have, not a blocker)

---

## 9. Post-Launch — Convert the Trade into Sales Assets

1. **Review/testimonial from Bonilla for Axis** — ask within 48 hours of launch, while the excitement is fresh.
2. **Written OK to use the site + before/afters as the landscaping case study.** The cold outreach emails (`04-cold-outreach-emails.md`) currently have zero proof to point at — this is the proof link.
3. **Referral ask** using `08-referral-program-framework.md` — landscapers know other landscapers.
4. Add the URL + a QR code to Bonilla's next flyer print run.
5. If the trade relationship is good: quote (don't gift) the next layer — GBP setup, review system, or the $300/mo Local Visibility tier.

---

## Placeholder Index

`[CITY]` `[CITIES]` `[AREA]` `[HOURS]` `[DATE]` `[BONILLA_EMAIL]` `[CLIENT_UUID]` — plus conditional: license line, reviews section, gallery photos.
