# Handoff — Scientific/Official Audit of the 580-Test Library

**Date:** 2026-07-21 · **Branch:** `main` · **Repo:** `personality-calculator`
**Status:** Audit phase ✅ complete · Verify phase ⚠️ aborted (usage limit) · Fixes ⛔ not started

---

## 1. The task

Audit **all** personality tests in the library for whether they are **official / scientific / complete**, verify each against real-world sources via web search, and **fix inconsistencies**. Excluded by the user: `tomodachi-life…` and `attitudinal-psyche-style-test`.

User decisions locked in this session:
- **Scope:** all 580 tests, via multi-agent workflow.
- **Action:** *report first, then fix on approval* — no source edits until the user approves the findings batch.
- **Tier B/C bar:** structure + honest framing (do **not** try to make entertainment/proprietary tests "scientific").

## 2. Approved approach — 3-tier triage (do not re-litigate)

One pass/fail bar does **not** apply to all tests. They were classified:

| Tier | What | Count | Correctness bar |
|---|---|---|---|
| **A** | Public scientific instruments (Big Five/IPIP, HEXACO, RIASEC, Enneagram, Dark Triad, Grit, DASS, Rosenberg…) | 253 | Dimensions/scoring/keying match the **published factor structure**; no invented factors; no wrongly-split unidimensional scales |
| **B** | `-style` proprietary approximations (Hogan, Caliper, 16PF, MBTI, DISC, Gallup…) | 259 | Framework **shape** right + **honest framing** (inspired-by, not "the official instrument"). Official items are copyrighted — never reproduce them |
| **C** | Entertainment (zodiac, Hogwarts, aura, tarot, anime…) | 68 | Faithful to the pop framework + honest "for fun" framing. No science expected |

**"Complete" was redefined:** every dimension covered with balanced/reverse-keyed items — **NOT** full official item count (these are intentionally short 8–20 item quizzes; "too few items" is never a finding on its own).

## 3. What is done

1. **Phase 0 — manifest**: `docs/handoff/build-manifest.mjs` reads `GENERIC_TESTS`, classifies A/B/C, and writes ~73 batch files. (Batches were in the session scratchpad, now expired — **re-run the script to regenerate** if needed.)
2. **Phase 1 — audit workflow** (`wf_3805424f-8ac`): 73 agents web-verified structure. **572/580 audited** (batch-71 failed on the limit → ~8 tests: re-audit them, see §6). Result: **301 OK, 271 flagged**.
3. **Phase 2 — verify**: adversarial skeptic re-check. **Only 9 of 271 completed** — the session hit its usage limit (reset 1:20pm Asia/Shanghai, now passed). The other **262 flagged findings are unverified**.

## 4. Key artifacts (durable — safe to rely on)

- **All 271 flagged findings** → `docs/handoff/audit-flagged-findings.json`
  - `confirmed[]` (9): passed adversarial verification — **ready to fix once user approves**.
  - `unverified[]` (262): audit flagged them but the skeptic never ran — **must be verified before fixing**.
- **Manifest/classifier** → `docs/handoff/build-manifest.mjs`
- **Workflow script** → `.../workflows/scripts/audit-personality-tests-wf_3805424f-8ac.js` (in the Claude project dir)
- **Per-agent raw returns** → `.../subagents/workflows/wf_3805424f-8ac/journal.jsonl` (425 lines)

## 5. Source of truth & how fixes land (critical)

- **Single source:** `src/pages/quiz/genericTestData.js` (1.2 MB, hand-written, `BASE_GENERIC_TESTS` via `buildTest()`/`dimension()`/`q()` helpers).
- The 580 files in `src/data/generated-tests/`, `generatedTestCatalog.js`, and `generatedTestLoaders.js` are **generated — never hand-edit them**.
- **After any fix:** `node scripts/generate-catalog.mjs` to regenerate, then verify the build/preview renders a fixed test correctly.

## 6. Next steps (in order)

