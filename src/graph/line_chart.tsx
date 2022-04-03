import ReactECharts from 'echarts-for-react';
import {OJ} from "./oj";

const getColor = new Map<OJ, (rating: number) => string>(
    [
        [OJ.atcoder, (rating: number): string => {
            if (rating < 400) {
                return "#808080";
            } else if (rating < 800) {
                return "#804000";
            } else if (rating < 1200) {
                return "#008000";
            } else if (rating < 1600) {
                return "#00C0C0";
            } else if (rating < 2000) {
                return "#0000FF";
            } else if (rating < 2400) {
                return "#C0C000";
            } else if (rating < 2800) {
                return "#FF8000";
            }
            return "#FF0000";
        }],
        [OJ.codeforces, (rating: number): string => {
            if (rating < 1200) {
                return "gray";
            } else if (rating < 1400) {
                return "green";
            } else if (rating < 1600) {
                return "cyan";
            } else if (rating < 1900) {
                return "blue";
            } else if (rating < 2100) {
                return "violet";
            } else if (rating < 2400) {
                return "orange";
            } else if (rating < 3000) {
                return "red";
            }
            return "#7b0000";
        }],
        [OJ.nowcoder, (rating: number): string => {
            if (rating < 700) {
                return "#B5B5B5";
            } else if (rating < 1200) {
                return "#C172EA";
            } else if (rating < 1500) {
                return "#5C9FF8";
            } else if (rating < 2200) {
                return "#10BC9A";
            } else if (rating < 2800) {
                return "#FFCE5D";
            }
            return "#FF0000";
        }],
    ]
);

const ratingBoundary = new Map<OJ, number[]>(
    [
        [OJ.atcoder, [400, 800, 1200, 1600, 2000, 2400, 2800, 50000]],
        [OJ.codeforces, [1200, 1400, 1600, 1900, 2100, 2400, 3000, 50000]],
        [OJ.nowcoder, [700, 1200, 1500, 2200, 2800, 50000]],
    ]
);

function getBackgroudData(oj: OJ) {
    const ratings = ratingBoundary.get(oj);
    const getColorFunc = getColor.get(oj);
    if (ratings === undefined || getColorFunc === undefined) {
        return {
            color: undefined,
            markline: undefined,
        }
    }
    const color = [];
    const markline = [];
    let pre = 0;
    for (const x of ratings) {
        color.push([
            {
                yAxis: pre,
                itemStyle: {
                    color: getColorFunc(pre),
                    opacity: 0.6,
                },
            },
            {
                yAxis: x,
            }
        ]);
        markline.push({
            yAxis: x,
            lineStyle: {
                color: getColorFunc(x),
            },
            label: {
                color: getColorFunc(x),
            },
        });
        pre = x;
    }
    return {
        color: color,
        markline: markline,
    }
}

type LineChartProps = {
    oj?: OJ,
    username?: string,
    userInfoUrl?: string,
};

export default function LineChart(props: LineChartProps): JSX.Element {
    if (props.oj === undefined) {
        return <></>;
    }
    const data: any[] = [];
    const backgroud = getBackgroudData(props.oj);
    const color = backgroud.color;
    const markline = backgroud.markline;
    const options = {
        title: {
            text: props.username,
            link: props.userInfoUrl,
        },
        legend: {},
        toolbox: {
            feature: {
                saveAsImage: {
                    name: props.oj.toString() + ' ' + props.username,
                    pixelRatio: 2
                }
            }
        },
        grid: [
            {
                show: true,
            }
        ],
        xAxis: [
            {
                type: 'time',
                splitNumber: 13,
                gridIndex: 0
            }
        ],
        yAxis: [
            {
                show: false,
                scale: true,
                gridIndex: 0
            },
        ],
        series: [
            {
                lineStyle: {
                    color: 'gold',
                    shadowColor: 'white',
                    shadowBlur: 1
                },
                itemStyle: {
                    color: 'gold',
                    shadowColor: 'white',
                    shadowBlur: 1
                },
                name: props.oj.toString(),
                type: 'line',
                data: data,
                encode: {
                    x: 0,
                    y: 1,
                },
                markPoint: {
                    symbol: 'circle',
                    symbolSize: 10,
                    silent: true,
                    data: [
                        {
                            type: 'max',
                            label: {
                                position: 'top',
                                textBorderWidth: 5,
                            }
                        },
                    ]
                },
                markArea: {
                    silent: true,
                    data: color,
                },

                markLine: {
                    silent: true,
                    symbol: 'none',
                    label: {
                        position: 'start',
                    },
                    lineStyle: {
                        type: 'solid',
                        width: 0,
                    },
                    data: markline,
                },
            },
        ],
        tooltip: {
            backgroundColor: '#222',
            borderColor: '#777',
            formatter: function (obj: any) {
                let value = obj.value;
                return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">'
                    + value[3] + '<br>'
                    + 'rating: ' + value[1]
            },
            position: 'right',
        },
        dataZoom: {
            type: 'slider'
        }
    };

    return <ReactECharts option={options}/>;
}