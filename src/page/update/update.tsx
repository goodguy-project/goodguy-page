import CommonNav from "../common/common_nav";
import {useState} from "react";
import {UpdateMemberRequest} from "../../api/pb/goodguy_web_pb";
import ConstructMember from "../common/member";
import {GetInputGroup} from "../common/input";
import {GetLoginData} from "../common/login_data";
import {PopupElement} from "../common/alert";
import {Button, Form} from "react-bootstrap";
import UpdateMember from "../../api/web/update_member";
import {RemoveToken} from "../../api/web/common";

function updateButton(getRequest: () => UpdateMemberRequest): () => JSX.Element {
    const success = PopupElement("success", undefined, () => {
        window.location.reload();
    });
    const SuccessElement = success.element;
    const alert = PopupElement("danger", undefined, () => {
        RemoveToken();
        document.location = '/';
    });
    const AlertElement = alert.element;
    const onClick = () => {
        const promise = UpdateMember(getRequest());
        promise.then((response) => {
            success.setMessage('update OK');
            success.setShow(true);
        }).catch((err) => {
            alert.setMessage(err.toString());
            alert.setShow(true);
        });
    };
    return () => {
        return (
            <>
                <Button onClick={onClick}>
                    更新
                </Button>
                <AlertElement/>
                <SuccessElement/>
            </>
        );
    };
}

function Input(): JSX.Element {
    const loginData = GetLoginData();
    const member = loginData.value;
    const [name, setName] = useState(member?.getName());
    const [school, setSchool] = useState(member?.getSchool());
    const [grade, setGrade] = useState(member?.getGrade()?.toString());
    const [clazz, setClazz] = useState(member?.getClazz());
    const [email, setEmail] = useState(member?.getEmail());
    const [codeforces, setCodeforces] = useState(member?.getCodeforcesId());
    const [atcoder, setAtcoder] = useState(member?.getAtcoderId());
    const [codechef, setCodechef] = useState(member?.getCodechefId());
    const [nowcoder, setNowcoder] = useState(member?.getNowcoderId());
    const [vjudge, setVjudge] = useState(member?.getVjudgeId());
    const [leetcode, setLeetcode] = useState(member?.getLeetcodeId());
    const [luogu, setLuogu] = useState(member?.getLuoguId());
    const FormButton = updateButton(() => {
        const request = new UpdateMemberRequest();
        request.setMember(ConstructMember(
            undefined,
            name ? name : member?.getName(),
            school ? school : member?.getSchool(),
            grade ? grade : member?.getGrade().toString(),
            clazz ? clazz : member?.getClazz(),
            email ? email : member?.getEmail(),
            codeforces ? codeforces : member?.getCodeforcesId(),
            atcoder ? atcoder : member?.getAtcoderId(),
            codechef ? codechef : member?.getCodechefId(),
            nowcoder ? nowcoder : member?.getNowcoderId(),
            vjudge ? vjudge : member?.getVjudgeId(),
            leetcode ? leetcode : member?.getLeetcodeId(),
            luogu ? luogu : member?.getLuoguId(),
        ));
        return request;
    });
    return (
        <div className="goodguy-total">
            <p className="goodguy-title">Update</p>
            <GetInputGroup setValue={setName} text={"姓名"} value={member?.getName()}/>
            <GetInputGroup setValue={setSchool} text={"学校"} value={member?.getSchool()}/>
            <GetInputGroup setValue={setGrade} text={"年级"} type={"number"} value={member?.getGrade()}/>
            <GetInputGroup setValue={setClazz} text={"班级"} value={member?.getClazz()}/>
            <GetInputGroup setValue={setEmail} text={"邮箱"} value={member?.getEmail()}/>
            <GetInputGroup setValue={setCodeforces} text={"Codeforces ID"} value={member?.getCodeforcesId()}/>
            <GetInputGroup setValue={setAtcoder} text={"Atcoder ID"} value={member?.getAtcoderId()}/>
            <GetInputGroup setValue={setCodechef} text={"Codechef ID"} value={member?.getCodechefId()}/>
            <GetInputGroup setValue={setNowcoder} text={"Nowcoder ID"} value={member?.getNowcoderId()}/>
            <GetInputGroup setValue={setVjudge} text={"Vjudge ID"} value={member?.getVjudgeId()}/>
            <GetInputGroup setValue={setLeetcode} text={"Leetcode ID"} value={member?.getLeetcodeId()}/>
            <GetInputGroup setValue={setLuogu} text={"Luogu ID"} value={member?.getLuoguId()}/>
            <div className="goodguy-button">
                <FormButton/>
            </div>
        </div>
    );
}

export default function UpdatePage(): JSX.Element {
    return (
        <><CommonNav/><Input/></>
    );
}