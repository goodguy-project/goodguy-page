import {GetUserContestRecordRequest, UserContestRecord} from "../pb/crawl_service_pb";
import {CrawlClient} from "./common";
import {useEffect, useState} from "react";

export default function GetUserContestRecord(platform: string, handle: string): UserContestRecord | undefined {
    const [state, setState] = useState<UserContestRecord | undefined>(undefined);
    useEffect(() => {
        const request = new GetUserContestRecordRequest();
        request.setPlatform(platform);
        request.setHandle(handle);
        CrawlClient.getUserContestRecord(request, {}, (err, response) => {
            return err ? console.log(err) : setState(response);
        });
    }, [platform, handle]);
    return state;
}
