import {CrawlServiceClient} from "../pb/crawl_service_grpc_web_pb";
import {CrawlHost} from "../../settings";

export const CrawlClient = new CrawlServiceClient(CrawlHost);
