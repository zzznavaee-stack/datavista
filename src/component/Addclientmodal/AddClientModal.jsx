import React, { useState } from "react";
import "./Addclientmodal.css"

const AddClientModal = ({ show, onClose, onAdd }) => {
  const [newClient, setNewClient] = useState({
    rasmioApiKey: "",
    name: "",
    quota: "",
    status: "active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewClient((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!newClient.name || !newClient.quota || !newClient.rasmioApiKey) {
      alert("لطفاً تمام فیلدها را پر کنید");
      return;
    }
    onAdd(newClient);
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>افزودن مشتری جدید</h2>

        <label>کلید API رَسمیو:</label>
        <input
          type="text"
          name="rasmioApiKey"
          value={newClient.rasmioApiKey}
          onChange={handleChange}
          placeholder="مثلاً: ab123xyz"
        />

        <label>نام مشتری:</label>
        <input
          type="text"
          name="name"
          value={newClient.name}
          onChange={handleChange}
          placeholder="نام کامل مشتری"
        />

        <label>سهمیه (Quota):</label>
        <input
          type="number"
          name="quota"
          value={newClient.quota}
          onChange={handleChange}
          placeholder="مثلاً 1000"
        />

        <label>وضعیت:</label>
        <select
          name="status"
          value={newClient.status}
          onChange={handleChange}
        >
          <option value="active">فعال</option>
          <option value="inactive">غیرفعال</option>
        </select>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>انصراف</button>
          <button className="save-btn" onClick={handleSubmit}>ذخیره</button>
        </div>
      </div>
    </div>
  );
};

export default AddClientModal;
  