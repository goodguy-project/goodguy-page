import {RegisterRequest, RegisterResponse} from "../pb/goodguy_web_pb";
import {WebClient} from "./common";

export default function Register(request: RegisterRequest) {
    return new Promise<RegisterResponse>((resolve, reject) => {
        WebClient.register(request, {'token': "123"}, (err, response) => {
            return err ? reject(err) : resolve(response);
        });
    });
}