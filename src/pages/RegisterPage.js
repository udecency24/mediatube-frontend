import React from "react";
import RegisterForm from "../components/auth/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Create an Account</h1>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
