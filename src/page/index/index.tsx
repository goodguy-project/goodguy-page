import CommonNav from "../common/common_nav";
import {useState} from "react";
import {RecentContest} from "../../api/pb/crawl_service_pb";
import State, {Status} from "../../util/state";
import GetRecentContest from "../../api/crawler/get_recent_contest";
import {Table} from "react-bootstrap";

type Contest = {
    data: RecentContest.ContestMessage
    platform: string
};

function getDateString(d: Date): string {
    const month = String(d.getMonth()).padStart(2, '0');
    const date = String(d.getDate()).padStart(2, '0');
    const hour = String(d.getHours()).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');
    return `${d.getFullYear()}/${month}/${date} ${hour}:${minute}`;
}

function getDurationString(d: number): string {
    const day = Math.floor(d / 86400);
    const hour = String(Math.floor(d % 86400 / 3600)).padStart(2, '0');
    const minute = String(Math.floor(d % 3600 / 60)).padStart(2, '0');
    if (day > 0) {
        return `${day}:${hour}:${minute}`;
    } else if (d >= 3600) {
        return `${hour}:${minute}`;
    } else {
        return `${minute} minute(s)`;
    }
}

function RecentContestTableRow(contest: Contest): JSX.Element {
    const name = contest.data.getName().length > 50 ?
        contest.data.getName().substring(0, 50) + '...' : contest.data.getName();
    const date = new Date(contest.data.getTimestamp() * 1000.0);
    if (contest.data.getTimestamp() < Date.now() / 1000.0) {
        return <></>;
    }
    return (
        <>
            <td title={contest.platform}>{contest.platform}</td>
            <td title={contest.data.getName()}>
                <a target="_blank" href={contest.data.getUrl()} rel="noreferrer">{name}</a>
            </td>
            <td>{getDateString(date)}</td>
            <td>{getDurationString(contest.data.getDuration())}</td>
        </>
    );
}

function RecentContestTable(): JSX.Element {
    const rc = GetRecentContest();
    const contests: Contest[] = [];
    for (const r of rc) {
        if (r !== undefined) {
            for (const c of r.getRecentContestList()) {
                contests.push({
                    data: c,
                    platform: r?.getPlatform(),
                });
            }
        }
    }
    contests.sort((a, b): number => {
        return a.data.getTimestamp() - b.data.getTimestamp();
    });
    return contests === [] ? (
        <>
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
            &nbsp;Loading Recent Contest...
        </>
    ) : (
        <div>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>平台</th>
                    <th>比赛名称</th>
                    <th>开始时间</th>
                    <th>比赛时长</th>
                </tr>
                </thead>
                <tbody>
                {
                    contests.map((value, index) => {
                        return (
                            <tr key={index}>{RecentContestTableRow(value)}</tr>
                        );
                    })
                }
                </tbody>
            </Table>
        </div>
    );
}

export default function IndexPage(): JSX.Element {
    return (
        <>
            <CommonNav/>
            <div className="goodguy-body">
                <h2>最近比赛</h2>
                <RecentContestTable/>
            </div>
        </>
    );
}