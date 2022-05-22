import {GetUserSubmitRecordRequest, UserSubmitRecord} from "../pb/crawl_service_pb";
import {useEffect, useState} from "react";
import {CrawlClient} from "./client";

export default function GetSubmitRecord(platform: string, handle: string): UserSubmitRecord | undefined | null {
    const request = new GetUserSubmitRecordRequest().setPlatform(platform).setHandle(handle);
    const [result, setResult] = useState<UserSubmitRecord | undefined | null>(undefined);
    useEffect(() => {
        CrawlClient.getUserSubmitRecord(request, {}, (err, response) => {
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