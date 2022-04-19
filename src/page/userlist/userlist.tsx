import '../common/common.sass'
import './userlist.sass'
import CommonNav from "../common/common_nav";
import queryString from "query-string";
import GetMember from "../../api/web/get_member";
import {useState} from "react";
import {Member} from "../../api/pb/goodguy-web_pb";
import {Table, Pagination} from "react-bootstrap";
import GetUserContestRecord from "../../api/crawler/get_user_contest_record";
import State from "../../util/state";

type RateItemProps = {
    platform: string
    handle?: string
};

function RateItem(props: RateItemProps): JSX.Element {
    if (props.handle === undefined) {
        return <></>;
    }
    const platform = props.platform;
    const handle = props.handle;
    const userContestRecord = GetUserContestRecord(platform, handle);
    const url = userContestRecord?.getProfileUrl();
    return userContestRecord === undefined ? (
        <>
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
            &nbsp;Loading...
        </>
    ) : (
        <span><a href={url}>{handle}</a> | {userContestRecord.getRating()} | {userContestRecord.getLength()}场</span>
    );
}

function tableRow(value: Member, index: number): JSX.Element {
    return (
        <tr key={index}>
            <td><a target="_blank" href={`/profile/?sid=${encodeURIComponent(value.getSid())}`}
                   rel="noreferrer">{value.getSid()}</a></td>
            <td>{value.getName()}</td>
            <td>{value.getGrade()}</td>
            <td>
                {value.getCodeforcesId() ?
                    <div>Codeforces: <RateItem platform="codeforces" handle={value.getCodeforcesId()}/></div> : <></>}
                {value.getAtcoderId() ?
                    <div>AtCoder: <RateItem platform="atcoder" handle={value.getAtcoderId()}/></div> : <></>}
                {value.getNowcoderId() ?
                    <div>NowCoder: <RateItem platform="nowcoder" handle={value.getNowcoderId()}/></div> : <></>}
                {value.getLeetcodeId() ?
                    <div>LeetCode: <RateItem platform="leetcode" handle={value.getLuoguId()}/></div> : <></>}
            </td>
        </tr>
    );
}

type PageProps = {
    pageNo: number
    pageSize: number
};

function UserListTable(props: PageProps): JSX.Element {
    const pageNo = props.pageNo;
    const pageSize = props.pageSize;
    const [table, setTable] = useState(new State<Array<Member>>());
    if (table.runnable()) {
        table.gao(new Promise<Array<Member>>((resolve, reject) => {
            GetMember(pageNo, pageSize).then((response) => {
                resolve(response.getMemberList());
            }).catch((err) => {
                reject(err);
            });
        }), setTable);
    }
    return (
        <div className="goodguy-body">
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>年级</th>
                    <th>Ranking</th>
                </tr>
                </thead>
                <tbody>
                {table?.value?.map(tableRow)}
                </tbody>
            </Table>
        </div>
    );
}

function Paging(props: PageProps): JSX.Element {
    const pageNo = props.pageNo;
    const pageSize = props.pageSize;
    const [total, setTotal] = useState(new State<number>());
    if (total.runnable()) {
        total.gao(new Promise<number>((resolve, reject) => {
            GetMember(1, 1).then((response) => {
                resolve(response.getSize());
            });
        }), setTotal);
    }
    const maxPage = Math.max(Math.floor(((total.value ? total.value : 0) + props.pageSize - 1) / props.pageSize), 1);
    const pageIndex: number[] = [];
    if (pageNo <= maxPage) {
        for (let index = pageNo, step = 1; true; index += step, step *= 2) {
            index = Math.min(maxPage, index);
            pageIndex.push(index);
            if (index >= maxPage) {
                break;
            }
            index += step;
        }
    }
    for (let index = pageNo - 1, step = 2; index > 0; index -= step, step *= 2) {
        pageIndex.push(index);
    }
    pageIndex.sort();
    const getHref = (index: number): string => {
        return `/userlist/?pageNo=${index}&pageSize=${pageSize}`;
    };
    return (
        <div className="goodguy-paging">
            <Pagination>
                {
                    pageIndex.map((value, index) => {
                        return (
                            <Pagination.Item key={index} active={value === pageNo} href={getHref(value)}>
                                {value}
                            </Pagination.Item>
                        );
                    })
                }
            </Pagination>
        </div>
    );
}

export default function UserListPage(): JSX.Element {
    const query = queryString.parse(window.location.search);
    let pageNo = Number(query['pageNo']);
    let pageSize = Number(query['pageSize']);
    if (isNaN(pageNo) || pageNo <= 0) {
        pageNo = 1;
    }
    if (isNaN(pageSize) || pageSize <= 0 || pageSize > 50) {
        pageSize = 10;
    }
    return (
        <>
            <CommonNav/>
            <UserListTable pageNo={pageNo} pageSize={pageSize}/>
            <Paging pageNo={pageNo} pageSize={pageSize}/>
        </>
    );
}