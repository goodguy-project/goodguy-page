import * as React from 'react';
import {styled, useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import {
    Alert, AlertTitle,
    Backdrop,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from "@mui/material";
import {GetSid, RemoveToken, SaveToken, WebClient} from "../api/web/common";
import {LoginRequest, Member, RegisterRequest} from "../api/pb/goodguy-web_pb";
import CloseIcon from '@mui/icons-material/Close';

const wrappers_pb = require('google-protobuf/google/protobuf/wrappers_pb.js');

const drawerWidth = 240;

const Main = styled('main', {shouldForwardProp: (prop) => prop !== 'open'})<{
    open?: boolean;
}>(({theme, open}) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({theme, open}) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 2),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'space-between',
}));

const NavButtonStyle = {
    textDecoration: "none",
    color: "#000000",
};

type NavProps = {
    open?: boolean
    header?: string
    children?: React.ReactNode;
};

type PageElementProps = {
    text?: string
    href?: string
}

function PageElement(props: PageElementProps): JSX.Element {
    const text = props.text || "";
    const href = props.href || "";
    return (
        <a href={href} style={NavButtonStyle}>
            <ListItem button key={text}>
                <ListItemText primary={text}/>
            </ListItem>
        </a>
    );
}

type DialogProps = {
    open: boolean
    setOpen: (open: boolean) => void
};

function LoginDialog(props: DialogProps): JSX.Element {
    const [progressing, setProgressing] = React.useState(false);
    const [getError, setGetError] = React.useState(false);
    const [errMsg, setErrMsg] = React.useState('');
    const onClose = () => {
        setProgressing(false);
        setGetError(false);
        props.setOpen(false);
    };
    const [sid, setSid] = React.useState('');
    const [pwd, setPwd] = React.useState('');
    const doLogin = () => {
        if (sid === '') {
            setErrMsg('用户名不能为空');
            setGetError(true);
            return;
        }
        if (pwd === '') {
            setErrMsg('密码不能为空');
            setGetError(true);
            return;
        }
        const request = new LoginRequest();
        request.setSid(sid);
        request.setPwd(pwd);
        setProgressing(true);
        WebClient.login(request, {}, (err, response) => {
            setProgressing(false);
            if (err) {
                setGetError(true);
                setErrMsg('请检查用户名或密码是否正确');
            } else {
                const token = response.getToken();
                SaveToken(token);
                onClose();
                window.location.reload();
            }
        });
    };
    return (
        <div>
            <Dialog sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}} open={props.open}>
                {
                    getError ? (
                        <Alert severity="error" action={
                            <IconButton aria-label="close" size="small" color="inherit" onClick={() => {
                                setGetError(false);
                            }}><CloseIcon fontSize="inherit"/></IconButton>
                        }>
                            <AlertTitle>登录错误</AlertTitle>{errMsg}
                        </Alert>
                    ) : <></>
                }
                <DialogTitle>登录</DialogTitle>
                <DialogContent>
                    <TextField margin="none" onChange={(e) => {
                        setSid(e.target.value);
                    }} label="用户名" fullWidth variant="standard" inputProps={{maxLength: 50}}/>
                    <TextField margin="none" onChange={(e) => {
                        setPwd(e.target.value);
                    }} label="密码" type="password" fullWidth variant="standard" onKeyDown={(e) => {
                        if (e.code === 'Enter') {
                            doLogin();
                        }
                    }}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={doLogin}>登录</Button>
                    <Button onClick={onClose}>取消</Button>
                </DialogActions>
                <Backdrop sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}} open={progressing}>
                    <CircularProgress/>
                </Backdrop>
            </Dialog>
        </div>
    );
}

