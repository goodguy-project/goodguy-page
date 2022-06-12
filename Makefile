client:
	-cd src/api && mkdir pb
	wget https://mirror.ghproxy.com/https://raw.githubusercontent.com/goodguy-project/goodguy-crawl/main/crawl_service/crawl_service.proto -O src/api/pb/crawl_service.proto
	wget https://mirror.ghproxy.com/https://raw.githubusercontent.com/goodguy-project/goodguy-core/main/idl/goodguy-web.proto -O src/api/pb/goodguy-web.proto
	cd src/api/pb && protoc -I . goodguy-web.proto   --js_out=import_style=commonjs,binary:. --grpc-web_out=import_style=commonjs+dts,mode=grpcweb:.
	cd src/api/pb && protoc -I . crawl_service.proto --js_out=import_style=commonjs,binary:. --grpc-web_out=import_style=commonjs+dts,mode=grpcweb:.

docker.build:
	docker build -t goodguy-page .

docker.run:
	-docker network create goodguy-net
	docker run -p 80:80 -dit --name="goodguy-page" --restart=always --network goodguy-net --network-alias goodguy-page goodguy-page

docker.deploy:
	make docker.build
	make docker.run

docker.clean:
	-docker stop $$(docker ps -a -q --filter="name=goodguy-page")
	-docker rm $$(docker ps -a -q --filter="name=goodguy-page")
	-FOR /f "usebackq tokens=*" %%i IN (`docker ps -q -a --filter="name=goodguy-page"`) DO docker stop %%i
	-FOR /f "usebackq tokens=*" %%i IN (`docker ps -q -a --filter="name=goodguy-page"`) DO docker rm %%i

docker.restart:
	make docker.clean
	make docker.deploy
