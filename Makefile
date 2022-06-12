client:
	-cd src/api && mkdir pb
	wget https://mirror.ghproxy.com/https://raw.githubusercontent.com/goodguy-project/goodguy-crawl/main/crawl_service/crawl_service.proto -O src/api/pb/crawl_service.proto
	wget https://mirror.ghproxy.com/https://raw.githubusercontent.com/goodguy-project/goodguy-core/main/idl/goodguy-web.proto -O src/api/pb/goodguy-web.proto
	cd src/api/pb && protoc -I . goodguy-web.proto   --js_out=import_style=commonjs,binary:. --grpc-web_out=import_style=commonjs+dts,mode=grpcweb:.
	cd src/api/pb && protoc -I . crawl_service.proto --js_out=import_style=commonjs,binary:. --grpc-web_out=import_style=commonjs+dts,mode=grpcweb:.

debug:
	react-scripts start

build:
	react-scripts build

deploy:
	react-scripts build
	serve -s build -l 80
