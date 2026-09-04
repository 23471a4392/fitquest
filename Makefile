.PHONY: install dev build test preview clean

install:
	npm install

dev:
	npm run dev

build:
	npm run build

test:
	npm run test

coverage:
	npm run test:coverage

preview:
	npm run preview

clean:
	rm -rf dist node_modules
