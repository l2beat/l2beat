"use client";

import { type Milestone } from "@l2beat/config";
import { assert } from "@l2beat/shared-pure";
import { useState } from "react";
import { z } from "zod";
import { Chart } from "~/app/_components/chart/chart";
import { ChartTimeRangeControls } from "~/app/_components/chart/controls/chart-time-range-controls";
import { getEntriesByDays } from "~/app/_components/chart/utils/get-entries-by-days";
import { PercentChange } from "~/app/_components/percent-change";
import { RadioGroup, RadioGroupItem } from "~/app/_components/radio-group";
import { useLocalStorage } from "~/hooks/use-local-storage";
import { formatRange, formatTimestamp } from "~/utils/dates";
import { formatCurrency, formatCurrencyExactValue } from "~/utils/format";
import { getPercentageChange } from "~/utils/get-percentage-change";

interface SummaryChartPointData {
  timestamp: number;
  usdValue: number;
  ethValue: number;
}

interface Props {
  data: AggregateDetailedTvlResponse;
  milestones: Milestone[];
}
export function SummaryChart({ data, milestones }: Props) {
  const [timeRange, setTimeRange] = useLocalStorage("summary-time-range", "1y");
  const [unit, setUnit] = useLocalStorage("summary-unit", "usd");
  const [scale, setScale] = useLocalStorage("summary-scale", "lin");

  const mappedMilestones = getMilestones(milestones);
  const dataInRange = getEntriesByDays(toDays(timeRange), data, {
    trimLeft: true,
  });
  const rangeStart = dataInRange?.at(0)?.at(0);
  const rangeEnd = dataInRange?.at(dataInRange.length - 1)?.at(0);
  assert(
    rangeStart !== undefined && rangeEnd !== undefined,
    "Programmer error: rangeStart and rangeEnd are undefined"
  );

  const columns = dataInRange.map((d) => {
    const timestamp = d[0];
    const usdValue = d[1];
    const ethValue = d[5];

    return {
      values: [{ value: unit === "usd" ? usdValue : ethValue }],
      data: {
        timestamp,
        usdValue,
        ethValue,
      },
      milestone: mappedMilestones[timestamp],
    };
  });

  const { tvl, tvlWeeklyChange } = getTvlWithChange(data, unit);

  return (
    <section className="flex gap-4 flex-col">
      <Header unit={unit} value={tvl} weeklyChange={tvlWeeklyChange} />
      <ChartTimeRangeControls
        value={timeRange}
        setValue={setTimeRange}
        options={[
          { value: "7d", label: "7D" },
          { value: "30d", label: "30D" },
          { value: "90d", label: "90D" },
          { value: "180d", label: "180D" },
          { value: "1y", label: "1Y" },
          { value: "max", label: "MAX" },
        ]}
        range={[rangeStart, rangeEnd]}
      />
      <Chart
        columns={columns}
        valuesStyle={[
          {
            fill: "signature gradient",
            line: "signature gradient",
            point: "circle",
          },
        ]}
        formatYAxisLabel={(value: number) =>
          // Pass UNIT from controls
          formatCurrency(value, unit, { showLessThanMinimum: false })
        }
        range={[1687039200, 1718661600]}
        useLogScale={scale === "log"}
        renderHoverContents={(data) => <ChartHover data={data} />}
      />
      <div className="flex justify-between gap-2 items-center">
        <RadioGroup value={unit} onValueChange={setUnit}>
          <RadioGroupItem value="usd">USD</RadioGroupItem>
          <RadioGroupItem value="eth">ETH</RadioGroupItem>
        </RadioGroup>
        <RadioGroup value={scale} onValueChange={setScale}>
          <RadioGroupItem value="log">LOG</RadioGroupItem>
          <RadioGroupItem value="lin">LIN</RadioGroupItem>
        </RadioGroup>
      </div>
    </section>
  );
}

