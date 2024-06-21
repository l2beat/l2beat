import { useEffect, useRef } from "react";
import { useChartContext } from "./chart-context";
import { useChartHoverContext } from "./chart-hover-context";
import { FIRST_LABEL_HEIGHT_PX } from "./chart-labels";

export function ChartInteractionZone() {
  const ref = useRef<HTMLDivElement>(null);
  const chartContext = useChartContext();
  const chartHoverContext = useChartHoverContext();

  useEffect(() => {
    const zone = ref.current;
    const { rect, columns, valuesStyle, getY } = chartContext;
    if (!zone || !rect) return;

    const onWindowMoveEvent = (e: MouseEvent | Touch) => {
      const rect = zone.getBoundingClientRect();
      const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (!isInside) {
        chartHoverContext.setPosition(undefined);
      }
    };

    const onCanvasMoveEvent = (e: MouseEvent | Touch) => {
      const position = (e.clientX - rect.left) / rect.width;
      const x = Math.min(1, Math.max(0, position));

      onMouseMoved(x);
    };

    const onMouseMoved = (mouseX: number) => {
      const columnsLength = columns.length;
      const columnIndex = Math.round(mouseX * (columnsLength - 1));
      const column = columns[columnIndex];

      const { width: canvasWidth, height: canvasHeight } = rect;
      const getCanvasX = (index: number) =>
        (index / (columnsLength - 1)) * canvasWidth;

      const left = getCanvasX(columnIndex);
      const yValues: Record<number, number> = {};
      if (!column) return;

      for (const [i, data] of column.values.entries()) {
        const pointStyle = valuesStyle[i]?.point;
        if (!pointStyle) continue;
        const y = getY(data.value);
        const bottom = Math.max(0, y * (canvasHeight - FIRST_LABEL_HEIGHT_PX));
        yValues[i] = bottom;
      }
      chartHoverContext.setData(column.data);
      chartHoverContext.setPosition({ left, bottom: yValues });
    };

    window.addEventListener("mousemove", onWindowMoveEvent);
    window.addEventListener("touchmove", (e) => {
      const touch = e.touches[0];
      if (!touch) return;
      onWindowMoveEvent(touch);
    });

    zone.addEventListener("mousemove", onCanvasMoveEvent);
    zone.addEventListener("touchmove", (e) => {
      const touch = e.touches[0];
      if (!touch) return;
      onCanvasMoveEvent(touch);
    });

    return () => {
      window.removeEventListener("mousemove", onWindowMoveEvent);
      // window.removeEventListener('touchmove', onWindowMoveEvent)
      zone.removeEventListener("mousemove", onCanvasMoveEvent);
      // zone.removeEventListener('touchmove', onCanvasMoveEvent)
    };
  }, [chartHoverContext, chartContext]);

  return (
    <div
      ref={ref}
      className="-inset-x-4 -bottom-4 absolute top-0 z-40 group-data-[interactivity-disabled]/chart:hidden"
    />
  );
}
