"use client";

import { ReactNode } from "react";
import { Button } from "@mantine/core";

interface ButtonProps {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  classNames?: {
    inner?: string;
    label?: string;
  };
  color?: string;
  disabled?: boolean;
}

interface SectionToolbarProps {
  title: string;
  primaryButton?: ButtonProps;
  secondaryButton?: ButtonProps;
}

export const SectionToolbar = ({
  title,
  primaryButton,
  secondaryButton,
}: SectionToolbarProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold text-custom-primary-black">
        {title}
      </h2>
      <div className="flex gap-3">
        {secondaryButton && (
          <Button
            size="md"
            color={secondaryButton.color || "#F8F9FA"}
            leftSection={secondaryButton.icon}
            classNames={secondaryButton.classNames}
            onClick={secondaryButton.onClick}
            disabled={secondaryButton.disabled}
          >
            {secondaryButton.label}
          </Button>
        )}
        {primaryButton && (
          <Button
            size="md"
            leftSection={primaryButton.icon}
            classNames={primaryButton.classNames}
            onClick={primaryButton.onClick}
            color={primaryButton.color}
            disabled={primaryButton.disabled}
          >
            {primaryButton.label}
          </Button>
        )}
      </div>
    </div>
  );
};
