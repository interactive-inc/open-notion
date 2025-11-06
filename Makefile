.PHONY: deploy check

deploy:
	bun biome check . --fix --unsafe
	bun run check
	bun test
	bun run build
	npm publish

check:
	bun biome check . --fix --unsafe
	bun check
	bun test