function RegisterDialog(props: DialogProps): JSX.Element {
    const [progressing, setProgressing] = React.useState(false);
    const [getError, setGetError] = React.useState(false);
    const [errMsg, setErrMsg] = React.useState('');
    const onClose = () => {
        setProgressing(false);
        setGetError(false);
        props.setOpen(false);
    };
    const [sid, setSid] = React.useState('');
    const [pwd, setPwd] = React.useState('');
    const [name, setName] = React.useState('');
    const [school, setSchool] = React.useState('');
    const [grade, setGrade] = React.useState('');
    const [clazz, setClazz] = React.useState('');
    const [luoguId, setLuoguId] = React.useState('');
    const [codeforcesId, setCodeforcesId] = React.useState('');
    const [atcoderId, setAtcoderId] = React.useState('');
    const [codechefId, setCodechefId] = React.useState('');
    const [nowcoderId, setNowcoderId] = React.useState('');
    const [vjudgeId, setVjudgeId] = React.useState('');
    const [leetcodeId, setLeetcodeId] = React.useState('');
    const [email, setEmail] = React.useState('');
    const doRegister = () => {
        if (sid === '') {
            setErrMsg('用户名不能为空');
            setGetError(true);
            return;
        }
        if (pwd === '') {
            setErrMsg('密码不能为空');
            setGetError(true);
            return;
        }
        if (isNaN(parseInt(grade, 10))) {
            setErrMsg('Grade is NaN');
            setGetError(true);
            return;
        }
        const request = new RegisterRequest();
        const member = new Member();
        member.setSid(new wrappers_pb.StringValue().setValue(sid));
        member.setName(new wrappers_pb.StringValue().setValue(name));
        member.setSchool(new wrappers_pb.StringValue().setValue(school));
        member.setGrade(new wrappers_pb.Int32Value().setValue(parseInt(grade, 10)));
        member.setClazz(new wrappers_pb.StringValue().setValue(clazz));
        member.setCodeforcesId(new wrappers_pb.StringValue().setValue(codeforcesId));
        member.setAtcoderId(new wrappers_pb.StringValue().setValue(atcoderId));
        member.setCodechefId(new wrappers_pb.StringValue().setValue(codechefId));
        member.setNowcoderId(new wrappers_pb.StringValue().setValue(nowcoderId));
        member.setVjudgeId(new wrappers_pb.StringValue().setValue(vjudgeId));
        member.setLeetcodeId(new wrappers_pb.StringValue().setValue(leetcodeId));
        member.setLuoguId(new wrappers_pb.StringValue().setValue(luoguId));
        member.setEmail(new wrappers_pb.StringValue().setValue(email));
        request.setMember(member);
        request.setPwd(pwd);
        setProgressing(true);
        WebClient.register(request, {}, (err, response) => {
            setProgressing(false);
            if (err) {
                setGetError(true);
                setErrMsg(err.message);
            } else {
                const token = response.getToken();
                SaveToken(token);
                onClose();
                window.location.reload();
            }
        });
    };
    return (
        <div>
            <Dialog sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}} open={props.open}>
                {
                    getError ? (
                        <Alert severity="error" action={
                            <IconButton aria-label="close" size="small" color="inherit" onClick={() => {
                                setGetError(false);
                            }}><CloseIcon fontSize="inherit"/></IconButton>
                        }>
                            <AlertTitle>注册错误</AlertTitle>{errMsg}
                        </Alert>
                    ) : <></>
                }
                <DialogTitle>注册</DialogTitle>
                <DialogContent>
                    <TextField margin="none" onChange={(e) => {
                        setSid(e.target.value);
                    }} label="用户名" fullWidth variant="standard" inputProps={{maxLength: 50}}/>
                    <Typography variant="caption" component="div" color="#000000AA">
                        用户名不能为空且不能与他人重复 只能由英文字母、数字和下划线组成
                    </Typography>
                    <TextField margin="none" onChange={(e) => {
                        setPwd( e.target.value);
                    }} label="密码" type="password" fullWidth variant="standard"/>
                    <Typography variant="caption" component="div" color="#000000AA">
                        密码除不能为空外没有特殊要求 但为了方便请设置一个合适的密码
                    </Typography>
                    <TextField margin="none" onChange={(e) => {
                        setName(e.target.value);
                    }} label="姓名" fullWidth variant="standard"/>
                    <TextField margin="none" onChange={(e) => {
                        setEmail(e.target.value);
                    }} label="Email" fullWidth variant="standard"/>
                    <TextField margin="none" onChange={(e) => {
                        setSchool(e.target.value);
                    }} label="学校"  fullWidth variant="standard"/>
                    <TextField margin="none" onChange={(e) => {
                        setGrade(e.target.value);
                    }} label="年级" type="number" fullWidth variant="standard"/>
                    <TextField margin="none" onChange={(e) => {
                        setClazz(e.target.value);
                    }} label="班级"  fullWidth variant="standard"/>
                    <TextField margin="none" onChange={(e) => {
                        setCodeforcesId(e.target.value);
                    }} label="CodeForces ID" fullWidth variant="standard"/>
                    <TextField margin="none" onChange={(e) => {
                        setAtcoderId(e.target.value);
                    }} label="AtCoder ID" fullWidth variant="standard"/>
                    <TextField margin="none" onChange={(e) => {
                        setNowcoderId(e.target.value);
                    }} label="Nowcoder ID" fullWidth variant="standard"/>
                    <TextField margin="none" onChange={(e) => {
                        setVjudgeId(e.target.value);
                    }} label="Vjudge ID" fullWidth variant="standard"/>
                    <TextField margin="none" onChange={(e) => {
                        setLeetcodeId(e.target.value);
                    }} label="LeetCode ID" fullWidth variant="standard"/>
                    <TextField margin="none" onChange={(e) => {
                        setLuoguId(e.target.value);
                    }} label="Luogu ID" fullWidth variant="standard"/>
                    <TextField margin="none" onChange={(e) => {
                        setCodechefId(e.target.value);
                    }} label="CodeChef ID" fullWidth variant="standard"/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={doRegister}>注册</Button>
                    <Button onClick={onClose}>取消</Button>
                </DialogActions>
                <Backdrop sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}} open={progressing}>
                    <CircularProgress/>
                </Backdrop>
            </Dialog>
        </div>
    );
}

