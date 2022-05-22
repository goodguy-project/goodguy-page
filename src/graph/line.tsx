import ReactECharts from 'echarts-for-react';
import GetContestRecord from "../api/crawler/get_contest_record";

export class Item {
    x: string
    y: any

    constructor(x: string, y: any) {
        this.x = x;
        this.y = y;
    }
}

type LineProps = {
    title?: string
    data?: Item[]
};

export function Line(props: LineProps) {
    const xAxis: string[] = [];
    props.data?.forEach((value) => {
        xAxis.push(value.x);
    });
    const yAxis: string[] = [];
    props.data?.forEach((value) => {
        yAxis.push(value.y);
    });
    const option = {
        title: {
            text: props.title,
        },
        tooltip: {
            trigger: 'axis',
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
        },
        toolbox: {
            feature: {
                saveAsImage: {},
            }
        },
        xAxis: {
            data: xAxis,
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                type: 'line',
                data: yAxis,
            }
        ]
    };
    return <ReactECharts option={option}/>;
}

type ContestLineProps = {
    platform?: string
    handle?: string
};

export function ContestLine(props: ContestLineProps) {
    const {platform, handle} = props;
    if (platform === undefined || handle === undefined) {
        return <></>;
    }
    const contestRecord = GetContestRecord(platform, handle);
    const data: Item[] = [];
    contestRecord?.getRecordList().forEach((value) => {
        const date = new Date(value.getTimestamp() * 1000.0);
        data.push(new Item(`${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`, value.getRating()))
        return;
    });
    return <Line title={platform} data={data}/>;
}