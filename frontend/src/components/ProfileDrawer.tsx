import { useAuth } from "@/hooks/useAuth";
import { Avatar, Badge, Button, FileButton, TextInput } from "@mantine/core";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import EditIcon from "@@/icons/edit-icon.svg";
import LogoutIcon from "@@/icons/logout-icon.svg";
import dayjs from "dayjs";
import apiEndPoints from "@/services/apiEndpoint";
import {
  useGetUserInfo,
  useUpdateProfile,
  useUploadImage,
} from "@/hooks/useUserProfile";

interface ProfileFormData {
  name: string;
  email: string;
}

export default function ProfileDrawer() {
  const { data: userInfo } = useGetUserInfo();
  const { mutate: updateProfile, isPending: updateProfilePending } =
    useUpdateProfile();
  const { mutate: uploadImage, isPending: isUploadingImage } = useUploadImage();

  const { logout } = useAuth();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const [file, setFile] = useState<File | null>(null);
  const [loadingLogout, setLoadingLogout] = useState(false);

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

  const handleUpdate = (data: ProfileFormData) => {
    updateProfile(data);
  };

  const statData = [
    {
      id: 1,
      label: "All Todos",
      value: 12,
    },
    {
      id: 2,
      label: "Upcoming",
      value: 12,
    },
    {
      id: 3,
      label: "Completed",
      value: 12,
    },
  ];

  console.log(file, "filefilefile");

  useEffect(() => {
    if (userInfo) {
      reset({
        name: userInfo.name as string,
        email: userInfo?.email as string,
      });
    }
  }, [userInfo, reset]);

  return (
    <div className="">
      <div className="p-6 flex flex-col gap-4 border rounded-xl border-gray-300 bg-[#FDFDFD]">
        <div className="flex items-center space-x-4">
          <FileButton
            onChange={(selectedFile) => {
              setFile(selectedFile);
              if (selectedFile) uploadImage(selectedFile);
            }}
            accept="image/png,image/jpeg"
          >
            {(props) => (
              <button {...props} className="relative">
                <Avatar
                  size="lg"
                  color="primary"
                  src={userInfo?.avatar}
                  name={userInfo?.name as string}
                />
                <EditIcon className="size-7 absolute top-2 right-0 -translate-y-1/2" />
              </button>
            )}
          </FileButton>

          <div className="space-y-1">
            <Badge
              color="#FFD02326"
              size="lg"
              classNames={{ label: "text-[#C09802] font-normal" }}
            >
              {userInfo?.role === "super_admin" ? "Super Admin" : "User"}
            </Badge>
            <p className="text-sm text-gray-500">
              Joined On: {dayjs(userInfo?.createdAt).format("DD/MM/YYYY HH:mm")}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
          <Controller
            name="name"
            control={control}
            rules={{
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            }}
            render={({ field }) => (
              <TextInput
                {...field}
                placeholder="Enter Name"
                size="lg"
                error={errors.name?.message}
                label={"Name"}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                placeholder="Enter your email"
                size="lg"
                label="Email"
                readOnly
              />
            )}
          />

          <Button
            type="submit"
            color="#E7F7EF"
            fullWidth
            size="lg"
            classNames={{ label: "!text-[#097C44] !font-normal" }}
            disabled={!isDirty}
            loading={updateProfilePending}
          >
            Update Profile
          </Button>
        </form>

        <hr className="text-[#E9EAEC]" />

        <div className="grid grid-cols-3">
          {statData?.map((each) => (
            <div
              key={each.id}
              className={`flex flex-col items-center gap-2 ${
                each.id === 2 ? "border-x-2 border-[#E9EAEC]" : ""
              }`}
            >
              <div className="font-semibold text-gray-600">{each.label}</div>
              <div className="text-3xl font-semibold">{each?.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-3">
        <Button
          size="xs"
          variant="transparent"
          onClick={handleLogout}
          leftSection={<LogoutIcon className="size-5" />}
          loading={loadingLogout}
          classNames={{
            label: "!text-sm !font-medium !text-custom-primary-black",
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
