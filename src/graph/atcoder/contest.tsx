import GetContestRecord from "../../api/crawler/get_contest_record";

export default function AtcoderContestGraph(props: { handle: string }): JSX.Element {
    const handle = props.handle;
    const contestRecord = GetContestRecord('atcoder', handle);
    // TODO graph
    return <>暂时没有图</>;
}