import { format } from "date-fns";

export const formatDate = (date: string | Date, formatStr: string = "PPP") => {
  return format(new Date(date), formatStr);
};

export const getCurrentMonthInfo = () => {
  const now = new Date();
  return {
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  };
};

export const getMonthName = (month: number) => {
  const dates = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return dates[month - 1];
};
