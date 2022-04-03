import queryString from "query-string";
import {RedirectToIndex} from "../common/common";
import {useState} from "react";
import {Member} from "../../api/pb/goodguy_web_pb";
import State, {Status} from "../../util/state";
import GetMember from "../../api/web/get_member";
import CommonNav from "../common/common_nav";
import LineChart from "../../graph/line_chart";
import {OJ} from "../../graph/oj";

export default function ProfilePage(): JSX.Element {
    const [state, setState] = useState(new State<Member>());
    const query = queryString.parse(window.location.search);
    const sid = query['sid'];
    if (typeof (sid) === "string" && state.runnable()) {
        state.gao(new Promise<Member>((resolve, reject) => {
            GetMember(1, 10, {sid: [sid]}).then((response) => {
                const list = response.getMemberList();
                if (list.length !== 1) {
                    reject("no such user or server error");
                } else {
                    resolve(list[0]);
                }
            }).catch((err) => {
                reject(err);
            });
        }), setState);
    }
    const member = state.value;
    const body = state.status === Status.Failed ? (
        <RedirectToIndex/>
    ) : state.status === Status.OK && member !== undefined && member !== null ? (
        <LineChart oj={OJ.codeforces}/>
    ) : (
        <></>
    );
    return (
        <>
            <CommonNav/>
            {body}
        </>
    );
}
