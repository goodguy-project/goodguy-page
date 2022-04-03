import {GoodguyWebServiceClient} from "../pb/goodguy_web_grpc_web_pb";

const hostname = 'http://127.0.0.1:9888';
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

export function RemoveToken() {
    window.localStorage.removeItem(TokenKeyName);
}

