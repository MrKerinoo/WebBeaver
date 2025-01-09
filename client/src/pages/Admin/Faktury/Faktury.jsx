import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import FileUploader from "../../../components/FileUploader";
import { useAuth } from "../../../hooks/useAuth";
import {
  uploadInvoice,
  getInvoices,
  deleteInvoice,
  updateInvoice,
} from "../../../api/fileApi";
import { getUsers } from "../../../api/userApi";
import { MdClose } from "react-icons/md";

export default function Faktury() {
  //const { user } = useAuth();

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const accounts = usersQuery?.data?.data?.users || [];

  const [selectedUser, setSelectedUser] = useState(accounts[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedState, setSelectedState] = useState("NEZAPLATENÁ");
  const [file, setFile] = useState(null);

  useEffect(() => {
    console.log(selectedUser);
  }, [selectedUser]);

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modalOpen]);

  const queryClient = useQueryClient();

  const invoicesQuery = useQuery({
    queryKey: ["invoices"],
    queryFn: getInvoices,
  });

  const uploadInvoiceMutation = useMutation({
    mutationFn: ({ formData }) => uploadInvoice(formData),
    onSuccess: () => {
      queryClient.invalidateQueries("invoices");
    },
  });

  const updateInvoiceMutation = useMutation({
    mutationFn: ({ id, ...invoiceData }) => updateInvoice(id, invoiceData),
    onSuccess: () => {
      queryClient.invalidateQueries("invoices");
    },
    onError: (error) => {
      console.error("Error updating invoice:", error);
    },
  });

  const deleteInvoiceMutation = useMutation({
    mutationFn: deleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries("invoices");
    },
    onError: (error) => {
      console.error("Error deleting invoice:", error);
    },
  });

  const handleUpdateClick = (invoice) => {
    console.log("INVOICE", invoice);
    toggleModalChange(invoice);
  };

  const toggleModalChange = (invoice) => {
    setModalOpen(!modalOpen);

    if (invoice) {
      setSelectedInvoice(invoice);
      setSelectedState(invoice.state);
    }
  };

  const handleDeleteClick = (id) => {
    const confirmDelete = window.confirm("Naozaj chcete odstrániť faktúru?");
    console.log("DELETE", id, confirmDelete);
    if (confirmDelete) {
      deleteInvoiceMutation.mutate(id);
    }
  };

  const handleOptionChange = (e) => {
    setSelectedState(e.target.value);
  };

  const handleSelectedUserChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
        formData.append(
          "invoiceData",
          JSON.stringify({
            expirationDate: new Date(),
            account: selectedUser,
          }),
        );
      } else {
        console.error("No file selected");
        return;
      }

      uploadInvoiceMutation.mutate({
        formData,
      });
    } catch (error) {
      console.error("Error updating invoice:", error);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    try {
      updateInvoiceMutation.mutate({
        id: selectedInvoice.invoiceId,
        state: selectedState,
      });
    } catch (error) {
      console.error("Error updating invoice:", error);
    }

    toggleModalChange(null);
  };

  const invoices = invoicesQuery?.data?.data?.invoices || [];

  return (
    <div>
      <div className="flex justify-center">
        <form onSubmit={handleSubmit}>
          <div className="mt-2 grid grid-cols-1">
            <select
              id="options"
              value={selectedUser}
              onChange={handleSelectedUserChange}
              className="focus:outline-3 col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:-outline-offset-2 focus:outline-secondary sm:text-sm/6"
            >
              {accounts.map((account) => (
                <option key={account.accountId} value={account.accountId}>
                  {account.username}
                </option>
              ))}
            </select>
          </div>

          <div className="py-5">
            <h1 className="text-xl text-white">Vložiť faktúru</h1>
            <FileUploader setFile={setFile} types={false} />
          </div>
          <button type="submit" className="submit-button">
            Nahrať faktúru
          </button>
        </form>
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
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-8 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Stav
                    </th>

                    <th
                      scope="col"
                      className="py-3.5 pl-8 text-left text-sm font-semibold text-gray-900"
                    >
                      Faktúra
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
                  {invoices.map((invoice) => (
                    <tr key={invoice.invoiceId}>
                      <td className="whitespace-nowrap px-8 py-4 text-sm font-medium text-gray-900 sm:pl-6">
                        {invoice.accountId}
                      </td>
                      <td className="whitespace-nowrap px-8 py-4 text-sm text-gray-500">
                        {invoice.state}
                      </td>
                      <td className="whitespace-nowrap px-8 py-4 text-sm text-gray-500">
                        <a
                          href={`/${invoice.file.path}`}
                          download
                          className="text-secondary hover:underline"
                        >
                          {invoice.file.originalname}
                        </a>
                      </td>
                      <td className="relative whitespace-nowrap py-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          type="button"
                          //disabled={deleteUserMutation.isLoading}
                          className="block rounded-md bg-green-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-white hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                          onClick={() => handleUpdateClick(invoice)}
                        >
                          Upraviť
                        </button>
                      </td>
                      <td className="relative whitespace-nowrap py-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          type="button"
                          className="block rounded-md bg-red-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-white hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                          onClick={() => handleDeleteClick(invoice.invoiceId)}
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
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30">
          <div className="w-[400px] rounded-lg border-2 border-secondary bg-primary p-6">
            <div className="flex items-center justify-between pb-4">
              <h1 className="text-white">Upraviť stav faktúry</h1>

              <button onClick={() => toggleModalChange(null)}>
                <MdClose className="text-[30px] text-white hover:text-secondary" />
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="mt-2">
                <select
                  id="options"
                  value={selectedState}
                  onChange={handleOptionChange}
                  className="mb-5 mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-secondary sm:text-sm/6"
                >
                  <option value="ZAPLATENÁ">ZAPLATENÁ</option>
                  <option value="NEZAPLATENÁ">NEZAPLATENÁ</option>
                </select>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full rounded-md bg-secondary px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-secondary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Potvrdiť
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
