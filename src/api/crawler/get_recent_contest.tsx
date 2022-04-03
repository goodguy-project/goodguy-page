import {GetRecentContestRequest, RecentContest} from "../pb/crawl_service_pb";
import {CrawlClient} from "./common";
import {useEffect, useState} from "react";

const PlatformRecentContest = [
    'atcoder',
    'codeforces',
    'leetcode',
    'luogu',
    'nowcoder',
    'codechef',
];

function GetSinglePlatformRecentContest(platform: string): RecentContest | undefined {
    const [state, setState] = useState<RecentContest | undefined>(undefined);
    useEffect(() => {
        const request = new GetRecentContestRequest();
        request.setPlatform(platform);
        CrawlClient.getRecentContest(request, {}, (err, response) => {
            return err ? console.log(err) : setState(response);
        });
    }, [platform]);
    return state;
}

function GetAllRecentContest(): (RecentContest | undefined)[] {
    const r: (RecentContest | undefined)[] = [];
    for (const platform of PlatformRecentContest) {
        r.push(GetSinglePlatformRecentContest(platform));
    }
    return r;
}

export default function GetRecentContest(platform?: string): (RecentContest | undefined)[] {
    if (platform === undefined) {
        return GetAllRecentContest();
    }
    return [GetSinglePlatformRecentContest(platform)];
}