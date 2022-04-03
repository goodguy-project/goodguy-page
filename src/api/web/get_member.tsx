import {GetMemberRequest, GetMemberResponse} from "../pb/goodguy_web_pb";
import {WebClient} from "./common";

type GetMemberProps = {
    id?: number[],
    sid?: string[],
};

export default function GetMember(pageNo: number = 1, pageSize: number = 10,
                                  props?: GetMemberProps): Promise<GetMemberResponse> {
    const request = new GetMemberRequest();
    if (isNaN(pageNo) || pageNo <= 0) {
        pageNo = 1;
    }
    if (isNaN(pageSize) || pageSize <= 0) {
        pageSize = 10;
    }
    request.setPageNo(pageNo);
    request.setPageSize(pageSize);
    if (props?.id !== undefined) {
        request.setIdList(props.id);
    }
    if (props?.sid !== undefined) {
        request.setSidList(props.sid);
    }
    return new Promise<GetMemberResponse>((resolve, reject) => {
        WebClient.getMember(request, {}, (err, response) => {
            return err ? reject(err) : resolve(response);
        });
    });
}