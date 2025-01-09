import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../../api/userApi.js";
import { useAuth } from "../../../hooks/useAuth.js";
import { z } from "zod";

import { MdClose } from "react-icons/md";

export default function Pouzivatelia() {
  //const { loggedIn, user } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [modalCreate, setModalCreate] = useState(false);
  const [selectedOption, setSelectedOption] = useState("USER");
  const [selectedUser, setSelectedUser] = useState(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (modalCreate) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modalCreate]);

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, ...userData }) => updateUser(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  const toggleModalCreate = (user) => {
    setModalCreate(!modalCreate);

    if (user) {
      setSelectedUser(user);
      setUsername(user.username);
      setPassword(user.password);
      setSelectedOption(user.role);
    } else {
      setSelectedUser(null);
      setUsername("");
      setPassword("");
      setSelectedOption("USER");
    }
  };
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };
  const handleUpdateClick = (user) => {
    toggleModalCreate(user);
  };
  const handleDeleteClick = (id) => {
    const confirmDelete = window.confirm(
      "Naozaj chcete odstrániť tohto používateľa?",
    );
    if (confirmDelete) {
      deleteUserMutation.mutate(id);
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const userSchema = z.object({
    username: z
      .string()
      .min(3, { message: "Meno musí mať aspoň 3 znaky" })
      .max(20, { message: "Meno môže mať maximálne 20 znakov" }),

    password: z
      .string()
      .min(6, { message: "Heslo musí mať aspoň 6 znakov" })
      .max(20, { message: "Heslo musí mať maximálne 20 znakov" }),

    role: z.enum(["USER", "ADMIN"], {
      errorMap: () => ({ message: "Rola je povinná" }),
    }),
  });

  // ZOBRAZOVAT ERRORY HNED POCAS PISANIA, NIE PO POTVRDENI
  const handleFormSubmit = (e) => {
    e.preventDefault();

    const form = e.target;
    const username = form.username.value.trim();
    const password = form.password.value.trim();

    const result = userSchema.safeParse({
      username: username,
      password: password,
      role: selectedOption,
    });

    if (!result.success) {
      const errorMessages = result.error.errors.map((err) => err.message);
      alert(errorMessages.join("\n"));
      return;
    }

    if (selectedUser) {
      updateUserMutation.mutate({
        id: selectedUser.accountId,
        username: result.data.username,
        password: result.data.password,
        role: result.data.role,
      });
    } else {
      createUserMutation.mutate({
        username: result.data.username,
        password: result.data.password,
        role: result.data.role,
      });
    }

    toggleModalCreate(null);
  };

  /*
  const userQuery = (id) => useQuery({
    queryKey: ["users", id],
    queryFn: () => getUserById(id),
  });
  */

  const accounts = usersQuery?.data?.data?.users || [];

  return (
    <div>
      <div className="relative">
        <div aria-hidden="true" className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white" />
        </div>
        <div className="relative flex justify-center">
          <h1 className="bg-primary px-3 text-6xl font-normal text-white">
            POUŽÍVATELIA
          </h1>
        </div>
      </div>
      <div className="bg-primary px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <div className="px-10 sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold text-white">
              Tabuľka používateľov
            </h1>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              className="block rounded-md bg-secondary px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-white hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              onClick={() => toggleModalCreate(null)}
            >
              + Pridať
            </button>
          </div>
        </div>

        <div className="mt-8 flow-root">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Meno
                      </th>
                      <th
                        scope="col"
                        className="px-8 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Heslo
                      </th>

                      <th
                        scope="col"
                        className="py-3.5 pl-8 text-left text-sm font-semibold text-gray-900"
                      >
                        Rola
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 text-left text-sm font-semibold text-gray-900"
                      >
                        Upaviť
                      </th>

                      <th
                        scope="col"
                        className="py-3.5 pl-4 text-left text-sm font-semibold text-gray-900"
                      >
                        Odstrániť
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {accounts.map((account) => (
                      <tr key={account.accountId}>
                        <td className="whitespace-nowrap px-8 py-4 text-sm font-medium text-gray-900 sm:pl-6">
                          {account.username}
                        </td>
                        <td className="whitespace-nowrap px-8 py-4 text-sm text-gray-500">
                          {account.password}
                        </td>
                        <td className="whitespace-nowrap px-8 py-4 text-sm text-gray-500">
                          {account.role}
                        </td>
                        <td className="relative whitespace-nowrap py-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            type="button"
                            disabled={deleteUserMutation.isLoading}
                            className="block rounded-md bg-green-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-white hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                            onClick={() => handleUpdateClick(account)}
                          >
                            Upraviť
                          </button>
                        </td>
                        <td className="relative whitespace-nowrap py-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            type="button"
                            className="block rounded-md bg-red-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-white hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                            onClick={() => handleDeleteClick(account.accountId)}
                          >
                            Odstrániť
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalCreate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30">
          <div className="w-[400px] rounded-lg border-2 border-secondary bg-primary p-6">
            <div className="flex items-center justify-between pb-4">
              <h1 className="text-white">
                {selectedUser ? "Upraviť používateľa" : "Pridať používateľa"}
              </h1>

              <button onClick={() => toggleModalCreate(null)}>
                <MdClose className="text-[30px] text-white hover:text-secondary" />
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="Meno"
                  className="mb-5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm/6"
                />

                <input
                  id="password"
                  name="password"
                  type="text"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Heslo"
                  className="mb-5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm/6"
                />

                <select
                  id="options"
                  value={selectedOption}
                  onChange={handleOptionChange}
                  className="mb-5 mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-secondary sm:text-sm/6"
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="USER">USER</option>
                </select>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full rounded-md bg-secondary px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-secondary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {selectedUser ? "Upraviť" : "Pridať"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
