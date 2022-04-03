import {CrawlServiceClient} from "../pb/crawl_service_grpc_web_pb";

const hostname = 'http://127.0.0.1:9852';

export const CrawlClient = new CrawlServiceClient(hostname);