import CommonNav from "../common/common_nav";
import {LoginRequest} from "../../api/pb/goodguy-web_pb";
import {PopupElement, Popup} from "../common/alert";
import {Button} from "react-bootstrap";
import Login from "../../api/web/login";
import {  KeyboardEvent, useState} from "react";
import {GetInputGroup} from "../common/input";
import {SaveToken} from "../../api/web/common";

function doLogin(getRequest: () => LoginRequest, alert: Popup) {
    return () => {
        const promise = Login(getRequest());
        promise.then((response) => {
            const token = response.getToken();
            SaveToken(token);
            document.location = '/';
        }).catch((err) => {
            alert.setMessage('用户名或密码错误');
            alert.setShow(true);
        });
    }
}

function LoginButton(getRequest: () => LoginRequest, alert: Popup): () => JSX.Element {
    const AlertElement = alert.element;
    const onClick = doLogin(getRequest, alert);
    return () => {
        return (
            <>
                <Button onClick={onClick}>
                    登录
                </Button>
                <AlertElement/>
            </>
        );
    };
}

function Input(): JSX.Element {
    const [sid, setSid] = useState('');
    const [pwd, setPwd] = useState('');
    const getRequest = () => {
        const request = new LoginRequest();
        request.setSid(sid);
        request.setPwd(pwd);
        return request;
    }
    const popup = PopupElement("danger");
    const FormButton = LoginButton(getRequest, popup);
    const PwdInputEvent = (event: KeyboardEvent)=>{
        if (event.key === "Enter") {
            doLogin(getRequest, popup)();
        }
    };
    return (
        <div className="goodguy-total">
            <p className="goodguy-title">Login</p>
            <GetInputGroup setValue={setSid} text={"用户名"}/>
            <GetInputGroup setValue={setPwd} text={"密码"} type={"password"} onKeyPress={PwdInputEvent}/>
            <div className="goodguy-button">
                <FormButton/>
            </div>
        </div>
    );
}

export default function LoginPage(): JSX.Element {
    return (
        <><CommonNav/><Input/></>
    );
}