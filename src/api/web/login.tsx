import {LoginRequest, LoginResponse} from "../pb/goodguy_web_pb";
import {WebClient} from "./common";

export default function Login(request: LoginRequest) {
    return new Promise<LoginResponse>((resolve, reject) => {
        WebClient.login(request, {}, (err, response) => {
            return err ? reject(err) : resolve(response);
        });
    });
}