import { DateTime } from "luxon";
import jalaali from "jalaali-js";

export const usersSchema = [
  {
    title: "API Key",
    field: "rasmioApiKey",          // ✅ فیلد جدید
    widthGrow: 2,
    sorter: "string",
    hozAlign: "center",
    copyable: true,
  },
  {
    title: "نام",
    field: "name",
    widthGrow: 2,
    sorter: "string",
  },
  {
    title: "وضعیت",
    field: "status",
    sorter: "string",
    hozAlign: "center",
    headerFilter: "select",
    headerFilterParams: { values: ["فعال", "غیرفعال"] },
    widthGrow: 1,
  },
  {
    title: "سهمیه",
    field: "quota",
    sorter: "number",
    hozAlign: "center",
    width: 100,
  },
  {
    title: "تاریخ ایجاد",
    field: "createdAt",
    hozAlign: "center",
    widthGrow: 1,
    formatter: (cell) => {
      const value = cell.getValue();
      if (!value) return "-";
      const date = DateTime.fromISO(value);
      if (!date.isValid) return "-";
      const { jy, jm, jd } = jalaali.toJalaali(date.toJSDate());
      const time = date.toFormat("HH:mm");
      return `${jy}/${String(jm).padStart(2, "0")}/${String(jd).padStart(2, "0")} ${time}`;
    },
  },
  {
    title: "آخرین بروزرسانی",
    field: "updatedAt",
    hozAlign: "center",
    widthGrow: 1,
    formatter: (cell) => {
      const value = cell.getValue();
      if (!value) return "-";
      const date = DateTime.fromISO(value);
      if (!date.isValid) return "-";
      const { jy, jm, jd } = jalaali.toJalaali(date.toJSDate());
      const time = date.toFormat("HH:mm");
      return `${jy}/${String(jm).padStart(2, "0")}/${String(jd).padStart(2, "0")} ${time}`;
    },
  },
  {
    title: "ویرایش",
    field: "edit",
    hozAlign: "center",
    width: 140,
    formatter: () => {
      return `
        <button class="edit-btn"
          style="
            background-color: #6059D6;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 6px 12px;
            cursor: pointer;
            font-family: Vazirmatn;
            transition: all 0.2s ease;
          "
          onmouseover="this.style.backgroundColor='#4d48b6'"
          onmouseout="this.style.backgroundColor='#6059D6'"
        >
          ویرایش
        </button>`;
    },
    cellClick: (e, cell) => {
      const rowData = cell.getRow().getData();
      if (cell.getTable().options.onEditClient) {
        cell.getTable().options.onEditClient(rowData);
      }
    },
  },
];
