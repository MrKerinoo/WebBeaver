import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loginUser } from "../../api/authApi.js";
import { useAuth } from "../../hooks/useAuth.js";

import { z } from "zod";

export default function Prihlasenie() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(true);

  const loginSchema = z.object({
    username: z
      .string()
      .min(3, { message: "Meno musí mať aspoň 3 znaky" })
      .max(20, { message: "Meno môže mať maximálne 20 znakov" }),

    password: z
      .string()
      .min(6, { message: "Heslo musí mať aspoň 6 znakov" })
      .max(20, { message: "Heslo musí mať maximálne 20 znakov" }),
  });

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginUserMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log("PRIHLASENY", data);
      login(data);
      alert("Prihlásenie prebehlo úspešne");
      navigate("/admin");
    },
    onError: (error) => {
      alert(error.response.data.message);
    },
  });

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const form = e.target;
    const username = form.username.value.trim();
    const password = form.password.value.trim();

    const result = loginSchema.safeParse({
      username: username,
      password: password,
    });

    if (!result.success) {
      const errorMessages = result.error.errors.map((err) => err.message);
      alert(errorMessages.join("\n"));
      return;
    }

    loginUserMutation.mutate({ username, password });
  };

  return (
    <div className="flex justify-center bg-primary">
      <div className="flex flex-col items-center text-white">
        <img
          src="/src/assets/images/webBeaverFavIcon.png"
          alt="WebBeaver."
          className="h-auto w-20"
        />
        <h1 className="p-10 text-5xl">Prihlásiť sa</h1>
        <form onSubmit={handleFormSubmit}>
          <label htmlFor="email" className="block text-base/8 font-medium">
            Používateľské meno
          </label>
          <div className="mt-2 w-[400px]">
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={handleUsernameChange}
              className="mb-5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm/6"
            />
            <label htmlFor="email" className="block text-base/8 font-medium">
              Heslo
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              className="mb-5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm/6"
            />
          </div>

          <div className="flex justify-center">
            <button type="submit" className="submit-button">
              <h1>Potvrdiť</h1>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
