import ReactECharts from "echarts-for-react";
import {FormControl, InputLabel, MenuItem, Typography, Select, LinearProgress} from "@mui/material";
import GetSubmitRecord from "../api/crawler/get_submit_record";
import {UserSubmitRecord} from "../api/pb/crawl_service_pb";
import {useEffect, useState} from "react";

function dateToString(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function getDataFromRecords(year: number, records: UserSubmitRecord): [string, number][] {
    const map = new Map<string, number>();
    for (const r of records.getSubmitRecordDataList()) {
        const date = new Date(r.getSubmitTime() * 1000.0);
        if (date.getFullYear() === year) {
            const s = dateToString(date);
            map.set(s, (map.get(s) || 0) + 1);
        }
    }
    let date = new Date(year, 0, 1);
    const ret: [string, number][] = [];
    while (date.getFullYear() === year) {
        const s = dateToString(date);
        ret.push([s, map.get(s) || 0]);
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    }
    return ret;
}

type HeatMapProps = {
    data?: [string, number][]
    title?: string
    year?: number
};

export function HeatMap(props: HeatMapProps): JSX.Element {
    const data = props.data || [];
    const option = {
        title: {
            top: 0,
            left: 'center',
            text: props.title,
        },
        tooltip: {
            formatter: function (p: any) {
                const date: string = p.data[0];
                const value: number = p.data[1];
                return `${date}: ${value}`;
            }
        },
        visualMap: {
            min: 0,
            max: 10,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            top: 65,
            inRange: {
                color: ['#FFFFFF', 'rgb(33,110,57)'],
                symbolSize: [100],
            }
        },
        calendar: {
            top: 40,
            left: 50,
            right: 30,
            cellSize: ['auto', 33],
            range: props.year?.toString() || (new Date(Date.now())).getFullYear().toString(),
            itemStyle: {
                borderWidth: 0.3,
            },
            yearLabel: {
                show: false,
            }
        },
        series: {
            type: 'heatmap',
            coordinateSystem: 'calendar',
            data: data,
        }
    };
    return <ReactECharts option={option}/>;
}

type ContestHeapMapProps = {
    platform: string
    handle: string
    title?: string
};

function getYears(submitRecord: UserSubmitRecord | undefined | null): number[] {
    const years = new Set<number>();
    submitRecord?.getSubmitRecordDataList().forEach((value) => {
        const date = new Date(value.getSubmitTime() * 1000.0);
        years.add(date.getFullYear());
    });
    const yearsArray: number[] = [];
    years.forEach((value) => {
        yearsArray.push(value);
    });
    const currentYear = (new Date(Date.now())).getFullYear();
    if (yearsArray.length === 0) {
        return [currentYear];
    }
    const minYear = Math.min(...yearsArray);
    const maxYear = Math.max(...yearsArray);
    if (minYear < 0 || minYear > 9999) {
        return [currentYear];
    }
    const result: number[] = [];
    for (let year = maxYear; year >= minYear; year--) {
        result.push(year);
    }
    return result;
}

export function DailyHeapMap(props: ContestHeapMapProps): JSX.Element {
    const {platform, handle, title} = props;
    const [selectYear, setSelectYear] = useState<number | undefined>(undefined);
    const submitRecord = GetSubmitRecord(platform, handle);
    const years = getYears(submitRecord);
    useEffect(() => {
        if (years.length > 0) {
            setSelectYear(years[0]);
        }
    }, [years.length]);
    if (submitRecord === undefined || years.length === 0 || selectYear === undefined) {
        return (
            <>
                <div style={{textAlign: 'center'}}>
                    <Typography>Data of {title || platform} Loading...</Typography>
                </div>
                <LinearProgress />
            </>
        );
    }
    if (submitRecord === null) {
        return <></>;
    }
    return (
        <>
            <div style={{textAlign: 'center'}}>
                <Typography style={{display: 'inline-block', lineHeight: '88px'}}>{title || platform}</Typography>
                <Typography style={{display: 'inline-block', lineHeight: '88px'}}>&nbsp;{handle}</Typography>
                <FormControl sx={{ m: 2, minWidth: 120 }}>
                    <InputLabel>Year</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectYear}
                        label="Age"
                        onChange={(e) => {
                            if (typeof e.target.value === 'number') {
                                setSelectYear(e.target.value);
                            } else {
                                console.log(`e.target.value TypeError, value: ${e.target.value}`);
                            }
                        }}
                    >
                        {
                            years.map((value, index) => {
                                return <MenuItem value={value} key={index}>{value}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>
            </div>
            <HeatMap data={getDataFromRecords(selectYear, submitRecord)} year={selectYear}/>
        </>
    );
}