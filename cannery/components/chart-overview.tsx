/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

type ChartData = {
  month: string;
  users: number;
  files: number;
};

type Props = {
  data: ChartData[] | undefined;
  loading?: boolean;
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any;
  label?: string;
}) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-md border bg-background p-3 shadow-md min-w-[100px]">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">
          Users: {payload[0].value}
        </p>
        <p className="text-xs text-muted-foreground">
          Files: {payload[1].value}
        </p>
      </div>
    );
  }
  return null;
};

export function ChartOverview({ data, loading }: Props) {
  if (loading || !data) {
    return (
      <div className="h-[350px] w-full p-4">
        <div className="h-full w-full flex items-end gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="h-[120px] w-6 rounded-sm bg-muted" />
              <Skeleton className="h-[80px] w-6 rounded-sm bg-muted/60" />
              <Skeleton className="h-4 w-10 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
          domain={["auto", "auto"]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="users" fill="#adfa1d" radius={[4, 4, 0, 0]} />
        <Bar dataKey="files" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
