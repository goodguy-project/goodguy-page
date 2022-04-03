import {CheckTokenRequest, CheckTokenResponse} from "../pb/goodguy_web_pb";
import {WebClient} from "./common";

export default function CheckToken(token: string): Promise<CheckTokenResponse> {
    const request = new CheckTokenRequest();
    request.setToken(token);
    return new Promise<CheckTokenResponse>((resolve, reject)=>{
        WebClient.checkToken(request, {}, (err, response)=>{
            return err ? reject(err) : resolve(response);
        });
    });
}