import '../common/common.sass'
import {GetLoginData} from "../common/login_data";
import {RedirectToIndex} from "../common/common";
import CommonNav from "../common/common_nav";
import State, {Status} from "../../util/state";
import {Button, FormControl, Table} from "react-bootstrap";
import {AdminGetRequest, AdminGetResponse, EmailConf, Op} from "../../api/pb/goodguy-web_pb";
import {ChangeEvent, useState} from "react";
import {AdminGet, AdminSet} from "../../api/web/admin";
import {PopupElement} from "../common/alert";

type PageProps = {
    state: State<AdminGetResponse>
};

function EmailConfPage(props: PageProps): JSX.Element {
    const alert = PopupElement("danger");
    const response = props.state.value;
    const onDelete = (email: string) => {
        return () => {
            const emailConf = new EmailConf();
            emailConf.setEmail(email);
            emailConf.setOp(Op.OP_DELETE);
            AdminSet({emailConf: [emailConf]}).then((response) => {
                window.location.reload();
            }).catch((err) => {
                alert.setMessage(err.toString());
                alert.setShow(true);
            });
        };
    };
    const addEmailConf: EmailConf = new EmailConf();
    addEmailConf.setOp(Op.OP_ADD);
    const onAdd = () => {
        AdminSet({emailConf: [addEmailConf]}).then((response) => {
            window.location.reload();
        }).catch((err) => {
            alert.setMessage(err.toString());
            alert.setShow(true);
        });
    };
    const EmailConfTable = (): JSX.Element => {
        const emailConf = response?.getEmailConfList();
        if (emailConf === undefined) {
            return <></>;
        }
        return (
            <>
                {
                    emailConf?.map((value, index) => {
                        return (
                            <tr key={index}>
                                <th>{value.getEmail()}</th>
                                <th>{value.getSmtpHost()}</th>
                                <th>{value.getSmtpPort()}</th>
                                <th>{value.getPwd()}</th>
                                <th><Button onClick={onDelete(value.getEmail())}>Delete</Button></th>
                            </tr>
                        );
                    })
                }
            </>
        );
    };
    return (
        <>
            <alert.element/>
            <h2>邮件发送设置</h2>
            {
                response === null || response === undefined ? (
                    <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
                        &nbsp;Loading Recent Contest...
                    </>
                ) : (
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>E-mail</th>
                            <th>SMTP Host</th>
                            <th>SMTP Port</th>
                            <th>Password</th>
                            <th>Op</th>
                        </tr>
                        </thead>
                        <tbody>
                        <EmailConfTable/>
                        <tr>
                            <th><FormControl onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                addEmailConf.setEmail(event.target.value);
                            }} placeholder="E-mail"/></th>
                            <th><FormControl onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                addEmailConf.setSmtpHost(event.target.value);
                            }} placeholder="SMTP Host"/></th>
                            <th><FormControl onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                addEmailConf.setSmtpPort(Number(event.target.value));
                            }} placeholder="SMTP Port" type="number"/></th>
                            <th><FormControl onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                addEmailConf.setPwd(event.target.value);
                            }} placeholder="Password"/></th>
                            <th><Button onClick={onAdd}>Add</Button></th>
                        </tr>
                        </tbody>
                    </Table>
                )
            }
        </>
    );
}

function Page(): JSX.Element {
    const [state, setState] = useState(new State<AdminGetResponse>());
    if (state.runnable()) {
        state.gao(new Promise<AdminGetResponse>((resolve, reject) => {
            const request = new AdminGetRequest();
            AdminGet(request).then((response) => {
                resolve(response);
            }).catch((err) => {
                reject(err);
            });
        }), setState);
    }
    return (
        <>
            <EmailConfPage state={state}/>
        </>
    );
}

export default function AdminPage(): JSX.Element {
    const loginData = GetLoginData();
    const member = loginData.value;
    if (member !== undefined && member !== null && member.getSid() === "admin") {
        return (
            <>
                <CommonNav/>
                <div className="goodguy-body">
                    <Page/>
                </div>
            </>
        );
    }
    if (loginData.status === Status.Running) {
        return <CommonNav/>;
    }
    return <RedirectToIndex/>;
}