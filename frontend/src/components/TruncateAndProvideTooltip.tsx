import type { JSX } from "react";
import React, { useEffect, useRef, useState } from "react";
import { Tooltip } from "@mantine/core";

import type { MantineTransition } from "@mantine/core";

type TruncateAndProvideTooltipProps = Readonly<{
  text: string | React.ReactNode;
  color?: string;
  position?:
    | "top"
    | "top-start"
    | "top-end"
    | "left"
    | "left-start"
    | "left-end"
    | "right"
    | "right-start"
    | "right-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end";
  multiline?: boolean;
  className?: string;
  maxWidth?: number | string;
  maxHeight?: number | string;
  withArrow?: boolean;
  transitionType?: MantineTransition;
  tooltipClassess?: string;
  hidden?: boolean;
}>;

export function TruncateAndProvideTooltip({
  text,
  color,
  position,
  multiline,
  className,
  maxWidth = 500,
  maxHeight,
  withArrow,
  transitionType,
  tooltipClassess,
  hidden = false,
}: TruncateAndProvideTooltipProps): JSX.Element {
  const inputRef = useRef<HTMLDivElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const element = inputRef.current;
    if (!element) return;

    const checkTruncation = () => {
      setIsTruncated(element.scrollWidth > element.clientWidth);
    };

    const resizeObserver = new ResizeObserver(checkTruncation);
    resizeObserver.observe(element);

    checkTruncation();

    return () => {
      resizeObserver.disconnect();
    };
  }, [text]);

  return (
    <Tooltip
      color={color ?? "primary"}
      label={isTruncated ? text : ""}
      disabled={!isTruncated}
      position={position ?? "top-start"}
      multiline={multiline ?? true}
      withArrow={withArrow ?? false}
      events={{ hover: true, focus: true, touch: true }}
      classNames={{
        tooltip: `text-sm ${tooltipClassess ?? ""}`,
      }}
      hidden={hidden}
      styles={{
        tooltip: {
          whiteSpace: "normal",
          wordWrap: "break-word",
          overflow: "auto",
        },
      }}
      maw={maxWidth}
      mah={maxHeight}
      transitionProps={{
        duration: 200,
        transition: transitionType ?? "fade",
      }}
    >
      <div
        ref={inputRef}
        className={`truncate overflow-hidden ${className ?? ""}`}
      >
        {text}
      </div>
    </Tooltip>
  );
}
