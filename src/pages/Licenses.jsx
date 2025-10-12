import React, { useEffect } from "react";

// 🔹 آدرس API و کلید اصلی
const API_URL = "/admin/usage";
const API_KEY =
  "cb8d0be9c4f8c01e5d6a6273f3c9ab1467df9d8a75c248724105dbe3f1fd547a";

function Licenses() {
  useEffect(() => {
    async function fetchUsageData() {
      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Master-Key": API_KEY, // هدر امنیتی برای مجوز دسترسی
          },
        });

        // بررسی پاسخ HTTP
        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        // تبدیل نتیجه به JSON
        const data = await response.json();
        console.log("✅ داده‌های /admin/usage دریافت شد:", data);
      } catch (err) {
        console.error("❌ خطا در دریافت داده‌های /admin/usage:", err);
      }
    }

  
    fetchUsageData();
  }, []);

  return (<div></div>

  );
}

export default Licenses;
