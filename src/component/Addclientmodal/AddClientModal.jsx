// AddClientModal.jsx
import React, { useState, useEffect } from "react";
import "@fontsource/vazirmatn";

function AddClientModal({ show, onClose, onAdd, editingClient, onUpdate }) {
  const [form, setForm] = useState({
    rasmioApiKey: "",
    name: "",
    quota: "",
    status: "active",
  });

  useEffect(() => {
    if (editingClient) {
      //  پر کردن فرم در حالت ویرایش
      setForm({
        rasmioApiKey: editingClient.rasmioApiKey || "",
        name: editingClient.name || "",
        quota: editingClient.quota || "",
        status: editingClient.status === "فعال" ? "active" : "inactive",
      });
    } else {
      setForm({ rasmioApiKey: "", name: "", quota: "", status: "active" });
    }
  }, [editingClient]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (editingClient) {
      onUpdate(editingClient, form); // در حالت ویرایش
    } else {
      onAdd(form); // در حالت افزودن جدید
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "1.5rem",
          borderRadius: "10px",
          width: "420px",
          fontFamily: "Vazirmatn",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
        }}
      >
        <h3 style={{ color: "#6059D6", marginBottom: "1rem" }}>
          {editingClient ? "ویرایش مشتری" : "افزودن مشتری جدید"}
        </h3>

        <label>نام:</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "0.6rem" }}
        />

        <label>کلید رسمیو:</label>
        <input
          type="text"
          name="rasmioApiKey"
          value={form.rasmioApiKey}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "0.6rem" }}
        />

        <label>سهمیه:</label>
        <input
          type="number"
          name="quota"
          value={form.quota}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "0.6rem" }}
        />

        <label>وضعیت:</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "1rem" }}
        >
          <option value="active">فعال</option>
          <option value="inactive">غیرفعال</option>
        </select>

        <button
          onClick={handleSubmit}
          style={{
            background: "#6059D6",
            color: "#fff",
            border: "none",
            padding: "0.6rem 1.2rem",
            borderRadius: "8px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          {editingClient ? "ذخیره تغییرات" : "افزودن مشتری"}
        </button>

        <button
          onClick={onClose}
          style={{
            marginTop: "0.8rem",
            background: "#ccc",
            border: "none",
            padding: "0.5rem 1.2rem",
            borderRadius: "8px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          بستن
        </button>
      </div>
    </div>
  );
}

export default AddClientModal;
