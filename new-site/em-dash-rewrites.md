# Em-dash rewrites: proposals

Scope: about.html, app.html, community.html, tools.html. Visible copy, metadata, JSON-LD and attribute values only. Comments, prototypes and JS files excluded. journal.html and index.html excluded.

48 occurrences on 45 lines. Every proposal keeps the meaning as it stands and changes nothing beyond removing the dash. Fix type is given per item: **stop** (full stop, new sentence), **comma**, or **rewrite** (used only where the dashed clause begins with "and", since a stop would give ". And" and a comma would give ", and").

Line numbers are current as of this file being written. Nothing has been edited.

---

## about.html (11)

**L7** meta description · stop
- Now: Steel is forged with fire — so are you.
- Proposed: Steel is forged with fire. So are you.
- Note: now matches the slogan form used in og:description and the JSON-LD slogan exactly.

**L13** og:description · stop
- Now: Fire, pressure, transformation — the philosophy behind FORGE.
- Proposed: Fire, pressure, transformation. The philosophy behind FORGE.

**L27** JSON-LD Organization description · stop
- Now: It makes FORGE: a 90-day accountability journal and an AI journal and coaching app — two independent, complete products built on one philosophy.
- Proposed: It makes FORGE: a 90-day accountability journal and an AI journal and coaching app. Two independent, complete products built on one philosophy.

**L79** hero sub · stop
- Now: He's built — with heat, with pressure, one honest day at a time.
- Proposed: He's built. With heat, with pressure, one honest day at a time.

**L88** story lead · stop
- Now: I didn't set out to build a brand — I set out to build the thing I couldn't find.
- Proposed: I didn't set out to build a brand. I set out to build the thing I couldn't find.

**L89** story · stop
- Now: Two products, one philosophy — use whichever one you'll actually pick up, and bridge them if you want to.
- Proposed: Two products, one philosophy. Use whichever one you'll actually pick up, and bridge them if you want to.
- Flag: the existing ", and bridge them" later in this sentence is left as is. See the list at the end.

**L98** philosophy lead · rewrite (dashed clause begins with "and")
- Now: That's the whole difference — and the whole point.
- Proposed: That's the whole difference. The whole point.

**L101** Pressure step · stop
- Now: Pressure isn't punishment — it's the force that gives shape.
- Proposed: Pressure isn't punishment. It's the force that gives shape.

**L112** manifesto · stop
- Now: We make tools for the long way round — the only way that's ever worked.
- Proposed: We make tools for the long way round. The only way that's ever worked.

**L125** Journal card · stop
- Now: Complete on its own — no screen required.
- Proposed: Complete on its own. No screen required.

**L131** App card · stop
- Now: Complete on its own — pre-launch on iOS.
- Proposed: Complete on its own. Pre-launch on iOS.

---

## app.html (21 on 18 lines)

**L7** meta description · stop
- Now: Type your daily check-in and get coached back from your own words — AI reflections, guided breathwork, and meditation generated for the day you actually had.
- Proposed: Type your daily check-in and get coached back from your own words. AI reflections, guided breathwork, and meditation generated for the day you actually had.

**L34** JSON-LD FAQ answer · stop
- Now: If you choose to use both, you can scan handwritten pages and get coached from your own handwriting — that bridge is optional.
- Proposed: If you choose to use both, you can scan handwritten pages and get coached from your own handwriting. That bridge is optional.
- Pair flag: see L328 below. These two already differ from each other.

**L94** hero sub · stop
- Now: Get coached back from your own words — not a template.
- Proposed: Get coached back from your own words. Not a template.

**L112** hero coach reply · rewrite (dashed clause begins with "and")
- Now: Three times this week — and each one after a short night. That isn't temper. That's sleep.
- Proposed: Three times this week. Each one after a short night. That isn't temper. That's sleep.
- Note: app-hero.js splits this reply into per-word spans for the typing effect. Punctuation changes are safe for it. The same line exists in forge-hero.html, which is out of scope.

**L126** pipeline lead · comma pair (two dashes)
- Now: However you write — typed into the app or handwritten in the FORGE Journal — you enter the same reflection system.
- Proposed: However you write, typed into the app or handwritten in the FORGE Journal, you enter the same reflection system.

**L146** Write stage lead · rewrite (dashed clause begins with "and")
- Now: The daily check-in is the raw material everything else is forged from — and it takes less time than making coffee.
- Proposed: The daily check-in is the raw material everything else is forged from. It takes less time than making coffee.

