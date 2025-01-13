import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loginUser } from "../../api/authApi.js";
import { useAuth } from "../../hooks/useAuth.js";

import { HiEye } from "react-icons/hi";
import { HiEyeOff } from "react-icons/hi";

import { z } from "zod";

export default function Prihlasenie() {
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const loginSchema = z.object({
    username: z
      .string()
      .min(3, { message: "Meno musí mať aspoň 3 znaky!" })
      .max(20, { message: "Meno môže mať maximálne 20 znakov!" }),

    password: z
      .string()
      .min(6, { message: "Heslo musí mať aspoň 6 znakov!" })
      .max(20, { message: "Heslo môže mať maximálne 20 znakov!" }),
  });

  const navigate = useNavigate();

  const loginUserMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      login(data);
      navigate("/pouzivatelia");
    },
    onError: (error) => {
      if (error.response.data.type === "name") {
        setErrors({ username: error.response.data.message, password: "" });
      } else {
        setErrors({ username: "", password: error.response.data.message });
      }
    },
  });

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
      const validationErrors = result.error.errors.reduce(
        (acc, err) => ({ ...acc, [err.path[0]]: err.message }),
        {},
      );
      setErrors(validationErrors);
      return;
    }

    setErrors({ username: "", password: "" });

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
        <h1 className="p-10 text-5xl sm:text-6xl">Prihlásiť sa</h1>
        <form onSubmit={handleFormSubmit}>
          <label htmlFor="username" className="block text-base font-medium">
            Používateľské meno
          </label>
          <div className="mt-2">
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`block w-[70vw] rounded-md border-2 py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none sm:w-[50vw] sm:text-sm md:w-[40vw] lg:w-[30vw] ${
                errors.username
                  ? "border-red-500"
                  : "border-gray-300 focus:border-secondary"
              }`}
            />
            <p className="mt-2 h-5 text-xs text-red-500 lg:text-sm">
              {errors.username || "\u00A0"}
            </p>
          </div>
          <label
            htmlFor="password"
            className="mt-4 block text-base font-medium"
          >
            Heslo
          </label>
          <div className="relative mt-2">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`block w-[70vw] rounded-md border-2 py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none sm:w-[50vw] sm:text-sm md:w-[40vw] lg:w-[30vw] ${
                errors.password
                  ? "border-red-500"
                  : "border-gray-300 focus:border-secondary"
              }`}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 transform"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <HiEye className="text-black" />
              ) : (
                <HiEyeOff className="text-black" />
              )}
            </button>
          </div>
          <p className="mt-2 h-5 text-xs text-red-500 lg:text-sm">
            {errors.password || "\u00A0"}
          </p>
          <div className="my-6 flex justify-center">
            <button type="submit" className="submit-button">
              Prihlásiť sa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
