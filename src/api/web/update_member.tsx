import {UpdateMemberRequest, UpdateMemberResponse} from "../pb/goodguy_web_pb";
import {GetToken, WebClient} from "./common";

export default function UpdateMember(request: UpdateMemberRequest) {
    const token = GetToken();
    if (token === undefined) {
        return new Promise<UpdateMemberResponse>((resolve, reject) => {
            reject('token not found');
        });
    }
    return new Promise<UpdateMemberResponse>((resolve, reject) => {
        WebClient.updateMember(request, {'token': token}, (err, response) => {
            return err ? reject(err) : resolve(response);
        });
    });
}