function ChartHover({ data }: { data: SummaryChartPointData }) {
  const formattedUsd = formatCurrencyExactValue(data.usdValue, "USD");
  const formattedEth = formatCurrencyExactValue(data.ethValue, "ETH");
  return (
    <div>
      <div className="mb-1 whitespace-nowrap">
        {formatTimestamp(data.timestamp, {
          mode: "datetime",
        })}
      </div>
      <div className="flex w-full justify-between items-center gap-2">
        <span className="dark:text-gray-50 text-gray-700 text-sm">USD</span>
        {formattedUsd}
      </div>
      <div className="flex w-full justify-between items-center gap-2">
        <span className="dark:text-gray-50 text-gray-700 text-sm">ETH</span>
        {formattedEth}
      </div>
    </div>
  );
}

function Header({
  unit,
  value,
  weeklyChange,
}: {
  unit: string;
  value: number;
  weeklyChange: string;
}) {
  return (
    <header
      className="mb-4 flex flex-col justify-between text-base md:flex-row"
      data-role="chart-header"
    >
      <div>
        <h1 className="mb-1 font-bold text-3xl">Value Locked</h1>
        <p className="hidden text-gray-500 md:block dark:text-gray-600">
          Sum of all canonically bridged, externally bridged, and natively
          minted tokens, converted to {unit.toUpperCase()}
        </p>
      </div>
      <div className="flex flex-row items-baseline gap-2 transition-opacity duration-200 group-data-[interactivity-disabled]/chart:pointer-events-none md:flex-col md:items-end md:gap-1 group-data-[interactivity-disabled]/chart:opacity-0">
        <p className="whitespace-nowrap text-right font-bold text-lg md:text-3xl">
          {formatCurrency(value, unit, {
            showLessThanMinimum: false,
          })}
        </p>
        <p className="whitespace-nowrap text-right font-bold text-xs md:text-base">
          <PercentChange value={weeklyChange} /> / 7 days
        </p>
      </div>
      <hr className="w-full border-gray-200 dark:border-zinc-700 md:border-t mt-2 md:hidden" />
    </header>
  );
}

export function getTvlWithChange(
  charts: AggregateDetailedTvlResponse,
  currency?: string
) {
  const data = charts?.hourly.data ?? [];
  const dataIndex = currency === "eth" ? 5 : 1;
  const tvl = data.at(-1)?.[dataIndex] ?? 0;
  const tvlSevenDaysAgo = data.at(0)?.[dataIndex] ?? 0;
  const tvlWeeklyChange = getPercentageChange(tvl, tvlSevenDaysAgo);
  return { tvl, tvlWeeklyChange };
}

const AggregateDetailedTvlChart = z.object({
  types: z.tuple([
    z.literal("timestamp"),
    z.literal("valueUsd"),
    z.literal("cbvUsd"),
    z.literal("ebvUsd"),
    z.literal("nmvUsd"),
    z.literal("valueEth"),
    z.literal("cbvEth"),
    z.literal("ebvEth"),
    z.literal("nmvEth"),
  ]),
  data: z.array(
    z.tuple([
      z.number(),
      z.number(),
      z.number(),
      z.number(),
      z.number(),
      z.number(),
      z.number(),
      z.number(),
      z.number(),
    ])
  ),
});

export type AggregateDetailedTvlResponse = z.infer<
  typeof AggregateDetailedTvlResponse
>;
export const AggregateDetailedTvlResponse = z.object({
  hourly: AggregateDetailedTvlChart,
  sixHourly: AggregateDetailedTvlChart,
  daily: AggregateDetailedTvlChart,
});

function getMilestones(milestones: Milestone[]): Record<number, Milestone> {
  const result: Record<number, Milestone> = {};
  for (const milestone of milestones) {
    const timestamp = Math.floor(new Date(milestone.date).getTime() / 1000);
    result[timestamp] = milestone;
  }
  return result;
}

function toDays(value: string) {
  if (value.endsWith("d")) {
    return parseInt(value.slice(0, -1));
  } else if (value.endsWith("y")) {
    return parseInt(value.slice(0, -1)) * 365;
  } else {
    return Infinity;
  }
}
