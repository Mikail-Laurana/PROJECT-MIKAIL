import { useState } from "react";
import Button from "../Elements/Button/button";
import InputForm from "../Elements/input";

const FormRegister = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
      e.preventDefault();

      const { fullName, email, password, confirmPassword } = formData;

      if (password !== confirmPassword) {
        alert("Password dan konfirmasi password tidak cocok!");
      return;
      }

    const response = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullname: fullName, email, password }),
    });

    const data = await response.json();
    console.log("Response:", data);
    alert(data.message || "Registrasi sukses!");
  };

  return (
    <form onSubmit={handleRegister}>
      <InputForm label="Full Name" name="fullName" type="text" placeholder="Masukkan Nama Anda" onChange={handleChange}/>
      <InputForm label="Email" name="email" type="email" placeholder="Masukkan Email Anda" onChange={handleChange}/>
      <InputForm label="Password" name="password" type="password" placeholder="Masukkan Password Anda" onChange={handleChange}/>
      <InputForm label="Confirm Password" name="confirmPassword" type="password" placeholder="Konfirmasi Password Anda" onChange={handleChange}/>
      <Button variant="bg-blue-600 w-full" type="submit">Register</Button>
    </form>
  );
};

export default FormRegister;
