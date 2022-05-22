import Nav from "./nav";
import {useEffect, useState} from "react";
import {WebClient} from "../api/web/common";
import {GetMemberRequest, GetMemberResponse, Member} from "../api/pb/goodguy-web_pb";
import {
    Box, CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow, TableSortLabel, Typography
} from "@mui/material";
import * as React from "react";
import {CrawlClient} from "../api/crawler/client";
import {GetUserContestRecordRequest} from "../api/pb/crawl_service_pb";

function GetPlatformRating(platform: string, handle: string): number | undefined | null {
    const [rating, setRating] = useState<number | undefined | null>(undefined);
    const request = new GetUserContestRecordRequest();
    request.setHandle(handle);
    request.setPlatform(platform);
    useEffect(() => {
        if (handle === '') {
            setRating(null);
            return;
        }
        CrawlClient.getUserContestRecord(request, {}, (err, response) => {
            if (err) {
                setRating(null);
            } else {
                setRating(response.getRating());
            }
        });
    }, [platform, handle]);
    return rating;
}

function CodeforcesRatingElement(props: { handle?: string }): JSX.Element {
    const {handle} = props;
    if (!handle) {
        return <></>;
    }
    const rating = GetPlatformRating('codeforces', handle);
    if (rating === undefined) {
        return <CircularProgress size="15px"/>;
    } else if (rating === null) {
        return <></>;
    }
    return <>{rating}</>;
}

function AtcoderRatingElement(props: { handle?: string }): JSX.Element {
    const {handle} = props;
    if (!handle) {
        return <></>;
    }
    const rating = GetPlatformRating('atcoder', handle);
    if (rating === undefined) {
        return <CircularProgress size="15px"/>;
    } else if (rating === null) {
        return <></>;
    }
    return <>{rating}</>;
}

type UserListProps = {
    pageNo?: number
    pageSize?: number
};

export default function UserList(props: UserListProps): JSX.Element {
    document.title = "用户列表";
    const [pageNo, setPageNo] = useState(props.pageNo || 1);
    const [pageSize, setPageSize] = useState(props.pageSize || 10);
    const [data, setData] = useState<GetMemberResponse | undefined>(undefined);
    const [orderBy, setOrderBy] = useState('');
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    useEffect(() => {
        const request = new GetMemberRequest();
        request.setPageNo(pageNo);
        request.setPageSize(pageSize);
        WebClient.getMember(request, {}, (err, response) => {
            return err ? console.log(err) : setData(response);
        });
    }, [pageNo, pageSize]);
    type TableHeadCellProps = {
        id: string,
        label: string,
    };
    const TableHeadCell = (props: TableHeadCellProps) => {
        const {id, label} = props;
        return (
            <TableCell key={id}>
                <TableSortLabel active={orderBy === id} direction={orderBy === id ? order : 'asc'}
                                onClick={() => {
                                    if (orderBy === id) {
                                        setOrder(order === 'asc' ? 'desc' : 'asc');
                                    } else {
                                        setOrder('asc');
                                    }
                                    setOrderBy(id);
                                }}>
                    {label}
                </TableSortLabel>
            </TableCell>
        );
    };
    return (
        <Nav open={false} header={"用户列表"}>
            <Box sx={{width: '100%'}}>
                <Paper sx={{width: '100%', mb: 2}}>
                    <TableContainer>
                        <Table sx={{minWidth: 750}} size="medium">
                            <TableHead>
                                <TableRow>
                                    <TableHeadCell id="sid" label="用户名"/>
                                    <TableHeadCell id="name" label="姓名"/>
                                    <TableHeadCell id="grade" label="年级"/>
                                    <TableHeadCell id="is_official" label="是否校队成员"/>
                                    <TableHeadCell id="codeforces_id" label="Codeforces ID"/>
                                    <TableHeadCell id="codeforces_rating" label="Codeforces Rating"/>
                                    <TableHeadCell id="atcoder_id" label="AtCoder ID"/>
                                    <TableHeadCell id="atcoder_rating" label="AtCoder Rating"/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data?.getMemberList().map((value, index) => {
                                    return (
                                        <TableRow hover key={index}>
                                            <TableCell>
                                                <Typography component="div">
                                                    <a href={`/profile/?sid=${value.getSid().toString()}`}
                                                       style={{textDecoration: 'none', color: '#000000'}}>
                                                        {value.getSid().toString()}
                                                    </a>
                                                </Typography>
                                            </TableCell>
                                            <TableCell>{value.getName().toString()}</TableCell>
                                            <TableCell>{value.getGrade().toString()}</TableCell>
                                            <TableCell>{value.getIsOfficial().toString()}</TableCell>
                                            <TableCell>{value.getCodeforcesId().toString()}</TableCell>
                                            <TableCell><CodeforcesRatingElement
                                                handle={value.getCodeforcesId().toString()}/></TableCell>
                                            <TableCell>{value.getAtcoderId().toString()}</TableCell>
                                            <TableCell>
                                                <AtcoderRatingElement handle={value.getAtcoderId().toString()}/>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10]} component="div"
                        count={data?.getSize() || 0}
                        rowsPerPage={pageSize}
                        page={data ? pageNo - 1 : 0}
                        onPageChange={(e, newPageNo) => {
                            setPageNo(newPageNo);
                        }}
                        onRowsPerPageChange={(e) => {
                            setPageNo(1);
                            setPageSize(parseInt(e.target.value, 10));
                        }}/>
                </Paper>
                <Typography variant="caption" component="div" color="#000000AA">
                    排序、筛选功能暂不可用{/* TODO */}
                </Typography>
            </Box>
        </Nav>
    );
}
