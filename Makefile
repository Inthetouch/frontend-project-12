install:
	npm ci
	cd frontend && npm ci

build:
	rm -rf frontend/dist
	cd frontend && npm run build

start:
	npx start-server -s ./frontend/dist
