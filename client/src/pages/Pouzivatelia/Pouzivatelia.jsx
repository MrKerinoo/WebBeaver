import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../api/userApi.js";
import { set, z } from "zod";

import { MdClose } from "react-icons/md";

export default function Pouzivatelia() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [modalCreate, setModalCreate] = useState(false);
  const [selectedOption, setSelectedOption] = useState("USER");
  const [selectedUser, setSelectedUser] = useState(null);

  const queryClient = useQueryClient();

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
    mutationFn: ({id, ...userData}) => updateUser(id, userData),
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
      "Naozaj chcete odstrániť tohto používateľa?"
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
      console.log("UPDATE");
    } else {
      createUserMutation.mutate({
        username: result.data.username,
        password: result.data.password,
        role: result.data.role,
      });
      console.log("CREATE");
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
      <div className="px-4 pt-10 pb-20 sm:px-6 lg:px-8 bg-primary">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold text-white">Používatelia</h1>
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
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
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
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Heslo
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Doména
                      </th>
                      <th
                        scope="col"
                        className="pl-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Rola
                      </th>
                      <th
                        scope="col"
                        className="pl-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Upaviť
                      </th>

                      <th
                        scope="col"
                        className="pl-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Odstrániť
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {accounts.map((account) => (
                      <tr key={account.accountId}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {account.username}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {account.password}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {"DOMENA"}
                        </td>
                        <td className="whitespace-nowrap pl-3 py-4 text-sm text-gray-500">
                          {account.role}
                        </td>
                        <td className="relative whitespace-nowrap py-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            type="button"
                            disabled={deleteUserMutation.isLoading}
                            className="block rounded-md bg-green-600 px-3 py-2 text-center text-sm font-semibold
                           text-white shadow-sm hover:bg-white hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                            onClick={() => handleUpdateClick(account)}
                          >
                            Upraviť
                          </button>
                        </td>
                        <td className="relative whitespace-nowrap py-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            type="button"
                            className="block rounded-md bg-red-600 px-3 py-2 text-center text-sm font-semibold
                           text-white shadow-sm hover:bg-white hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
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
        <div className="fixed inset-0 flex justify-center items-center bg-black/30">
          <div className="bg-primary border-2 border-secondary rounded-lg p-6 w-[400px]">
            <div className="flex justify-between items-center pb-4">
              <h1 className="text-white">
                {selectedUser ? "Upraviť používateľa" : "Pridať používateľa"}
              </h1>

              <button onClick={() => toggleModalCreate(null)}>
                <MdClose className="text-white text-[30px] hover:text-secondary" />
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
                  className="block w-full rounded-md border-0 py-1.5 mb-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm/6"
                />

                <input
                  id="password"
                  name="password"
                  type="text"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Heslo"
                  className="block w-full rounded-md border-0 py-1.5 mb-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm/6"
                />

                <select
                  id="options"
                  value={selectedOption}
                  onChange={handleOptionChange}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 mb-5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-secondary sm:text-sm/6"
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="USER">USER</option>
                </select>
              </div>

              <div className="flex justify-center ">
                <button
                  type="submit"
                  className="rounded-md bg-secondary w-full px-3 py-2 text-center text-sm font-semibold text-white shadow-sm  hover:bg-secondary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
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
