import {GetUserContestRecordRequest, UserContestRecord} from "../pb/crawl_service_pb";
import {useEffect, useState} from "react";
import {CrawlClient} from "./client";

export default function GetContestRecord(platform: string, handle: string, delay?: number): UserContestRecord | undefined | null {
    const request = new GetUserContestRecordRequest();
    request.setPlatform(platform).setHandle(handle);
    const [result, setResult] = useState<UserContestRecord | undefined | null>(undefined);
    useEffect(() => {
        setTimeout(() => {
            if (handle === '') {
                setResult(null);
                return;
            }
            CrawlClient.getUserContestRecord(request, {}, (err, response) => {
                if (err) {
                    console.log(err);
                    setResult(null);
                    return;
                } else {
                    setResult(response);
                }
            });
        }, delay);
    }, [platform, handle]);
    return result;
}