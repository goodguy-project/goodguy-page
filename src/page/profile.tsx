import queryString from "query-string";
import {useEffect, useState, ReactNode} from "react";
import {GetSid, GetToken, WebClient} from "../api/web/common";
import {GetMemberRequest, Member, UpdateMemberRequest} from "../api/pb/goodguy-web_pb";
import {
    Accordion,
    AccordionDetails,
    AccordionProps,
    AccordionSummary, AccordionSummaryProps,
    CircularProgress, Paper, TextField, Box,
    Typography, Button, Alert, Switch, FormControlLabel
} from "@mui/material";
import Nav from "./nav";
import {styled} from "@mui/material/styles";
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import {ContestLine} from "../graph/line";
import {ContestHeapMap} from "../graph/heatmap";
import * as React from "react";

const wrappers_pb = require('google-protobuf/google/protobuf/wrappers_pb.js');

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


function UpdateElement(props: { sid: string, data: Member }): JSX.Element {
    const {sid, data} = props;
    const [name, setName] = useState<string | undefined>(undefined);
    const [school, setSchool] = useState<string | undefined>(undefined);
    const [grade, setGrade] = useState<number | undefined>(undefined);
    const [clazz, setClazz] = useState<string | undefined>(undefined);
    const [luoguId, setLuoguId] = useState<string | undefined>(undefined);
    const [codeforcesId, setCodeforcesId] = useState<string | undefined>(undefined);
    const [atcoderId, setAtcoderId] = useState<string | undefined>(undefined);
    const [codechefId, setCodechefId] = useState<string | undefined>(undefined);
    const [nowcoderId, setNowcoderId] = useState<string | undefined>(undefined);
    const [vjudgeId, setVjudgeId] = useState<string | undefined>(undefined);
    const [leetcodeId, setLeetcodeId] = useState<string | undefined>(undefined);
    const [email, setEmail] = useState<string | undefined>(undefined);
    const [pwd, setPwd] = useState('');
    const [newPwd, setNewPwd] = useState<string | undefined>(undefined);
    const [teamName, setTeamName] = useState<string | undefined>(undefined);
    const [alert, setAlert] = useState(<></>);
    const [checked, setChecked] = useState<boolean>(data.getIsOfficial()?.getValue());
    const onUpdateUser = () => {
        const token = GetToken();
        if (token === undefined) {
            return;
        }
        if (sid === data.getSid()?.getValue() && pwd === '') {
            setAlert(<Alert variant="outlined" severity="error" sx={{width: '30%'}} onClose={() => {
                setAlert(<></>);
            }}>
                密码为空
            </Alert>)
            return;
        }
        const request = new UpdateMemberRequest().setPwd(pwd);
        if (newPwd !== undefined) {
            request.setNewPwd(newPwd);
        }
        const member = new Member().setSid(new wrappers_pb.StringValue().setValue(data.getSid()?.getValue() || ''));
        if (name !== undefined) {
            member.setName(new wrappers_pb.StringValue().setValue(name));
        }
        if (school !== undefined) {
            member.setSchool(new wrappers_pb.StringValue().setValue(school));
        }
        if (grade !== undefined) {
            member.setGrade(new wrappers_pb.Int32Value().setValue(grade));
        }
        if (clazz !== undefined) {
            member.setClazz(new wrappers_pb.StringValue().setValue(clazz));
        }
        if (luoguId !== undefined) {
            member.setLuoguId(new wrappers_pb.StringValue().setValue(luoguId));
        }
        if (codeforcesId !== undefined) {
            member.setCodeforcesId(new wrappers_pb.StringValue().setValue(codeforcesId));
        }
        if (atcoderId !== undefined) {
            member.setAtcoderId(new wrappers_pb.StringValue().setValue(atcoderId));
        }
        if (codechefId !== undefined) {
            member.setCodechefId(new wrappers_pb.StringValue().setValue(codechefId));
        }
        if (nowcoderId !== undefined) {
            member.setNowcoderId(new wrappers_pb.StringValue().setValue(nowcoderId));
        }
        if (vjudgeId !== undefined) {
            member.setVjudgeId(new wrappers_pb.StringValue().setValue(vjudgeId));
        }
        if (leetcodeId !== undefined) {
            member.setLeetcodeId(new wrappers_pb.StringValue().setValue(leetcodeId));
        }
        if (email !== undefined) {
            member.setEmail(new wrappers_pb.StringValue().setValue(email));
        }
        member.setIsOfficial(new wrappers_pb.BoolValue().setValue(checked));
        if (teamName !== undefined) {
            member.setTeamName(new wrappers_pb.StringValue().setValue(teamName));
        }
        request.setMember(member);
        WebClient.updateMember(request, {'token': token}, (err, response) => {
            if (err) {
                setAlert(<Alert variant="outlined" severity="error" sx={{width: '30%'}} onClose={() => {
                    setAlert(<></>);
                }}>
                    更新信息错误：{err.message}
                </Alert>);
            } else {
                window.location.reload();
            }
        });
    };
    const UpdateElementBox = (props: { children: ReactNode }) => {
        const sx = {'& > :not(style)': {m: 1, width: '25ch'}};
        return (
            <Box component="form" sx={sx} noValidate autoComplete="off">
                {props.children}
            </Box>
        );
    };
    const [form, setForm] = useState(<></>);
    useEffect(() => {
        setForm(
            <>
                <UpdateElementBox>
                    <TextField variant="standard" label="姓名" defaultValue={data.getName().toString()} onChange={(e) => {
                        setName(e.target.value);
                    }}/>
                    <TextField variant="standard" label="学校" defaultValue={data.getSchool().toString()} onChange={(e) => {
                        setSchool(e.target.value);
                    }}/>
                    <TextField variant="standard" label="年级" type="number" defaultValue={data.getGrade().toString()} onChange={(e) => {
                        setGrade(parseInt(e.target.value));
                    }}/>
                    <TextField variant="standard" label="班级" defaultValue={data.getClazz().toString()} onChange={(e) => {
                        setClazz(e.target.value);
                    }}/>
                    <TextField variant="standard" label="Email" defaultValue={data.getClazz().toString()} onChange={(e) => {
                        setEmail(e.target.value);
                    }}/>
                </UpdateElementBox>
                <UpdateElementBox>
                    <TextField variant="standard" label="Codeforces ID" defaultValue={data.getCodeforcesId().toString()} onChange={(e) => {
                        setCodeforcesId(e.target.value);
                    }}/>
                    <TextField variant="standard" label="AtCoder ID" defaultValue={data.getAtcoderId().toString()} onChange={(e) => {
                        setAtcoderId(e.target.value);
                    }}/>
                    <TextField variant="standard" label="CodeChef ID" defaultValue={data.getCodechefId().toString()} onChange={(e) => {
                        setCodechefId(e.target.value);
                    }}/>
                    <TextField variant="standard" label="NowCoder ID" defaultValue={data.getNowcoderId().toString()} onChange={(e) => {
                        setNowcoderId(e.target.value);
                    }}/>
                    <TextField variant="standard" label="Vjudge ID" defaultValue={data.getVjudgeId().toString()} onChange={(e) => {
                        setVjudgeId(e.target.value);
                    }}/>
                    <TextField variant="standard" label="LeetCode ID" defaultValue={data.getLeetcodeId().toString()} onChange={(e) => {
                        setLeetcodeId(e.target.value);
                    }}/>
                    <TextField variant="standard" label="Luogu ID" defaultValue={data.getLuoguId().toString()} onChange={(e) => {
                        setLuoguId(e.target.value);
                    }}/>
                </UpdateElementBox>
                <UpdateElementBox>
                    {
                        sid === data.getSid().toString() ?
                        <TextField variant="standard" label="密码" type="password" helperText=" " required={true}
                                   onChange={(e) => {
                                       setPwd(e.target.value);
                                   }}/> : <></>
                    }
                    <TextField variant="standard" label="新密码" type="password" helperText="不填则不修改" onChange={(e) => {
                        setNewPwd(e.target.value);
                    }}/>
                </UpdateElementBox>
            </>
        );
    }, []);
    return sid === data.getSid().toString() || sid === 'admin' ? (
        <ProfileAccordion defaultExpanded={true}>
            <ProfileAccordionSummary>
                <Typography component="div">更新信息</Typography>
            </ProfileAccordionSummary>
            <ProfileAccordionDetails>
                {alert}
                {form}
                {
                    sid === 'admin' ? (
                        <Box component="form" noValidate autoComplete="off">
                            <FormControlLabel label="是否校队成员" control={
                                <Switch checked={checked} onChange={(e) => {
                                    const checked = e.target.checked;
                                    setChecked(checked);
                                    if (!checked) {
                                        setTeamName(undefined);
                                    }
                                }}/>
                            }/>
                            {
                                checked ? (
                                    <TextField variant="standard" label="队名" required={true} onChange={(e) => {
                                        setTeamName(e.target.value);
                                    }}/>
                                ) : <></>
                            }
                        </Box>
                    ) : <></>
                }
                <UpdateElementBox>
                    <Button variant="contained" style={{width: '1em'}} onClick={onUpdateUser}>确定</Button>
                </UpdateElementBox>
            </ProfileAccordionDetails>
        </ProfileAccordion>
    ) : <></>;
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

function ProfileMain(props: { sid: string, data: Member }): JSX.Element {
    const {sid, data} = props;
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
            <ProfileAccordion defaultExpanded={true}>
                <ProfileAccordionSummary>
                    <Typography component="div">比赛经历</Typography>
                </ProfileAccordionSummary>
                <ProfileAccordionDetails>
                    {PaperElement(
                        <ContestLine platform="codeforces" handle={data.getCodeforcesId().toString()}/>,
                        <ContestLine platform="atcoder" handle={data.getAtcoderId().toString()}/>,
                        <ContestLine platform="nowcoder" handle={data.getNowcoderId().toString()}/>,
                        <ContestLine platform="leetcode" handle={data.getLeetcodeId().toString()}/>,
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
            <UpdateElement sid={sid} data={data}/>
        </div>
    );
}

type ProfileProps = {};

export default function Profile(props: ProfileProps): JSX.Element {
    const query = queryString.parse(window.location.search);
    const sid = typeof query['sid'] === 'string' ? query['sid'] : '';
    const userSid = GetSid();
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
            {data === undefined ? <CircularProgress/> : data === null ? <>404</> : <ProfileMain sid={userSid} data={data}/>}
        </Nav>
    );
}