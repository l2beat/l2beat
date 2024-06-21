import { mean } from "lodash";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { cn } from "~/utils/cn";
import { useChartContext } from "./chart-context";
import { useChartHoverContext } from "./chart-hover-context";
import { ChartMilestoneHover } from "./hovers/ChartMilestoneHover";
import { POINT_CLASS_NAMES } from "./styles";

const HOVER_CANVAS_PADDING = 16;

export function ChartHover() {
  const contentRef = useRef<HTMLDivElement>(null);
  const { rect, valuesStyle } = useChartContext();
  const { position, milestone, content } = useChartHoverContext();

  const lineStyle = useMemo(() => {
    if (!position) return undefined;
    return {
      left: position.left - 1,
    };
  }, [position]);

  useEffect(() => {
    const content = contentRef.current;
    if (!content || !rect || !position) return;

    const { height: canvasHeight, width: canvasWidth } = rect;
    const { height } = content.getBoundingClientRect();
    const yValues = Object.values(position.bottom);

    const averageY = yValues.length === 0 ? canvasHeight / 2 : mean(yValues);

    const contentsBottom = Math.min(
      canvasHeight - height - HOVER_CANVAS_PADDING,
      Math.max(averageY - height / 2, HOVER_CANVAS_PADDING)
    );
    content.style.bottom = `${contentsBottom}px`;
    if (
      content.clientWidth + position.left <
      canvasWidth - HOVER_CANVAS_PADDING
    ) {
      content.style.removeProperty("right");
      content.style.left = `${position.left + HOVER_CANVAS_PADDING}px`;
    } else {
      content.style.removeProperty("left");
      content.style.right = `${
        canvasWidth - position.left + HOVER_CANVAS_PADDING
      }px`;
    }
  }, [position, rect]);

  if (!position) return null;

  return (
    <div>
      <div
        className={cn(
          "absolute top-0 z-30 block h-full w-0.5 bg-current",
          milestone && "bg-green-500"
        )}
        style={lineStyle}
      >
        {Object.entries(position?.bottom ?? {}).map(([index, bottom]) => {
          const style = valuesStyle[Number(index)]?.point;
          return (
            <div
              key={index}
              className={cn(
                "absolute z-40 -left-[3px]",
                milestone && POINT_CLASS_NAMES.milestone.className,
                !milestone && style && POINT_CLASS_NAMES[style].className
              )}
              style={{ bottom }}
            />
          );
        })}
      </div>
      <div
        ref={contentRef}
        className={cn(
          "absolute z-50 rounded-lg px-3 py-2 text-2xs md:px-4 md:py-3 md:text-xs",
          "bg-white dark:bg-neutral-700",
          "pointer-events-none select-none",
          "shadow-md animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
          "transition-[bottom] transition-duration-50"
        )}
      >
        {milestone ? <ChartMilestoneHover milestone={milestone} /> : content}
      </div>
    </div>
  );
}