**L149** Write stage item · rewrite (reorder within the sentence)
- Now: Type straight into the app — or, if you keep the FORGE Journal, scan the handwritten page.
- Proposed: Type straight into the app, or scan the handwritten page if you keep the FORGE Journal.
- Why: a comma in place of the dash would give ", or, if you keep" with three commas in a row. Moving the condition to the end keeps the meaning and reads clean.

**L168** Reflect stage lead · rewrite (two dashes, list then "and")
- Now: FORGE reads your actual check-in — your mood, your energy, the words you wrote — and answers you like a coach who's been paying attention.
- Proposed: FORGE reads your actual check-in: your mood, your energy, the words you wrote. It answers you like a coach who's been paying attention.
- Why: commas would fold the list into the main clause and end in ", and". A colon introduces the list and a full stop closes it. "It" replaces "and" as the subject of the second sentence.

**L199** demo note · stop
- Now: Shown here from a scanned FORGE Journal page — an entry typed straight into the app lands in exactly the same place.
- Proposed: Shown here from a scanned FORGE Journal page. An entry typed straight into the app lands in exactly the same place.

**L208** Breathwork lead · stop
- Now: Guided breathing patterns, structured and built into the app — not a link out to someone else's video.
- Proposed: Guided breathing patterns, structured and built into the app. Not a link out to someone else's video.

**L210** Breathwork item · stop
- Now: Pick the pattern for the state you're in — pre-pitch nerves, post-conflict heat, or a racing head at midnight.
- Proposed: Pick the pattern for the state you're in. Pre-pitch nerves, post-conflict heat, or a racing head at midnight.

**L250** Meditation lead · comma
- Now: FORGE writes tonight's meditation from your mood, your energy and your own words — then voices it and plays it.
- Proposed: FORGE writes tonight's meditation from your mood, your energy and your own words, then voices it and plays it.
- Why: a full stop would leave "Then voices it and plays it" without a subject, and adding "it" gives "Then it voices it". The comma keeps one clean sentence.

**L253** Meditation item · stop
- Now: Not a script to read — a session to close your eyes to.
- Proposed: Not a script to read. A session to close your eyes to.

**L268** Arsenal sub · stop
- Now: These are the tools around it — everything that keeps the daily strikes landing.
- Proposed: These are the tools around it. Everything that keeps the daily strikes landing.

**L278** F.I.R.E. Stack card · stop
- Now: Focus, intention, resilience, execution — claimed before the world gets a say in your day.
- Proposed: Focus, intention, resilience, execution. Claimed before the world gets a say in your day.

**L303** compare footnote · rewrite (dashed clause begins with "and")
- Now: It's the other half of the same philosophy, doing a different job — and it does that job better than any app can.
- Proposed: It's the other half of the same philosophy, doing a different job. It does that job better than any app can.
- Note: this line uses curly apostrophes. Left as they are.

**L328** visible FAQ answer · stop
- Now: No. The app is a complete system on its own — type your check-in directly and everything works.
- Proposed: No. The app is a complete system on its own. Type your check-in directly and everything works.
- Pair flag: see L34. The JSON-LD copy already reads "on its own: type your check-in" with a colon, and ends "that bridge is optional" where this one ends "The bridge is optional. The philosophy isn't." They are not word for word today. The proposals above fix each minimally without aligning them. If you want them identical, the visible L328 wording is the one to copy into L34, and I can do that in the same pass.

**L340** CTA sub · rewrite (dashed clause begins with "and")
- Now: Early access members get first word — and first access — the day it clears.
- Proposed: Early access members get first word and first access the day it clears.
- Why: a comma pair would give ", and first access,". A plain "and" with no comma keeps both halves and the meaning.

---

## community.html (5)

**L13** og:description · stop
- Now: No fluff — new tools, honest content, and first access to the FORGE app when it launches.
- Proposed: No fluff. New tools, honest content, and first access to the FORGE app when it launches.

**L75** waitlist lead · rewrite (dashed clause begins with "and")
- Now: A place for men serious about the work — and first word on everything Built Not Born ships, starting with the FORGE app the day it clears the App Store.
- Proposed: A place for men serious about the work. First word on everything Built Not Born ships, starting with the FORGE app the day it clears the App Store.

**L88** form success message · stop
- Now: You're in. Watch your inbox — no noise, just the work.
- Proposed: You're in. Watch your inbox. No noise, just the work.
- Pair flag: index.html L180 carries this exact string. index.html is out of scope here. Whoever rewrites it should use the same wording.

