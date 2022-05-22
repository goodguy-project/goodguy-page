import Nav from "./nav";
import {Box, Button, Card, CardActions, CardContent, CardProps, LinearProgress, Typography} from "@mui/material";
import {CrawlClient} from "../api/crawler/client";
import {useEffect, useState} from "react";
import {
    GetDailyQuestionRequest,
    GetDailyQuestionResponse,
    MGetRecentContestRequest,
    RecentContest
} from "../api/pb/crawl_service_pb";

type CardParam = {
    element: JSX.Element
    color?: string
    priority?: number
    date?: string
    occupy?: number
};

function Cards(...cards: CardParam[]) {
    const ret: JSX.Element[] = [];
    const n = 5;
    cards.sort((a, b) => {
        const pa = a.priority || 0, pb = b.priority || 0;
        if (pa === pb) {
            const da = a.date || '', db = b.date || '';
            return da < db ? -1 : da == db ? 0 : 1;
        }
        return pb - pa;
    });
    for (let i = 0; i < cards.length; i++) {
        if (i % n !== 0) {
            ret.push(<Card key={`${i}_placeholder`} style={{width: '24px', display: "inline-block"}}/>);
        }
        const card = cards[i];
        const occupy = card.occupy || 1;
        const style = {
            width: `calc((((100% - (24px * ${n - 1})) * ${occupy}) / ${n}))`,
            display: "inline-block",
            backgroundColor: card.color,
            verticalAlign: 'top',
            marginTop: Math.floor(i / n) === 0 ? '0' : '12px',
        };
        ret.push(
            <Card key={`${i}_main`} style={style}>
                {card.element}
            </Card>
        );
    }
    return ret;
}

function LeetcodeDailyCard(): CardParam {
    const [response, setResponse] = useState<GetDailyQuestionResponse | undefined>(undefined);
    useEffect(() => {
        const request = new GetDailyQuestionRequest();
        request.setPlatform("leetcode");
        CrawlClient.getDailyQuestion(request, {}, (err, resp) => {
            return err ? console.log(err) : setResponse(resp);
        });
    }, []);
    const problem = response && response.getProblemList().length > 0 ? response.getProblemList()[0] : undefined;
    const element = problem ? (
        <>
            <CardContent>
                <Typography sx={{fontSize: 19}} gutterBottom>
                    LeetCode 每日一题
                </Typography>
                <Typography>
                    题号：{problem.getId()}
                </Typography>
                <Typography>
                    题目：{problem.getName()}
                </Typography>
                <Typography>
                    难度：{problem.getDifficulty()}
                </Typography>
            </CardContent>
            <CardActions>
                <Button href={problem.getUrl()} target="_blank">去做题</Button>
            </CardActions>
        </>
    ) : (
        <>
            <CardContent>
                <Typography sx={{fontSize: 19}} gutterBottom>
                    LeetCode 每日一题
                </Typography>
                <br/>
                <LinearProgress/>
            </CardContent>
        </>
    );
    return {
        element: element,
        priority: 100,
    };
}

// ts单位为秒
function TimestampToString(ts: number): string {
    const date = new Date(ts * 1000.0);
    return date.toLocaleString();
}

function RecentContestCard(): CardParam[] {
    const [recentContest, setRecentContest] = useState<Array<RecentContest> | undefined>(undefined);
    useEffect(() => {
        const request = new MGetRecentContestRequest();
        CrawlClient.mGetRecentContest(request, {}, (err, response) => {
            return err ? console.log(err) : setRecentContest(response.getRecentContestList());
        });
    }, []);
    const now = Date.now() / 1000 | 0;
    const cards: CardParam[] = [];
    if (recentContest !== undefined) {
        for (const pf of recentContest) {
            const platform = pf.getPlatform();
            // const color = 'rgba(17,164,244)'; TODO backgroud color
            // const textColor = 'rgba(17,164,244)'; TODO text color
            for (const rc of pf.getRecentContestList()) {
                const start = rc.getTimestamp();
                const end = rc.getTimestamp() + rc.getDuration();
                let priority = 90;
                if (platform === 'codechef') {
                    // codechef
                    priority = 40;
                } else if (end < now) {
                    // 已经结束
                    priority = 70;
                }
                cards.push({
                    element: (
                        <>
                            <CardContent>
                                <Typography sx={{fontSize: 19}} gutterBottom>
                                    {rc.getName()}
                                </Typography>
                                <Typography>
                                    平台：{platform}
                                </Typography>
                                <Typography>
                                    开始时间：{TimestampToString(start)}
                                </Typography>
                                <Typography>
                                    结束时间：{TimestampToString(end)}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button href={rc.getUrl()} target="_blank">去做题</Button>
                            </CardActions>
                        </>
                    ),
                    priority: priority,
                    date: rc.getTimestamp().toString(),
                });
            }
        }
    } else {
        cards.push({
            element: (
                <>
                    <CardContent>
                        <Typography sx={{fontSize: 19}} gutterBottom>
                            最近比赛信息正在抓取中...
                        </Typography>
                        <br/>
                        <LinearProgress/>
                    </CardContent>
                </>
            ),
            priority: 90,
        });
    }
    return cards;
}

export default function Index(props: {}): JSX.Element {
    document.title = "首页";
    return (
        <Nav open={false} header={"首页"}>
            <div>
                {Cards(LeetcodeDailyCard(), ...RecentContestCard())}
            </div>
        </Nav>
    );
}