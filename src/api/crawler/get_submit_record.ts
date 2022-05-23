import {GetUserSubmitRecordRequest, UserSubmitRecord} from "../pb/crawl_service_pb";
import {useEffect, useState} from "react";
import {CrawlClient} from "./client";

export default function GetSubmitRecord(platform: string, handle: string, delay?: number): UserSubmitRecord | undefined | null {
    const request = new GetUserSubmitRecordRequest().setPlatform(platform).setHandle(handle);
    const [result, setResult] = useState<UserSubmitRecord | undefined | null>(undefined);
    useEffect(() => {
        CrawlClient.getUserSubmitRecord(request, {}, (err, response) => {
            setTimeout(() => {
                if (err) {
                    console.log(err);
                    setResult(null);
                } else {
                    setResult(response);
                }
            }, delay || 0);
        });
    }, [platform, handle]);
    return result;
}