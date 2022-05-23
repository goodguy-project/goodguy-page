import queryString from "query-string";
import {useEffect, useState, ReactNode} from "react";
import {GetSid, WebClient} from "../api/web/common";
import {GetMemberRequest, Member} from "../api/pb/goodguy-web_pb";
import {
    Accordion,
    AccordionDetails,
    AccordionProps,
    AccordionSummary, AccordionSummaryProps,
    CircularProgress, Paper,
    Typography
} from "@mui/material";
import Nav from "./nav";
import {styled} from "@mui/material/styles";
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import {ContestLine} from "../graph/line";
import {ContestHeapMap} from "../graph/heatmap";

type ProfileMainProps = {
    data: Member
};

const ProfileAccordion = styled((props: AccordionProps) => (
    <Accordion disableGutters elevation={0} square {...props}/>
))(({theme}) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));

const ProfileAccordionSummary = styled((props: AccordionSummaryProps) => (
    <AccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{fontSize: '0.9rem'}}/>}
        {...props}
    />
))(({theme}) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const ProfileAccordionDetails = styled(AccordionDetails)(({theme}) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

function UpdateElement(props: {sid: string}): JSX.Element {
    const {sid} = props;
    if (sid === '' || sid !== GetSid()) {
        return <></>;
    }
    return (
        <ProfileAccordion defaultExpanded={true}>
            <ProfileAccordionSummary>
                <Typography component="div">更新信息</Typography>
            </ProfileAccordionSummary>
            <ProfileAccordionDetails>
                TODO
            </ProfileAccordionDetails>
        </ProfileAccordion>
    );
}

function PaperElement(...children: ReactNode[]) {
    const size = '24px';
    const n = children.length;
    const width = `calc(((100% - (${size} * ${n - 1})) / ${n}))`;
    const r: JSX.Element[] = [];
    let index = 0;
    for (const c of children) {
        if (r.length > 0) {
            r.push(<Paper key={index++} style={{width: size, display: "inline-block"}}/>);
        }
        r.push(<Paper key={index++} style={{width: width, display: "inline-block"}} elevation={3}>{c}</Paper>);
    }
    return r;
}

function ProfileMain(props: ProfileMainProps): JSX.Element {
    const data = props.data;
    const sid = GetSid();
    return (
        <div>
            <ProfileAccordion defaultExpanded={true}>
                <ProfileAccordionSummary>
                    <Typography component="div">基础信息</Typography>
                </ProfileAccordionSummary>
                <ProfileAccordionDetails>
                    <Typography component="div">用户名：{data.getSid().toString()}</Typography>
                    <Typography component="div">姓名：{data.getName().toString()}</Typography>
                    <Typography component="div">学校：{data.getSchool().toString()}</Typography>
                    <Typography component="div">年级：{data.getGrade().toString()}</Typography>
                    <Typography component="div">班级：{data.getClazz().toString()}</Typography>
                    <Typography component="div">是否校队成员：{data.getIsOfficial().getValue() ? "YES" : "NO"}</Typography>
                    {data.getIsOfficial().getValue() ?
                        <Typography component="div">学校：{data.getSchool().toString()}</Typography> : <></>}
                    <Typography component="div">Codeforces ID：{data.getCodeforcesId().toString()}</Typography>
                    <Typography component="div">AtCoder ID：{data.getAtcoderId().toString()}</Typography>
                    <Typography component="div">CodeChef ID：{data.getCodechefId().toString()}</Typography>
                    <Typography component="div">NowCoder ID：{data.getNowcoderId().toString()}</Typography>
                    <Typography component="div">Vjudge ID：{data.getVjudgeId().toString()}</Typography>
                    <Typography component="div">LeetCode ID：{data.getLeetcodeId().toString()}</Typography>
                    <Typography component="div">Luogu ID：{data.getLuoguId().toString()}</Typography>
                </ProfileAccordionDetails>
            </ProfileAccordion>
            <UpdateElement sid={sid}/>
            <ProfileAccordion defaultExpanded={true}>
                <ProfileAccordionSummary>
                    <Typography component="div">比赛经历</Typography>
                </ProfileAccordionSummary>
                <ProfileAccordionDetails>
                    {PaperElement(
                        <>
                            {/*<Typography component="div">Codeforces</Typography>*/}
                            <ContestLine platform="codeforces" handle={data.getCodeforcesId().toString()}/>
                        </>,
                        <>
                            {/*<Typography component="div">AtCoder</Typography>*/}
                            <ContestLine platform="atcoder" handle={data.getAtcoderId().toString()}/>
                        </>,
                        <>
                            {/*<Typography component="div">Nowcoder</Typography>*/}
                            <ContestLine platform="nowcoder" handle={data.getNowcoderId().toString()}/>
                        </>,
                        <>
                            {/*<Typography component="div">Leetcode</Typography>*/}
                            <ContestLine platform="leetcode" handle={data.getLeetcodeId().toString()}/>
                        </>,
                    )}
                </ProfileAccordionDetails>
            </ProfileAccordion>
            <ProfileAccordion defaultExpanded={true}>
                <ProfileAccordionSummary>
                    <Typography component="div">比赛经历</Typography>
                </ProfileAccordionSummary>
                <ProfileAccordionDetails>
                    {PaperElement(<ContestHeapMap platform="codeforces" handle={data.getCodeforcesId().toString()} title="Codeforces"/>)}
                    {PaperElement(<ContestHeapMap platform="vjudge" handle={data.getVjudgeId().toString()} title="Vjudge"/>)}
                </ProfileAccordionDetails>
            </ProfileAccordion>
            {
                sid === data.getSid().toString() ? (
                    <ProfileAccordion defaultExpanded={true}>
                        <ProfileAccordionSummary>
                            <Typography component="div">更新信息</Typography>
                        </ProfileAccordionSummary>
                        <ProfileAccordionDetails>
                            <Typography>{data.getSid().toString()}</Typography>
                        </ProfileAccordionDetails>
                    </ProfileAccordion>
                ) : null
            }
        </div>
    );
}

type ProfileProps = {};

export default function Profile(props: ProfileProps): JSX.Element {
    const query = queryString.parse(window.location.search);
    const sid = typeof query['sid'] === 'string' ? query['sid'] : '';
    document.title = `用户 - ${sid}`;
    const [data, setData] = useState<Member | null | undefined>(undefined);
    useEffect(() => {
        const request = new GetMemberRequest().setPageNo(1).setPageSize(10).setSidList([sid]);
        WebClient.getMember(request, {}, (err, response) => {
            if (err || response.getMemberList().length <= 0) {
                setData(null);
            } else {
                setData(response.getMemberList()[0]);
            }
        });
    }, []);
    return (
        <Nav open={false} header={sid}>
            {data === undefined ? <CircularProgress/> : data === null ? <>404</> : <ProfileMain data={data}/>}
        </Nav>
    );
}