1. **Re-verify the 262 unverified findings.** The limit has reset. Run a *verify-only* workflow that reads `docs/handoff/audit-flagged-findings.json` `unverified[]` and fans out one skeptic per finding (schema: `{slug, confirmed, correct_structure, note, source_url}`, told to REFUTE, default `confirmed=false` on uncertainty). Merge results back into the JSON. **Batch the skeptics** (~8 findings/agent) to stay under the limit — one-agent-per-finding is what blew the budget last time.
2. **Re-audit the ~8 tests in batch-71** (never completed). Regenerate batches with `build-manifest.mjs`, identify batch-71's slugs, audit them.
3. **Produce the findings report** grouped by tier/severity: CONFIRMED fixes, refuted, and UNVERIFIABLE-tiering-issues (e.g. `friendship-test`, `personal-boundaries-test` are mis-tiered as A but have no validated structure → downgrade to B/C, don't restructure).
4. **Get user approval** on the fix batch (report-first was their explicit choice).
5. **Apply fixes** in `genericTestData.js` → `node scripts/generate-catalog.mjs` → build check. Consider `git checkout` as rollback.

## 7. Confirmed findings (9) — ready to fix on approval

| slug | tier | issue → fix |
|---|---|---|
| `humor-style-test` | B | Invented 'satirical'/'absurd'; HSQ = Affiliative/Self-Enhancing/**Aggressive**/**Self-Defeating**. Restore the 2 maladaptive styles |
| `strengths-profile-test` | A→B | Invented 'learning' 5th domain; Gallup = 4 domains. Fold Learner items into Strategic; consider re-tier B |
| `firo-b-style-test` | B | Invented 'independence'; FIRO-B = inclusion/control/affection (3). Drop it |
| `need-for-cognition-test` | A | NFC is unidimensional; collapse to 1 dim, reverse-key the low-NFC items |
| `need-for-closure-test` | A | Rebuild to the 5 official facets (order, predictability, decisiveness, ambiguity-discomfort, closed-mindedness) |
| `self-compassion-test` | A | Missing isolation & over-identification; SCS = 6 components |
| `seven-love-styles-test` | A | Invented 'philautia'; Lee/LAS = 6 styles (eros, ludus, storge, pragma, mania, agape). Retitle to "six" |
| `friendship-test` | A→B/C | No validated 5-style model; **re-tier & reframe**, no structural change |
| `personal-boundaries-test` | A→B/C | No validated factor model; **re-tier & reframe**, dims are internally fine |

## 8. High-signal items among the 262 unverified (very likely real — spot-checked against known psychometrics)

`grit-test` (invented 'recovery'; Grit=2 factors) · `rosenberg-self-esteem-scale-test` & `rosenberg-self-esteem-style-test` (RSES is unidimensional, split into 5) · `mindful-attention-awareness-scale-test` (MAAS unidimensional, split into 5) · `depression-anxiety-stress-scales-style-test` (DASS=3, added 'coping'/'support') · `optimism-pessimism-test` / `life-orientation-test-revised` (LOT-R has no 'realism') · `eysenck-pen-personality-test` (missing Psychoticism) · `short-dark-triad-test` (invented 'accountability') · `self-esteem-test`, `general-self-efficacy-test`, `self-concept-clarity-test`, `work-locus-of-control-test` (unidimensional constructs wrongly split) · `cattell-16pf-style-test` (only 8 of 16 factors) · `reiss-motivation-profile-style-test` (10 of 16 desires) · plus many circumplex scales reduced from 8 octants to 6. **Still run them through verify** — a few audit calls may have over-flagged.

## 9. Gotchas

- **Session usage limit is the real constraint.** ~344 agents / 4.4M tokens burned the budget. Keep the verify pass batched and modest.
- **Do not silently "fix" UNVERIFIABLE / mis-tiered tests by inventing a structure** — the correct action is re-tiering + reframing.
- **Never edit generated files;** edit `genericTestData.js` then regenerate.
- Only 2 slugs are off-limits: `tomodachi-life…`, `attitudinal-psyche-style-test`.
- `docs/` is currently untracked (see `git status`) — the handoff artifacts live there.

## Suggested skills for the next session

- **`/think`** — if re-scoping the verify pass or deciding tiering-vs-restructuring for the UNVERIFIABLE set.
- **Workflow tool** (multi-agent) — for the batched verify-only fan-out over the 262 findings. User already opted into orchestration for this task.
- **`/check`** — after fixes are applied and regenerated, before commit/merge.
