FROM kubeless/unzip

FROM node:16

COPY --from=0 /usr/bin/unzip /usr/local/bin
RUN mkdir /usr/local/protoc
WORKDIR /usr/local/protoc
RUN wget https://mirror.ghproxy.com/https://github.com/protocolbuffers/protobuf/releases/download/v3.20.1/protoc-3.20.1-linux-x86_64.zip -O protoc.zip \
    && unzip protoc.zip && wget https://mirror.ghproxy.com/https://github.com/grpc/grpc-web/releases/download/1.3.1/protoc-gen-grpc-web-1.3.1-linux-x86_64 -O protoc-gen-grpc-web \
    && chmod 777 protoc-gen-grpc-web && cp protoc-gen-grpc-web bin/
ENV PATH="/usr/local/protoc/bin:${PATH}"

COPY package.json /home
WORKDIR /home
RUN npm config set registry http://registry.npm.taobao.org && npm install -g create-react-app && npm i
COPY ./ /home
RUN make client && npm run build
CMD npm run serve
