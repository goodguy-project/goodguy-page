client:
	-cd src/api && mkdir pb
	cd src/api/pb && protoc -I . goodguy-web.proto   --js_out=import_style=commonjs,binary:. --grpc-web_out=import_style=commonjs+dts,mode=grpcweb:.
	cd src/api/pb && protoc -I . crawl_service.proto --js_out=import_style=commonjs,binary:. --grpc-web_out=import_style=commonjs+dts,mode=grpcweb:.

debug:
	react-scripts start

build:
	react-scripts build

deploy:
	react-scripts build
	serve -s build -l 80
