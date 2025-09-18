.PHONY: deploy check

deploy:
	bun biome check . --fix --unsafe
	bun run check
	bun test
	bun run deploy

check:
	bun biome check . --fix --unsafe
	bun check
	bun test