**L138** content hub intro · stop
- Now: Behind the anvil: honest notes from building FORGE — the journal, the app, and the road to launch.
- Proposed: Behind the anvil: honest notes from building FORGE. The journal, the app, and the road to launch.

**L159** app card · stop
- Now: An AI coach built from your own words. Pre-launch on iOS — see what's coming.
- Proposed: An AI coach built from your own words. Pre-launch on iOS. See what's coming.

---

## tools.html (11)

**L7** meta description · stop
- Now: The Built Not Born Toolbox: small digital budgeting and self-development tools for men, each built for one job — starting with Built Not Bought, a personal spending tracker.
- Proposed: The Built Not Born Toolbox: small digital budgeting and self-development tools for men, each built for one job. Starting with Built Not Bought, a personal spending tracker.

**L13** og:description · stop
- Now: Small tools built for one specific job — starting with Built Not Bought, a personal spending tracker. The journal and the app are the system; these are the sidearms.
- Proposed: Small tools built for one specific job. Starting with Built Not Bought, a personal spending tracker. The journal and the app are the system; these are the sidearms.
- Pair flag: the first two sentences must match L24 word for word. They do below.

**L20** og:image:alt · stop
- Now: The Built Not Born Toolbox — small digital tools in the ember-gold style
- Proposed: The Built Not Born Toolbox. Small digital tools in the ember-gold style

**L24** twitter:description · stop
- Now: Small tools built for one specific job — starting with Built Not Bought, a personal spending tracker.
- Proposed: Small tools built for one specific job. Starting with Built Not Bought, a personal spending tracker.
- Pair flag: matches the opening of L13 word for word.

**L31** JSON-LD Product description · stop
- Now: Browser-based, private, and built for one job — knowing exactly where your money goes.
- Proposed: Browser-based, private, and built for one job. Knowing exactly where your money goes.
- Pair flag: see L120. These two already differ.

**L85** page hero sub · stop
- Now: The journal and the app are the system — two products, one philosophy.
- Proposed: The journal and the app are the system. Two products, one philosophy.

**L120** Built Not Bought card · stop
- Now: Private, fast, and built for one job — knowing exactly where your money goes.
- Proposed: Private, fast, and built for one job. Knowing exactly where your money goes.
- Pair flag: see L31. The JSON-LD says "Browser-based, private, and built for one job" where this says "Private, fast, and built for one job". Not word for word today. Proposals fix each minimally. Say if you want them aligned and which wording wins.

**L125** disabled button label · comma
- Now: Built Not Bought — coming soon
- Proposed: Built Not Bought, coming soon
- Why: a full stop inside a button label reads as a typo. Comma is the next preference.

**L135** placeholder card · stop
- Now: Tell us what to build — see below.
- Proposed: Tell us what to build. See below.

**L148** textarea placeholder attribute · stop
- Now: The tool you want — one job, plainly put
- Proposed: The tool you want. One job, plainly put

**L161** CTA sub · stop
- Now: Early access members hear about every new tool before it's public — starting with Built Not Bought.
- Proposed: Early access members hear about every new tool before it's public. Starting with Built Not Bought.

---

## Pairs that must match word for word

| Pair | Status after proposals |
|---|---|
| tools L13 og:description and L24 twitter:description | Match |
| about L7 slogan clause, L13 og:description opening, JSON-LD slogan | Match |
| app L34 JSON-LD and L328 visible FAQ | Already differ in two places. Not aligned by these proposals. Your call. |
| tools L31 JSON-LD and L120 visible card | Already differ in the opening adjectives. Not aligned by these proposals. Your call. |
| community L88 and index L180 | Identical today. index.html out of scope. Reuse this wording there. |

## Existing ", and" constructions left untouched

These sit in sentences being edited but were not created by the dash removal. Left as they are under the "change nothing beyond the dash" rule. Listed so you can decide.

- about L89: "pick up, and bridge them"
- about L131: "guided breathwork, and meditation"
- app L7: "guided breathwork, and meditation"
- app L94: "gets heavy, and a meditation"
- app L208: "hold timers, and a Combo Stack"
- community L13: "honest content, and first access"
- community L138: "the app, and the road to launch"
- tools L31: "private, and built for one job"
- tools L120: "fast, and built for one job"

## Rule check on the proposed lines

No em-dashes. No en-dashes. No sentence opens with "And" or "But". No new ", and" introduced. No spelling changed. Checked mechanically across all 45 proposed lines before this file was written.
