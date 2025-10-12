// App.jsx
import React, { useState, useEffect } from "react";
import DataTable from "../../component/Datatable/DataTable";
import {usersSchema}  from "../../utils/Schema"
import "@fontsource/vazirmatn";           // وزن عادی
import "@fontsource/vazirmatn/500.css";   // اگر وزن نیمه‌بولد خواستی
import "@fontsource/vazirmatn/700.css";   // بولد برای تیترها



const API_KEY = "cb8d0be9c4f8c01e5d6a6273f3c9ab1467df9d8a75c248724105dbe3f1fd547a"; 
const API_URL = "/admin/clients"; 

function Users() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch(API_URL, {
          method: "GET",
          headers: {
            "X-Master-Key": API_KEY,
            "Content-Type": "application/json"
          }
        });

        if (!res.ok) {
          throw new Error(`خطا از API : ${res.status}`);
        }

        const json = await res.json();
      

      
        const cleanData = json.map(item => ({
          name: item.name,
          quota: item.quota,
          status: item.status === "active" ? "فعال" : "غیرفعال",
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }));

        setData(cleanData);
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    getData();
  }, []);

  return (
    <div>
      <h2>جدول کاربران</h2>
      <DataTable data={data} schema={usersSchema} />
    </div>
  );
}
export default Users;