import GetSubmitRecord from "../api/crawler/get_submit_record";
import {LinearProgress} from "@mui/material";
import {UserSubmitRecord, Verdict} from "../api/pb/crawl_service_pb";
import ReactECharts from "echarts-for-react";

function getLangDistributed(record: UserSubmitRecord): Map<string, number> {
    const m = new Map<string, number>();
    for (const r of record.getSubmitRecordDataList()) {
        if (r.getVerdict() === Verdict.ACCEPTED) {
            const lang = r.getProgrammingLanguage();
            const key = lang.toString();
            m.set(key, (m.get(key) || 0) + 1);
        }
    }
    return m;
}

export function LanguageDistributed(props: { platform: string, handle: string }): JSX.Element {
    const {platform, handle} = props;
    const submitRecord = GetSubmitRecord(platform, handle);
    if (submitRecord) {
        const data: {value: number, name: string}[] = [];
        getLangDistributed(submitRecord).forEach((value, key)=>{
            data.push({
                value: value,
                name: key,
            });
        });
        const option = {
            title: {
                text: 'Referer of a Website',
                subtext: 'Fake Data',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: '50%',
                    data: data,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        return <ReactECharts option={option}/>
    }
    return <LinearProgress/>;
}