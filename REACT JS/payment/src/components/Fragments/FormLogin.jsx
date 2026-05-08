import { useState } from "react";
import Button from "../Elements/Button/button";
import InputForm from "../Elements/input";

const FormLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    console.log("Response data:", data);

    if (data.message === "Login success") {
      alert("Login berhasil!");
      
      // FIX: Simpan email langsung ke key "email" agar kompatibel dengan Product.jsx
      localStorage.setItem("email", data.user.email); 
      localStorage.setItem("user_id", data.user.id);
      
      // Anda tetap bisa menyimpan seluruh objek user di key lain jika diperlukan,
      // tapi untuk tampilan di Product.jsx, key "email" sudah cukup.
      // localStorage.setItem("user_data", JSON.stringify(data.user)); 
      
      window.location.href = "/product"; // redirect
    }else {
      alert(data.error || "Login gagal!");
    }
  } catch (error) {
    console.error("Login fetch error:", error);
    alert("Terjadi error saat login");
  }
};


  return (
    <form onSubmit={handleSubmit}>
      <InputForm label="Email" name="email" type="email" placeholder="Masukkan Email Anda" onChange={handleChange}/>
      <InputForm label="Password" name="password" type="password" placeholder="Masukkan Password Anda" onChange={handleChange}/>
      <Button variant="bg-blue-600 w-full" type="submit">Login</Button>
    </form>
  );
};

export default FormLogin;
