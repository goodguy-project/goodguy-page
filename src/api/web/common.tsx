import {GoodguyWebServiceClient} from "../pb/goodguy-web_grpc_web_pb";
import {useEffect, useState} from "react";
import {CheckTokenRequest} from "../pb/goodguy-web_pb";

const hostname = 'http://127.0.0.1:9853';
export const WebClient = new GoodguyWebServiceClient(hostname);

const TokenKeyName = 'goodguy-web-token';

export function SaveToken(token: string) {
    window.localStorage.setItem(TokenKeyName, token)
}

export function GetToken(): string | undefined {
    const token = window.localStorage.getItem(TokenKeyName);
    if (token === null) {
        return undefined;
    }
    return token;
}

export function GetSid(): string {
    const [sid, setSid] = useState('');
    useEffect(() => {
        const token = GetToken();
        if (token !== undefined) {
            const request = new CheckTokenRequest();
            request.setToken(token);
            WebClient.checkToken(request, {}, (err, response) => {
                if (!err && response.getOk()) {
                    setSid(response.getSid());
                }
            });
        }
    }, []);
    return sid;
}

export function RemoveToken() {
    window.localStorage.removeItem(TokenKeyName);
}

