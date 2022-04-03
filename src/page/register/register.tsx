import CommonNav from "../common/common_nav";
import {useState} from "react";
import {RegisterRequest} from "../../api/pb/goodguy_web_pb";
import {GetInputGroup} from "../common/input";
import {PopupElement} from "../common/alert";
import {Button} from "react-bootstrap";
import Register from "../../api/web/register";
import ConstructMember from "../common/member";

function registerButton(getRequest: () => RegisterRequest): () => JSX.Element {
    const alert = PopupElement("danger");
    const AlertElement = alert.element;
    const onClick = () => {
        const promise = Register(getRequest());
        promise.catch((err) => {
            alert.setMessage(err.toString());
            alert.setShow(true);
        });
    };
    return () => {
        return (
            <>
                <Button onClick={onClick}>
                    注册
                </Button>
                <AlertElement/>
            </>
        );
    };
}

function Input(): JSX.Element {
    const [sid, setSid] = useState('');
    const [pwd, setPwd] = useState('');
    const [name, setName] = useState('');
    const [school, setSchool] = useState('');
    const [grade, setGrade] = useState((new Date()).getFullYear().toString());
    const [clazz, setClazz] = useState('');
    const [email, setEmail] = useState('');
    const [codeforces, SetCodeforces] = useState('');
    const [atcoder, SetAtcoder] = useState('');
    const [codechef, SetCodechef] = useState('');
    const [nowcoder, SetNowcoder] = useState('');
    const [vjudge, SetVjudge] = useState('');
    const [leetcode, SetLeetcode] = useState('');
    const [luogu, SetLuogu] = useState('');
    const FormButton = registerButton(() => {
        const request = new RegisterRequest();
        const member = ConstructMember(sid, name, school, grade, clazz, email, codeforces, atcoder, codechef,
            nowcoder, vjudge, leetcode, luogu);
        request.setMember(member);
        request.setPwd(pwd);
        return request;
    });
    return (
        <div className="goodguy-total">
            <p className="goodguy-title">Register</p>
            <GetInputGroup setValue={setSid} text={"用户名"} placeholder={"只能输入英文和数字"} required={true}/>
            <GetInputGroup setValue={setPwd} text={"密码"} placeholder={"不能为空"} type={"password"} required={true}/>
            <GetInputGroup setValue={setName} text={"姓名"}/>
            <GetInputGroup setValue={setSchool} text={"学校"}/>
            <GetInputGroup setValue={setGrade} text={"年级"} type={"number"} value={grade}/>
            <GetInputGroup setValue={setClazz} text={"班级"}/>
            <GetInputGroup setValue={setEmail} text={"邮箱"}/>
            <GetInputGroup setValue={SetCodeforces} text={"Codeforces ID"}/>
            <GetInputGroup setValue={SetAtcoder} text={"Atcoder ID"}/>
            <GetInputGroup setValue={SetCodechef} text={"Codechef ID"}/>
            <GetInputGroup setValue={SetNowcoder} text={"Nowcoder ID"}/>
            <GetInputGroup setValue={SetVjudge} text={"Vjudge ID"}/>
            <GetInputGroup setValue={SetLeetcode} text={"Leetcode ID"}/>
            <GetInputGroup setValue={SetLuogu} text={"Luogu ID"}/>
            <div className="goodguy-button">
                <FormButton/>
            </div>
        </div>
    );
}

export default function RegisterPage(): JSX.Element {
    return (
        <><CommonNav/><Input/></>
    );
}