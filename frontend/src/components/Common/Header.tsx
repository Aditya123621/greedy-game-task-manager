"use client";
import React, { Fragment, useState } from "react";
import SearchIcon from "@@/icons/search-icon.svg";
import BellIcon from "@@/icons/bell-icon.svg";
import GreedyGameLogo from "@@/images/greedy-game-logo.svg";
import { ActionIcon, Avatar, Button, Popover, TextInput } from "@mantine/core";
import { signOut, useSession } from "next-auth/react";
import DropDownArrow from "@@/icons/curved-angle-arrow.svg";
import ProfileIcon from "@@/icons/profile-icon.svg";
import LogoutIcon from "@@/icons/logout-icon.svg";
import { useAuth } from "@/hooks/useAuth";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { openDrawer } from "@/store/slices/drawerSlice";
import apiEndPoints from "@/services/apiEndpoint";

export default function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();
  const [opened, setOpened] = useState<boolean>(false);
  const { logout } = useAuth();
  const [loadingLogout, setLoadingLogout] = useState(false);

  const handleLogout = async () => {
    setLoadingLogout(true);
    try {
      await logout();
      await signOut({ callbackUrl: apiEndPoints.SIGN_IN });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoadingLogout(false);
    }
  };

  const handleClickProfile = () => {
    setOpened(false);
    dispatch(openDrawer({ type: "profile", data: { name: "Aditya" } }));
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm px-4 py-3 h-18">
      <div className="max-w-8xl mx-auto flex items-center justify-between">
        <div className="flex gap-10">
          <div className="flex items-center">
            <GreedyGameLogo className="w-40 h-full" />
          </div>

          <TextInput
            size="md"
            placeholder="Search"
            leftSection={<SearchIcon className="size-5" />}
            classNames={{
              input: " !bg-[#FAFAFA]",
            }}
          />
        </div>

        <div className="flex items-center space-x-4">
          <ActionIcon variant="transparent">
            <BellIcon className="h-5 w-5" />
          </ActionIcon>

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
                  src={session?.user?.image}
                  name={session?.user?.name as string}
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
