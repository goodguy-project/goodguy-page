import {Member} from "../../api/pb/goodguy-web_pb";
import {useState} from "react";
import GetMember from "../../api/web/get_member";
import {GetToken} from "../../api/web/common";
import State from "../../util/state";
import CheckToken from "../../api/web/check_token";

export function GetLoginData(): State<Member> {
    const [state, setState] = useState<State<Member>>(new State<Member>());
    if (!state.runnable()) {
        return state;
    }
    state.gao(new Promise<Member>((resolve, reject) => {
        const token = GetToken();
        if (token === undefined) {
            reject("login without token");
            return;
        }
        CheckToken(token).then((value) => {
            if (!value.getOk()) {
                reject("token is expired");
                return;
            }
            GetMember(1, 10, {sid:[value.getSid()]}).then((response) => {
                const list = response.getMemberList();
                if (list.length !== 1) {
                    reject("server error");
                } else {
                    resolve(list[0]);
                }
            }).catch((err) => {
                reject(err);
            });
        }).catch((err) => {
            reject(err);
        });
    }), setState);
    return state;
}