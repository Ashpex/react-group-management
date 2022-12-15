import BaseChart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart as ChartJS } from "react-chartjs-2";

BaseChart.register(ChartDataLabels);
const Chart = (props) => <ChartJS {...props} />;

export default Chart;
