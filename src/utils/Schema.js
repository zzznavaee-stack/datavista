import { DateTime } from "luxon";
import jalaali from "jalaali-js";

export const usersSchema = [
  {
    title: "نام",
    field: "name",
    sorter: "string",
    headerFilter: false,
    widthGrow: 2,
    copyable: true,

  },
  {
    title: "وضعیت",
    field: "status",
    sorter: "string",
    hozAlign: "center",
    headerFilter: "select",
    headerFilterParams: { values: ["فعال", "غیر فعال"] },
    widthGrow: 1,
  },
  {
    title: "سهمیه",
    field: "quota",
    sorter: "number",
    hozAlign: "center",
    width: 120,
  },
  {
    title: "تاریخ ایجاد",
    field: "createdAt",
    hozAlign: "center",
    widthGrow: 1,
    formatter: function (cell) {
      const value = cell.getValue();
      if (!value) return "-";
      try {
        const date = DateTime.fromISO(value);
        if (!date.isValid) return "-";
        const { jy, jm, jd } = jalaali.toJalaali(date.toJSDate());
        const time = date.toFormat("HH:mm");
        return `${jy}/${String(jm).padStart(2, "0")}/${String(jd).padStart(2, "0")} ${time}`;
      } catch {
        return "-";
      }
    },
    sorter: function (a, b) {
      const da = DateTime.fromISO(a);
      const db = DateTime.fromISO(b);
      return da.toMillis() - db.toMillis(); 
    },
  },
  {
    title: "آخرین بروزرسانی",
    field: "updatedAt",
    hozAlign: "center",
    widthGrow: 1,
    formatter: function (cell) {
      const value = cell.getValue();
       console.log("rendered cell value:", value);
      if (!value) return "-";
      try {
        const date = DateTime.fromISO(value);
        if (!date.isValid) return "-";
        const { jy, jm, jd } = jalaali.toJalaali(date.toJSDate());
        const time = date.toFormat("HH:mm");
        return `${jy}/${String(jm).padStart(2, "0")}/${String(jd).padStart(2, "0")} ${time}`;
      } catch {
        return "-";
      }
    },
    sorter: function (a, b) {
      const da = DateTime.fromISO(a);
      const db = DateTime.fromISO(b);
      return da.toMillis() - db.toMillis(); // ✅ همین تغییر در اینجا هم لازم است
    },
  },
];
