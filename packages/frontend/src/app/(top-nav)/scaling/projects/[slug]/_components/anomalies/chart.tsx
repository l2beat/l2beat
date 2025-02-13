import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export type ChartDataPoint = {
  timestamp: number; // Unix timestamp
  duration: number;
  mean: number;
  anomaly: number | null;
  zScoreBoundary: number;
};

export function AnomalyChart({ data }: { data: ChartDataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="timestamp"
          scale="time"
          tickFormatter={(ts: string | number) => new Date(ts).toLocaleDateString()}
          type="number"
          domain={['auto', 'auto']}
        />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip
          isAnimationActive={false}
          labelFormatter={(ts: string | number) => new Date(ts).toLocaleString()}
        />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="duration"
          stroke="#8884d8"
          dot={false}
          name="Interval Duration"
          isAnimationActive={false}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="mean"
          stroke="#82ca9d"
          dot={false}
          name="30-day Mean"
          isAnimationActive={false}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="zScoreBoundary"
          stroke="red"
          dot={false}
          name="Z score boundary"
          isAnimationActive={false}
          strokeDasharray="3 3"
        />
        <Scatter yAxisId="left" dataKey="anomaly" fill="red" shape="circle" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
