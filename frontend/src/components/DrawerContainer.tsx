"use client";
import { Drawer } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { closeDrawer } from "@/store/slices/drawerSlice";
import ProfileDrawer from "./ProfileDrawer";
import AddTodo from "./AddTodo";
import TodoDetail from "./TodoDetail";
import NotificationView from "./NotificationView";

interface DrawerData {
  id?: string;
  [key: string]: unknown;
}

const drawerComponents = {
  profile: ProfileDrawer,
  notification: NotificationView,
  todo_detail: TodoDetail,
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
        return "All Notifications";
      case "todo_detail":
        return "Todo Details";
      case "add_todo":
        return (data as DrawerData)?.id ? "Edit Todo" : "Add Todo";
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
      {ContentComponent ? <ContentComponent data={data as { id: string }} /> : null}
    </Drawer>
  );
};

export default DrawerContainer;
