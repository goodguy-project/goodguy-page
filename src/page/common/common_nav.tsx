import "./common_nav.sass"
import {Container, Nav, Navbar} from "react-bootstrap";
import {GetLoginData} from "./login_data";
import {CommonGetRequest, Member} from "../../api/pb/goodguy-web_pb";
import State from "../../util/state";
import {CommonGet} from "../../api/web/admin";

class Page {
    path: string
    title: string

    constructor(path: string, title: string) {
        this.path = path;
        this.title = title;
    }
}

const pages = [
    new Page('/', '首页'),
    new Page('/userlist', '用户列表'),
];

type CommonNavProps = {
    loginData?: State<Member>
};

export default function CommonNav(props: CommonNavProps): JSX.Element {
    const loginData = props.loginData || GetLoginData();
    const member = loginData.value;
    const commonGetData = CommonGet();
    const EndElement = (member === undefined || member === null) ? (
        <Navbar.Collapse className="justify-content-end">
            <Nav>
                <Nav.Link title="登录" href="/login">登录</Nav.Link>
                {commonGetData?.getOpenRegister() ? <Nav.Link title="注册" href="/register">注册</Nav.Link> : <></>}
            </Nav>
        </Navbar.Collapse>
    ) : (
        <Navbar.Collapse className="justify-content-end">
            <Nav>
                <Nav.Link title="点击修改个人信息" href="/update">{member.getSid()}</Nav.Link>
                <Nav.Link title="退出登录" href="/logout">退出登录</Nav.Link>
            </Nav>
        </Navbar.Collapse>
    );
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand>训练中台</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {
                            pages.map((page, index) => {
                                return <Nav.Link key={index} href={page.path}>{page.title}</Nav.Link>
                            })
                        }
                        {
                            member !== undefined && member !== null ? (
                                <Nav.Link href="/admin">管理员</Nav.Link>
                            ) : <></>
                        }
                    </Nav>
                </Navbar.Collapse>
                {EndElement}
            </Container>
        </Navbar>
    );
}
