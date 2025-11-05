import React, { useState, useEffect } from "react";
import DataTable from "../../component/Datatable/DataTable";
import { usersSchema } from "../../utils/Schema";
import Filter from "../../component/Filter/Filter";
import AddClientModal from "../../component/Addclientmodal/AddClientModal";
import "@fontsource/vazirmatn";

const API_KEY = "cb8d0be9c4f8c01e5d6a6273f3c9ab1467df9d8a75c248724105dbe3f1fd547a";
const BASE_URL = "/admin/clients";

function Users() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  // 🔸 مدیریت تغییر فیلترها
  const handleFiltersChange = (newFilters) => setFilters(newFilters);

  // 🔹 دریافت لیست کاربران در شروع
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(BASE_URL, {
          headers: {
            "X-Master-Key": API_KEY,
            "Content-Type": "application/json",
            accept: "application/json",
          },
        });

        const json = await res.json();

        const cleaned = json.map((item) => ({
          rasmioApiKey: item.rasmioApiKey,
          name: item.name,
          quota: item.quota,
          status: item.status === "active" ? "فعال" : "غیرفعال",
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }));
        setData(cleaned);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  // 🔹 افزودن مشتری جدید (POST)
  const handleAddClient = async (newClient) => {
    try {
      const formattedClient = {
        ...newClient,
        status: newClient.status === "فعال" ? "active" : "inactive",
      };

      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "X-Master-Key": API_KEY,
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(formattedClient),
      });

      if (!res.ok) throw new Error("Add failed");

      const result = await res.json();
      const formattedResult = {
        ...result,
        status: result.status === "active" ? "فعال" : "غیرفعال",
      };

      setData((prev) => [...prev, formattedResult]);
      setShowModal(false);
      setEditingClient(null);
    } catch (err) {
      console.error("API POST Error:", err);
      alert("خطا در افزودن مشتری جدید");
    }
  };

  // 🔹 آماده‌سازی داده هنگام کلیک بر دکمه ویرایش
  const handleEditClient = (rowData) => {
    setEditingClient(rowData);
    setShowModal(true);
  };

  // 🔹 بروزرسانی اطلاعات مشتری (PUT به مسیر با apikey)
// 🟣 بروزرسانی کلاینت (PUT)
const handleUpdateClient = async (oldClient, updatedForm) => {
  try {
    // ساخت فرم مطابق مدل سرور
    const formattedForm = {
      rasmioApiKey: oldClient.rasmioApiKey, // ✅ باید در body باشد
      name: updatedForm.name.trim(),
      quota: Number(updatedForm.quota),
      status: updatedForm.status === "فعال" ? "enabled" : "disabled", // ✅ مطابقت با مدل واقعی
    };

    const response = await fetch(
      `/admin/clients/cb8d0be9c4f8c01e5d6a6273f3c9ab1467df9d8a75c248724105dbe3f1fd547a`,
      {
        method: "PUT",
        headers: {
          "X-Master-Key": API_KEY,
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(formattedForm),
      }
    );

    // ✅ بررسی کامل برای خطای سرور
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server response:", errorText);
      throw new Error("Server returned error " + response.status);
    }

    const updatedClient = await response.json();

    // بروزرسانی state با ترجمه وضعیت به فارسی برای جدول
    setData((prev) =>
      prev.map((c) =>
        c.rasmioApiKey === oldClient.rasmioApiKey
          ? {
              ...updatedClient,
              status:
                updatedClient.status === "enabled" ? "فعال" : "غیرفعال",
            }
          : c
      )
    );

    setShowModal(false);
    setEditingClient(null);
  } catch (err) {
    console.error("خطا در PUT:", err);
    alert("❌ خطا در بروزرسانی اطلاعات مشتری. لطفاً لاگ کنسول را بررسی کن.");
  }
};


  // 🔹 رابط کاربری صفحه
  return (
    <div
      style={{
        fontFamily: "Vazirmatn",
        padding: "1rem 1.3rem",
        backgroundColor: "#f9f9fb",
        minHeight: "100vh",
      }}
    >
      <h2
        style={{
          color: "#6059D6",
          marginBottom: "1rem",
          fontWeight: "600",
          letterSpacing: "0.5px",
        }}
      >
        جدول کاربران
      </h2>

      <Filter onFiltersChange={handleFiltersChange} />

      <DataTable
        data={data}
        schema={usersSchema}
        filters={filters}
        options={{
          onEditClient: handleEditClient,
        }}
      />

      <div style={{ marginTop: "1.4rem", textAlign: "right" }}>
        <button
          onClick={() => {
            setShowModal(true);
            setEditingClient(null);
          }}
          style={{
            background: "#6059D6",
            color: "#fff",
            border: "none",
            padding: "0.6rem 1.4rem",
            borderRadius: "8px",
            fontFamily: "Vazirmatn",
            cursor: "pointer",
            fontSize: "0.95rem",
            transition: "0.2s all ease",
          }}
          onMouseOver={(e) => (e.target.style.background = "#4d48b6")}
          onMouseOut={(e) => (e.target.style.background = "#6059D6")}
        >
          افزودن مشتری جدید
        </button>
      </div>

      <AddClientModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingClient(null);
        }}
        onAdd={handleAddClient}
        editingClient={editingClient}
        onUpdate={handleUpdateClient}
      />
    </div>
  );
}

export default Users;
