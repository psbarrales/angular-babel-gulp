image:
	docker build -t angular-babel-gulp:dev .
serve:
	docker run -it --rm -v $(shell pwd)/src:/workspace/src -p 3000:3000 -p 3001:3001 angular-babel-gulp:dev
test:
	docker run -it --rm -v $(shell pwd)/src:/workspace/src -v $(shell pwd)/dist:/workspace/dist angular-babel-gulp:dev gulp test
dist:
	make image
	mkdir -p dist
	docker run -it --rm -v $(shell pwd)/src:/workspace/src -v $(shell pwd)/dist:/workspace/dist angular-babel-gulp:dev gulp build
	docker build -t angular-babel-gulp:latest . -f Dockerfile.nginx
	rm -rf dist
lift:
	docker run -it --rm -p 3000:80 angular-babel-gulp:latest
