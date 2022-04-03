import {RemoveToken} from "../../api/web/common";

export default function Logout() {
    RemoveToken();
    document.location = '/';
    return <></>;
}