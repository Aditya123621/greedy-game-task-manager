"use client";
import {
  Button,
  createTheme,
  MantineProvider,
  Menu,
  MultiSelect,
  PasswordInput,
  Popover,
  Select,
} from "@mantine/core";
import { DateInput, DatePickerInput } from "@mantine/dates";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { Provider as ReduxProvider } from "react-redux";

import AngleArrow from "@@/icons/angle-arrow.svg";
import CalenderIcon from "@@/icons/calender-icon.svg";
import CloseEye from "@@/icons/eye-closed.svg";
import OpenEye from "@@/icons/eye-open.svg";
import { store } from "@/store/store";

import type { DayOfWeek } from "@mantine/dates";
import type { Session } from "next-auth";
import { useState } from "react";

function ClientWrapper({
  children,
  session,
}: {
  children: React.ReactNode;
  session: unknown;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );
  const commonDateProps = {
    firstDayOfWeek: 0 as DayOfWeek,
    valueFormat: "MMM DD, YYYY",
    weekdayFormat: "ddd",
    hideOutsideDates: true,
    nextIcon: <AngleArrow height={12} width={12} />,
    previousIcon: <AngleArrow height={12} width={12} className="rotate-180" />,
    clearable: true,
    rightSection: <CalenderIcon />,
    classNames: {
      calendarHeaderLevel: "!text-gray-2 !font-semibold",
      weekday: "!text-gray-light !text-xs !uppercase !tracking-widest",
      input: "!h-12",
    },
  };

  const commonDateInputClassNames = {
    day: "!font-medium !text-base !rounded-full !text-gray-2 data-[selected]:!text-white",
  };

  const commonDatePickerInputClassNames = {
    day: "!font-medium !text-base !text-gray-2 data-[selected]:!text-white",
  };
  const theme = createTheme({
    colors: {
      primary: [
        "#e6f8ef",
        "#c2eed8",
        "#9de3bf",
        "#74d7a4",
        "#4fcb8a",
        "#0CAF60",
        "#0a9f56",
        "#088b4b",
        "#067a42",
        "#045f34",
      ],
    },
    fontFamily: "var(--font-inter), sans-serif",
    primaryColor: "primary",
    components: {
      Select: Select.extend({
        defaultProps: {
          rightSection: <AngleArrow />,
          withCheckIcon: false,
          rightSectionPointerEvents: "none",
          classNames: {
            option: "!text-base ",
          },
        },
      }),
      Menu: Menu.extend({
        defaultProps: {
          classNames: {
            item: "!text-base ",
          },
          shadow: "md",
        },
      }),
      PasswordInput: PasswordInput.extend({
        defaultProps: {
          visibilityToggleIcon: ({ reveal }) => (
            <VisibilityToggleIcon reveal={reveal} />
          ),
        },
      }),
      MultiSelect: MultiSelect.extend({
        defaultProps: {
          rightSection: <AngleArrow />,
          rightSectionPointerEvents: "none",
          classNames: {
            input: "flex items-center !text-base ",
          },
        },
      }),
      DateInput: DateInput.extend({
        defaultProps: {
          ...commonDateProps,
          classNames: {
            ...commonDateProps.classNames,
            ...commonDateInputClassNames,
          },
        },
      }),
      DatePickerInput: DatePickerInput.extend({
        defaultProps: {
          ...commonDateProps,
          classNames: {
            ...commonDateProps.classNames,
            ...commonDatePickerInputClassNames,
          },
        },
      }),
      Popover: Popover.extend({
        defaultProps: {
          classNames: {
            dropdown: "!bg-[#F8FAFC] !border-none",
          },
        },
      }),
      Button: Button.extend({
        defaultProps: {
          classNames: {
            label: "!font-medium",
            root: "!py-[0.65rem] !px-[1.25rem] !shadow-pbutton",
          },
          size: "md",
          radius: "md",
        },
      }),
    },
  });

  function VisibilityToggleIcon({ reveal }: { reveal: boolean }) {
    return reveal ? <CloseEye /> : <OpenEye />;
  }

  return (
    <SessionProvider session={session as Session}>
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <MantineProvider theme={theme}>{children}</MantineProvider>
        </QueryClientProvider>
      </ReduxProvider>
    </SessionProvider>
  );
}

export default ClientWrapper;
