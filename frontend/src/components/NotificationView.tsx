import { useUpcomingTodos } from "@/hooks/useTodos";
import { getStatusStyle } from "@/utils/getBadgeColor";
import { Badge } from "@mantine/core";
import dayjs from "dayjs";
import { TruncateAndProvideTooltip } from "./TruncateAndProvideTooltip";

const NotificationView = () => {
  const { data: upcomingTodos } = useUpcomingTodos(true);
  return (
    <div className="flex flex-col gap-4">
      {upcomingTodos && upcomingTodos?.length > 0 ? (
        upcomingTodos?.map((each) => {
          const status = each?.status?.toLocaleLowerCase();
          const { label, text, bg } = getStatusStyle(status);
          return (
            <div
              key={each._id}
              className="flex flex-col gap-3 rounded-lg border border-[#E9EAEC] p-5"
            >
              <div className="flex gap-2">
                <TruncateAndProvideTooltip
                  maxWidth={400}
                  text={each?.title}
                  className="text-custom-primary-black font-semibold text-lg"
                />
                <Badge
                  size="lg"
                  color={bg}
                  classNames={{
                    label: `${text} !font-normal`,
                    root: "!normal-case !shrink-0 !min-w-0",
                  }}
                >
                  {label}
                </Badge>
              </div>
              <TruncateAndProvideTooltip
                maxWidth={400}
                text={each?.description}
                className="text-[#989FAB] text-sm"
              />
              <h3 className="text-[#657081] text-sm">
                {dayjs(each?.dueDate).format("DD/MM/YYYY")}&nbsp;{each?.dueTime}
              </h3>
            </div>
          );
        })
      ) : (
        <div>Nothing here...</div>
      )}
    </div>
  );
};

export default NotificationView;
