import Nav from "./nav";
import {useEffect, useState} from "react";
import {WebClient} from "../api/web/common";
import {GetMemberRequest, GetMemberResponse, Member} from "../api/pb/goodguy-web_pb";
import {Box, Chip, CircularProgress, Paper, Typography} from "@mui/material";
import GetContestRecord from "../api/crawler/get_contest_record";
import GetSubmitRecord from "../api/crawler/get_submit_record";

const placeholderSize = '24px';

function PlatformDisplay(props: {platform: string, handle: string, title: string}): JSX.Element {
    const {platform, handle, title} = props;
    if (handle === '') {
        return <></>;
    }
    const contest = GetContestRecord(platform, handle);
    const submit = GetSubmitRecord(platform, handle);
    const onClick = () => {
        const url = contest?.getProfileUrl() || submit?.getProfileUrl();
        if (url !== undefined) {
            window.open(url, '_blank');
        }
    };
    const element = [
        <Chip label={title} variant="outlined" onClick={onClick}/>,
        <>&nbsp;</>,
        <Chip label={handle} variant="outlined" onClick={onClick}/>,
    ];
    if (contest) {
        element.push(<>&nbsp;</>);
        element.push(<Chip label={contest.getRating()} variant="outlined" onClick={onClick}/>);
    }
    if (submit) {
        element.push(<>&nbsp;</>);
        element.push(<Chip label={submit.getAcceptCount() + "题"} variant="outlined" onClick={onClick}/>);
    }
    return (
        <div style={{display: 'table', margin: '5px auto'}}>
            {element}
        </div>
    );
}

function MemberDisplay(props: { member: Member }): JSX.Element {
    const n = 3;
    const width = `calc((100% - (${placeholderSize} * ${n - 1})) / ${n})`;
    const {member} = props;
    return (
        <Paper elevation={3} style={{width: width, display: "inline-block"}}>
            <div style={{display: 'table', margin: '5px auto'}}>
                <Chip label="用户名" variant="outlined"/>&nbsp;
                <Chip label={member.getSid().toString()} variant="outlined"/>
            </div>
            <div style={{display: 'table', margin: '5px auto'}}>
                <Chip label="姓名" variant="outlined"/>&nbsp;
                <Chip label={member.getName().toString()} variant="outlined"/>
            </div>
            <div style={{display: 'table', margin: '5px auto'}}>
                <Chip label="年级" variant="outlined"/>&nbsp;
                <Chip label={member.getGrade().toString()} variant="outlined"/>
            </div>
            <PlatformDisplay platform="codeforces" handle={member.getCodeforcesId().toString()} title="CodeForces"/>
            <PlatformDisplay platform="atcoder" handle={member.getAtcoderId().toString()} title="AtCoder"/>
            <PlatformDisplay platform="nowcoder" handle={member.getNowcoderId().toString()} title="NowCoder"/>
            <PlatformDisplay platform="leetcode" handle={member.getLeetcodeId().toString()} title="LeetCode"/>
            <PlatformDisplay platform="luogu" handle={member.getLuoguId().toString()} title="Luogu"/>
            <PlatformDisplay platform="vjudge" handle={member.getVjudgeId().toString()} title="Vjudge"/>
        </Paper>
    );
}

function MemberGroupDisplay(props: { memberGroup: Member[] }): JSX.Element {
    const teamName = props.memberGroup.length > 0 ? props.memberGroup[0].getTeamName().toString() : '';
    let elements: JSX.Element[] = [
        <Typography key={"??"} style={{textAlign: 'center', padding: '0 0 8px 0'}}>{teamName}</Typography>,
    ];
    elements = elements.concat(props.memberGroup.map((value, index) => {
        const e = <MemberDisplay member={value} key={index}/>;
        if (index !== 0) {
            return (
                <span key={index}>
                    <div style={{width: placeholderSize, display: "inline-block"}}/>
                    {e}
                </span>
            );
        }
        return e;
    }));
    return (
        <Paper elevation={6} style={{padding: '12px'}}>
            {elements}
        </Paper>
    );
}

export default function OfficialList(props: { pageSize?: number }): JSX.Element {
    document.title = "校队成员列表";
    const pageSize = props.pageSize || 50;
    const [data, setData] = useState<GetMemberResponse | undefined>(undefined);
    useEffect(() => {
        const request = new GetMemberRequest().setPageSize(pageSize).setIsOfficialList([true]);
        WebClient.getMember(request, {}, (err, response) => {
            return err ? console.log(err) : setData(response);
        });
    }, []);
    const team = new Map<string, Member[]>();
    data?.getMemberList().forEach((value) => {
        const teamName = value.getTeamName();
        let array = team.get(teamName);
        if (array === undefined) {
            array = [];
            team.set(teamName, array);
        }
        array?.push(value);
    });
    const memberGroup: Member[][] = [];
    team.forEach((value) => {
        memberGroup.push(value);
    });
    const OfficialListMain = () => {
        return (
            <>
                {
                    memberGroup.map((value, index) => {
                        return <MemberGroupDisplay memberGroup={value} key={index}/>;
                    })
                }
            </>
        );
    };
    return (
        <Nav open={false} header="校队成员列表">
            {data ? <OfficialListMain/> : <CircularProgress/>}
        </Nav>
    )
}