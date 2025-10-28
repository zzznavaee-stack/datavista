// App.jsx یا Users.jsx
import React, { useState, useEffect } from "react";
import DataTable from "../../component/Datatable/DataTable";
import { usersSchema } from "../../utils/Schema";
import Filter from "../../component/Filter/Filter";
import AddClientModal from "../../component/Addclientmodal/AddClientModal";
import "@fontsource/vazirmatn";
import "@fontsource/vazirmatn/500.css";
import "@fontsource/vazirmatn/700.css";

const API_KEY = "cb8d0be9c4f8c01e5d6a6273f3c9ab1467df9d8a75c248724105dbe3f1fd547a"; 
const API_URL = "admin/clients"; 

function Users() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState([]);
  const [showModal, setShowModal] = useState(false); // 🆕

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch(API_URL, {
          method: "GET",
          headers: {
            "X-Master-Key": API_KEY,
            "Content-Type": "application/json",
            "accept": "application/json",
          }
        });

        if (!res.ok) {
          throw new Error(`خطا از API : ${res.status}`);
        }

        const json = await res.json();

        const cleanData = json.map(item => ({
          rasmioApiKey: item.rasmioApiKey,
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

  //  تابع افزودن کاربر جدید
  const handleAddClient = async (newClient) => {
    try {
      const payload = {
        rasmioApiKey: newClient.rasmioApiKey,
        name: newClient.name,
        quota: parseInt(newClient.quota, 10),
        status: newClient.status,
      };

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "X-Master-Key": API_KEY
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`خطا در ارسال داده: ${res.status}`);
      }

      const result = await res.json();

      const addedClient = {
        rasmioApiKey: result.rasmioApiKey || newClient.rasmioApiKey,
        name: result.name || newClient.name,
        quota: result.quota || newClient.quota,
        status: result.status === "active" ? "فعال" : "غیرفعال",
        createdAt: result.createdAt || new Date().toISOString(),
        updatedAt: result.updatedAt || new Date().toISOString(),
      };

      setData((prev) => [...prev, addedClient]);
      setShowModal(false);
    } catch (error) {
      console.error("API POST Error:", error);
      alert("خطا در ارسال اطلاعات");
    }
  };

  return (
    <div>
      <h2>جدول کاربران</h2>
      <Filter onFiltersChange={handleFiltersChange} />
      <DataTable data={data} schema={usersSchema} filters={filters} />

      {/* 🆕 دکمه باز کردن مودال */}
      <div style={{ marginTop: "1rem" }}>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: "#6059D6",
            color: "#fff",
            border: "none",
            padding: "0.6rem 1.2rem",
            borderRadius: "8px",
            fontFamily: "Vazirmatn",
            cursor: "pointer",
          }}
        >
          افزودن مشتری جدید
        </button>
      </div>


      <AddClientModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddClient}
      />
    </div>
  );
}

export default Users;
