import React from "react";
import LoginForm from "../components/auth/Loginform";

const LoginPage = () => {
  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Welcome Back</h1>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
