import {GetUserContestRecordRequest, UserContestRecord} from "../pb/crawl_service_pb";
import {useEffect, useState} from "react";
import {CrawlClient} from "./client";

export default function GetContestRecord(platform: string, handle: string): UserContestRecord | undefined | null {
    const request = new GetUserContestRecordRequest();
    request.setPlatform(platform).setHandle(handle);
    const [result, setResult] = useState<UserContestRecord | undefined | null>(undefined);
    useEffect(() => {
        CrawlClient.getUserContestRecord(request, {}, (err, response) => {
            if (err) {
                console.log(err);
                setResult(null);
                return;
            } else {
                setResult(response);
            }
        });
    }, [platform, handle]);
    return result;
}