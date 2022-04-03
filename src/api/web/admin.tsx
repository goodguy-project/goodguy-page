import {
    AdminGetRequest,
    AdminGetResponse,
    AdminSetRequest,
    AdminSetResponse, Bool,
    CommonGetRequest,
    CommonGetResponse, EmailConf,
} from "../pb/goodguy_web_pb";
import {GetToken, WebClient} from "./common";
import {useEffect, useState} from "react";

export function AdminGet(request: AdminGetRequest): Promise<AdminGetResponse> {
    return new Promise<AdminGetResponse>((resolve, reject) => {
        const token = GetToken();
        if (token === undefined) {
            reject("login without token");
            return;
        }
        WebClient.adminGet(request, {'token': token}, (err, response) => {
            return err ? reject(err) : resolve(response);
        });
    });
}

export function CommonGet(): CommonGetResponse | undefined {
    const [state, setState] = useState<CommonGetResponse | undefined>(undefined);
    useEffect(() => {
        WebClient.commonGet(new CommonGetRequest(), {}, (err, response) => {
            return err ? console.log(err) : setState(response);
        });
    }, []);
    return state;
}

type AdminSetParams = {
    emailConf?: Array<EmailConf>
    openRegister?: boolean;
};

export function AdminSet(param: AdminSetParams): Promise<AdminSetResponse> {
    return new Promise<AdminSetResponse>((resolve, reject) => {
        const token = GetToken();
        if (token === undefined) {
            reject("login without token");
            return;
        }
        const request = new AdminSetRequest();
        if (param.emailConf) {
            request.setEmailConfList(param.emailConf);
        }
        if (param.openRegister !== undefined) {
            request.setOpenRegister(param.openRegister ? Bool.BOOL_TRUE : Bool.BOOL_FALSE);
        }
        WebClient.adminSet(request, {'token': token}, (err, response) => {
            return err ? reject(err) : resolve(response);
        });
    });
}

