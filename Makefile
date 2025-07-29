.PHONY: deploy deploy-client deploy-studio deploy-router check test

# Deploy docs package
deploy:
	bun biome check . --fix --unsafe
	bun run  check
	bun test
	bun run deploy

# Run all checks
check:
	bun biome check . --fix --unsafe
	bun check
	bun test

build:
	bun run build

