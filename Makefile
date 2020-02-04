install:
	npm install
start:
	npx node src/bin/gendiff.js
build:
	npm run build
publish:
	npm publish --dry-run
lint:
	npx eslint .
test:
	npm test
test-coverage:
	npm test -- --coverage
