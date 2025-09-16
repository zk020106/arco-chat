以下是一个使用 ECharts 实现的柱状图示例，可直接复制到 HTML 文件中运行查看效果：
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>ECharts 柱状图示例</title>
    <!-- 引入 ECharts 库 -->
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
</head>
<body>
    <!-- 为 ECharts 准备一个具备大小的 DOM 容器 -->
    <div id="main" style="width: 800px; height: 500px;"></div>
    <script type="text/javascript">
        // 初始化 ECharts 实例
        const myChart = echarts.init(document.getElementById('main'));

        // 图表配置项
        const option = {
            title: {
                text: '月度销售额统计',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['销售额(万元)'],
                bottom: 10
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                top: 60,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                axisLabel: {
                    interval: 0,
                    rotate: 30
                }
            },
            yAxis: {
                type: 'value',
                name: '销售额(万元)',
                min: 0,
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                }
            },
            series: [
                {
                    name: '销售额(万元)',
                    type: 'bar',
                    data: [120, 200, 150, 80, 70, 110, 130, 180, 220, 190, 250, 300],
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#409EFF' },
                            { offset: 1, color: '#67C23A' }
                        ])
                    },
                    barWidth: 30,
                    emphasis: {
                        focus: 'series',
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(0, 0, 0, 0.3)'
                        }
                    }
                }
            ]
        };

        // 渲染图表
        myChart.setOption(option);

        // 响应窗口大小变化
        window.addEventListener('resize', function() {
            myChart.resize();
        });
    </script>
</body>
</html>
