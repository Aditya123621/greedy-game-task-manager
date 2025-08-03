"use client";
import { Drawer } from "@mantine/core";
import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { closeDrawer } from "@/store/slices/drawerSlice";
import ProfileDrawer from "./ProfileDrawer";
import AddTodo from "./AddTodo";

const NotificationView = () => <div>You have new notifications.</div>;

const TodoDetailView = ({ data }: { data?: unknown }) => (
  <div>Todo Detail: {JSON.stringify(data)}</div>
);

const drawerComponents: Record<string, FC<{ data?: unknown }>> = {
  profile: ProfileDrawer,
  notification: NotificationView,
  todo_detail: TodoDetailView,
  add_todo: AddTodo,
};

const DrawerContainer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    opened,
    type,
    data = {},
  } = useSelector((state: RootState) => state.drawer);

  const handleDrawerClose = () => dispatch(closeDrawer());

  const ContentComponent = type ? drawerComponents[type] : null;

  const getTitle = () => {
    switch (type) {
      case "profile":
        return "Profile";
      case "notification":
        return "Notifications";
      case "todo_detail":
        return "Todo Details";
      case "add_todo":
        return "Add Todo";
      default:
        return "";
    }
  };

  return (
    <Drawer
      opened={opened}
      onClose={handleDrawerClose}
      title={getTitle()}
      position="right"
      classNames={{
        title: "!text-custom-primary-black !font-semibold !text-2xl",
      }}
    >
      {ContentComponent ? <ContentComponent data={data} /> : null}
    </Drawer>
  );
};

export default DrawerContainer;