export default function Nav(props: NavProps) {
    const theme = useTheme();
    const [open, setOpen] = React.useState(props.open === true);
    const HandleDrawerOpen = () => {
        setOpen(true);
    };
    const HandleDrawerClose = () => {
        setOpen(false);
    };

    const [loginDialogOpen, setLoginDialogOpen] = React.useState(false);
    const [registerDialogOpen, setRegisterDialogOpen] = React.useState(false);

    const PageList = (
        <>
            <PageElement text="首页" href="/"/>
            <PageElement text="用户列表" href="/user-list"/>
            {/* TODO 校队成员列表暂缓 */}
            {/*<PageElement text="校队成员列表" href="/official-list"/>*/}
        </>
    );

    const sid = GetSid();

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <AppBar position="fixed" open={open}>
                <Toolbar style={{justifyContent: 'space-between'}}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={HandleDrawerOpen}
                            edge="start"
                            sx={{mr: 2, ...(open && {display: 'none'})}}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">
                            {props.header}
                        </Typography>
                    </div>
                    <div>
                        {
                            sid ? (
                                <>
                                    <Button variant="text" color="inherit" onClick={() => {
                                        window.location.href = `/profile/?sid=${sid}`;
                                    }} style={{textTransform: 'none'}}>{sid}</Button>
                                    <Button variant="text" color="inherit" onClick={() => {
                                        RemoveToken();
                                        window.location.reload();
                                    }}>登出</Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="text" color="inherit" onClick={() => {
                                        setLoginDialogOpen(true)
                                    }}>登录</Button>
                                    <Button variant="text" color="inherit" onClick={() => {
                                        setRegisterDialogOpen(true)
                                    }}>注册</Button>
                                </>
                            )
                        }
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    训练中台
                    <IconButton onClick={HandleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                    </IconButton>
                </DrawerHeader>
                <Divider/>
                <List>
                    {PageList}
                </List>
            </Drawer>
            <Main open={open}>
                <DrawerHeader/>
                {props.children}
            </Main>
            <LoginDialog open={loginDialogOpen} setOpen={setLoginDialogOpen}/>
            <RegisterDialog open={registerDialogOpen} setOpen={setRegisterDialogOpen}/>
        </Box>
    );
}
