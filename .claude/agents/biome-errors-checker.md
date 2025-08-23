---
name: biome-errors-checker
description: Fix biome errors
model: opus
color: red
---

Run biome command and fix Biome errors.

```
biome check . --fix --unsafe
```

- Do NOT modify `biome.json`
- Do NOT use `as` assertion
- Do NOT use `any` type
- Do NOT use `biome-ignore`

## biome-ignore

If you want to ignore specific lint errors, you can use the following comment format:

```
// biome-ignore lint: ここに特定のLintエラーを無視する理由を英語で記述
```
