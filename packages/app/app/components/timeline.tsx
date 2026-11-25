import type { ChartDataset } from "chart.js";
import { type FC, useEffect, useMemo, useState } from "hono/jsx";
import Chart, { type Data, type Options } from "../islands/chart";
import { type IGranularity, type ITimeline, Metric } from "../lib/models";

/** daisyUI pastel computed hex, used before hydration / if the token is missing */
const SUCCESS_FALLBACK = "#7AF1A7";
const INFO_FALLBACK = "#51E8FB";

function readThemeColor(utility: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  const el = document.createElement("span");
  el.className = utility;
  el.style.position = "absolute";
  el.style.width = "0";
  el.style.height = "0";
  el.style.pointerEvents = "none";
  document.documentElement.appendChild(el);
  const color = getComputedStyle(el).backgroundColor;
  el.remove();
  return color && color !== "rgba(0, 0, 0, 0)" && color !== "transparent"
    ? color
    : fallback;
}

function withAlpha(color: string, alpha: number): string {
  const rgba = color.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/);
  if (rgba) return `rgba(${rgba[1]}, ${rgba[2]}, ${rgba[3]}, ${alpha})`;
  const hex = color.match(/^#([0-9a-fA-F]{6})$/);
  if (hex) {
    const n = Number.parseInt(hex[1], 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
  }
  return color;
}

function chartColors() {
  const visitors = readThemeColor("bg-success", SUCCESS_FALLBACK);
  const pageviews = readThemeColor("bg-info", INFO_FALLBACK);
  return {
    visitors,
    visitorsFill: withAlpha(visitors, 0.5),
    pageviews,
    pageviewsFill: withAlpha(pageviews, 0.5),
  };
}

const Timeline: FC<{
  timeline: ITimeline;
  granularity: IGranularity;
  metric: Metric;
}> = ({ timeline, granularity, metric }) => {
  const [colors, setColors] = useState(chartColors);

  useEffect(() => {
    const update = () => setColors(chartColors());
    update();
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const options: Options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {},
      scales: {
        x: {
          type: "time",
          time: {
            minUnit: granularity,
          },
          ticks: {
            source: "data",
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
          },
        },
      },
    }),
    [granularity],
  );

  const data: Data = useMemo(() => {
    let dataset: ChartDataset<"line">;
    switch (metric) {
      case Metric.Visitors:
        dataset = {
          label: "Visitors",
          data: timeline.map((item) => item.visitors),
          borderColor: colors.visitors,
          backgroundColor: colors.visitorsFill,
        };
        break;
      case Metric.Pageviews:
        dataset = {
          label: "Pageviews",
          data: timeline.map((item) => item.views),
          borderColor: colors.pageviews,
          backgroundColor: colors.pageviewsFill,
        };
        break;
    }

    return {
      labels: timeline.map((item) => item.timestamp),
      datasets: [dataset],
    };
  }, [timeline, metric, colors]);

  return (
    <div class="space-y-1">
      <Chart class="h-96 w-full" options={options} data={data} />
      <p class="text-xs text-base-content/50 text-end">(time in UTC)</p>
    </div>
  );
};

export default Timeline;
