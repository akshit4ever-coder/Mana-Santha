export type OrderCutoffStatus = {
  isAfterCutoff: boolean;
  cutoffTime: "7:30 PM";
  deliveryDate: Date;
  cutoffHour: number;
  cutoffMinute: number;
  cutoffSeconds: number;
};

const CUT_OFF_LOCAL_TIME = { hour: 19, minute: 30, second: 0 };
const TIMEZONE = "Asia/Kolkata";

function toIstDate(date: Date): Date {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const map = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));

  const isoLike = `${map.year}-${map.month}-${map.day}T${map.hour}:${map.minute}:${map.second}`;
  return new Date(`${isoLike}+05:30`);
}

export function getOrderCutoffStatus(inputDate: Date = new Date()): OrderCutoffStatus {
  const istNow = toIstDate(inputDate);
  const cutoffToday = new Date(istNow);
  cutoffToday.setHours(CUT_OFF_LOCAL_TIME.hour, CUT_OFF_LOCAL_TIME.minute, CUT_OFF_LOCAL_TIME.second, 0);

  const isAfterCutoff = istNow.getTime() >= cutoffToday.getTime();

  const deliveryDate = new Date(istNow);
  deliveryDate.setHours(12, 0, 0, 0);

  if (isAfterCutoff) {
    deliveryDate.setDate(deliveryDate.getDate() + 1);
  }

  return {
    isAfterCutoff,
    cutoffTime: "7:30 PM",
    deliveryDate,
    cutoffHour: CUT_OFF_LOCAL_TIME.hour,
    cutoffMinute: CUT_OFF_LOCAL_TIME.minute,
    cutoffSeconds: CUT_OFF_LOCAL_TIME.second,
  };
}

export function getDeliveryDateLabel(date: Date = new Date()) {
  const status = getOrderCutoffStatus(date);
  return status.deliveryDate;
}
