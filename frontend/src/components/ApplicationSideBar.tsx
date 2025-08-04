"use client";
import DashboardIcon from "@@/icons/dashboard-icon.svg";
import UserIcon from "@@/icons/user-icon.svg";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { setSidebarOpen } from "@/store/slices/common";
import GreedyGameLogoShort from "@@/images/greedy-game-logo-short.svg";
import GreedyGameLogo from "@@/images/greedy-game-logo.svg";
import { usePathname } from "next/navigation";
import { NavLink } from "@mantine/core";
import { useGetUserInfo } from "@/hooks/useUserProfile";

const ApplicationSideBar = () => {
  const { data: userInfo } = useGetUserInfo();
  const dispatch = useDispatch<AppDispatch>();
  const isOpen = useSelector((state: RootState) => state.common.isSidebarOpen);
  const pathName = usePathname();
  console.log(pathName, "pathName");

  const navigationItems = [
    { icon: DashboardIcon, label: "Dashboard", href: "/", active: true },
    { icon: UserIcon, label: "Users", href: "/users" },
  ];

  return (
    <div
      className={`${
        userInfo?.role === "super_admin" ? "fixed" : "hidden"
      } left-0 top-0 h-full bg-custom-primary-black transition-all duration-300 ease-in-out z-50 ${
        isOpen ? "w-80" : "w-18"
      } `}
      onMouseEnter={() => {
        console.log("aisjdfijaisjdfijaisdf");
        dispatch(setSidebarOpen(true));
      }}
      onMouseLeave={() => dispatch(setSidebarOpen(false))}
    >
      <div className="flex items-center justify-center h-18">
        {isOpen ? (
          <div className="px-6 flex justify-between items-center gap-5">
            <GreedyGameLogo className="w-2/3 text-white h-full" />
            {/* <ActionIcon
              variant="transparent"
              onClick={() => {
                dispatch(setSidebarOpen(false));
              }}
            >
              <LeftArrow className="size-7 pt-1" />
            </ActionIcon> */}
          </div>
        ) : (
          <div>
            <GreedyGameLogoShort className="size-10 " />
          </div>
        )}
      </div>

      <ul className={`space-y-2 ${isOpen ? "px-3" : "px-3"} pt-4`}>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathName === item.href;

          return (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              leftSection={
                <Icon
                  className={`size-6 transition-colors duration-200 ${
                    isActive
                      ? "text-[#5CC994]"
                      : "text-[#657081] group-hover:text-[#5CC994]"
                  }`}
                />
              }
              classNames={{
                root: `group rounded-lg transition-colors duration-200 ${
                  isActive ? "!bg-[#383E47]" : "hover:!bg-[#383E47]"
                }`,
                label: `!text-base ${isOpen ? "" : "invisible"} ${
                  isActive
                    ? "text-[#5CC994]"
                    : "text-[#B8BDC5] group-hover:text-[#5CC994]"
                }`,
                body: "p-2",
              }}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default ApplicationSideBar;
