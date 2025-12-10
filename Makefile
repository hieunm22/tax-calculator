setup-env:
	yarn
	git checkout HEAD -- yarn.lock

reset:
	rm -rf dist
	rm -rf node_modules
	rm -rf coverage
	rm -f .env.local
	git reset --hard

destroy:
	docker container stop tax
	docker container rm tax
	docker image rm tax

docker:
	docker build -t tax -f Dockerfile .
	docker run --name tax -ditp 5555:80 --restart unless-stopped tax
	rm -rf dist

publish:
	yarn build
	make destroy
	make docker

start:
	make setup-env
	yarn dev

package:
	yarn
	git checkout HEAD -- yarn.lock
	yarn dev
