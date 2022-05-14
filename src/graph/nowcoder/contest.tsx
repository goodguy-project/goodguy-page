import GetContestRecord from "../../api/crawler/get_contest_record";

export default function NowcoderContestGraph(props: { handle: string }): JSX.Element {
    const handle = props.handle;
    const contestRecord = GetContestRecord('nowcoder', handle);
    // TODO graph
    return <>暂时没有图</>;
}