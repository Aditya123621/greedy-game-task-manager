"use client";
import React, { Fragment, useState } from "react";
import SearchIcon from "@@/icons/search-icon.svg";
import BellIcon from "@@/icons/bell-icon.svg";
import GreedyGameLogo from "@@/images/greedy-game-logo.svg";
import { Avatar, Button, Indicator, Popover, TextInput } from "@mantine/core";
import { signOut } from "next-auth/react";
import DropDownArrow from "@@/icons/curved-angle-arrow.svg";
import ProfileIcon from "@@/icons/profile-icon.svg";
import LogoutIcon from "@@/icons/logout-icon.svg";
import { useAuth } from "@/hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { openDrawer } from "@/store/slices/drawerSlice";
import apiEndPoints from "@/services/apiEndpoint";
import { useDebouncedCallback } from "@mantine/hooks";
import { setSearch } from "@/store/slices/todoSlice";
import { useUpcomingTodos } from "@/hooks/useTodos";
import { useGetUserInfo } from "@/hooks/useUserProfile";
import Link from "next/link";

export default function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const [opened, setOpened] = useState<boolean>(false);
  const { logout } = useAuth();
  const { data: userInfo } = useGetUserInfo();
  const [loadingLogout, setLoadingLogout] = useState(false);
  const isOpen = useSelector((state: RootState) => state.drawer.opened);
  const { data: upcomingTodos } = useUpcomingTodos(!isOpen);

  const debouncedDispatch = useDebouncedCallback((val: string) => {
    dispatch(setSearch(val));
  }, 300);

  const handleLogout = async () => {
    setLoadingLogout(true);
    try {
      logout();
      await signOut({ callbackUrl: apiEndPoints.SIGN_IN });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoadingLogout(false);
    }
  };

  const handleClickProfile = () => {
    setOpened(false);
    dispatch(openDrawer({ type: "profile" }));
  };
  const buttonConfigs = [
    {
      key: "profile",
      label: "Profile",
      icon: <ProfileIcon className="size-5" />,
      onClick: handleClickProfile,
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutIcon className="size-5" />,
      onClick: handleLogout,
    },
  ];

  return (
    <header
      className={`fixed top-0 ${
        userInfo?.role === "super_admin" ? "left-18" : "left-0"
      } right-0 z-40 bg-white shadow-sm px-4 py-3 h-18`}
    >
      <div className="max-w-8xl mx-auto flex items-center justify-between">
        <div className="flex gap-10">
          <Link href={"/"}>
            <GreedyGameLogo className="w-40 h-full text-black" />
          </Link>

          <TextInput
            size="md"
            placeholder="Search"
            onChange={(e) => {
              const val = e.currentTarget.value;
              debouncedDispatch(val);
            }}
            leftSection={<SearchIcon className="size-5" />}
            classNames={{
              input: "!bg-[#FAFAFA]",
            }}
          />
        </div>

        <div className="flex items-center space-x-6">
          <Indicator
            color="red"
            inline
            label={upcomingTodos?.length}
            disabled={!upcomingTodos || upcomingTodos?.length === 0}
            size={16}
            onClick={() => {
              dispatch(openDrawer({ type: "notification" }));
            }}
          >
            <BellIcon className="size-5" />
          </Indicator>

          <Popover
            opened={opened}
            onChange={setOpened}
            width={200}
            position="bottom-end"
            shadow="md"
            radius={"lg"}
            classNames={{ dropdown: "!bg-white !space-y-1" }}
          >
            <Popover.Target>
              <button
                className="flex items-center gap-1"
                onClick={() => setOpened((o) => !o)}
              >
                <Avatar
                  color="primary"
                  src={userInfo?.avatar}
                  name={userInfo?.name as string}
                />
                <DropDownArrow
                  className={`size-4 transition-transform duration-300 ${
                    opened ? "rotate-180" : ""
                  }`}
                />
              </button>
            </Popover.Target>
            <Popover.Dropdown>
              {buttonConfigs.map(({ key, label, icon, onClick }) => (
                <Fragment key={key}>
                  <Button
                    size="xs"
                    variant="transparent"
                    fullWidth
                    loading={key === "logout" && loadingLogout}
                    onClick={onClick}
                    leftSection={icon}
                    classNames={{
                      root: "!p-0 !m-0 !justify-start",
                      inner: "!p-0 !m-0 !justify-start",
                      label: "!text-sm !font-medium !text-custom-primary-black",
                    }}
                  >
                    {label}
                  </Button>
                  {key === "profile" && <hr className="text-[#E9EAEC]" />}
                </Fragment>
              ))}
            </Popover.Dropdown>
          </Popover>
        </div>
      </div>
    </header>
  );
}
