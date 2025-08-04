export const statusStyles = {
  upcoming: {
    label: "Upcoming",
    text: "!text-[#E4B401]",
    bg: "#FFD0230D",
  },
  completed: {
    label: "Completed",
    text: "!text-[#0CAF60]",
    bg: "#E7F7EF",
  },
  default: {
    label: "Unknown",
    text: "!text-gray-500",
    bg: "#FFD0230D",
  },
};

export type StatusType = keyof Omit<typeof statusStyles, "default">;

export const getStatusStyle = (status: string) => {
  return statusStyles[status as StatusType] || statusStyles.default;
};
