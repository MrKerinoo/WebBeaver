import React, { useEffect, useState } from "react";
import FileUploader from "../../components/FileUploader";
import z from "zod";
import InputField from "../../components/InputField";
import { useAuth } from "../../hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../../api/userApi";
import { uploadPicture } from "../../api/fileApi";

export default function Profil() {
  const { user, setUser } = useAuth();

  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [iban, setIban] = useState(user.iban || "");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    iban: "",
  });

  const profileSchema = z.object({
    firstName: z
      .string()
      .min(3, { message: "Meno musí mať aspoň 3 znaky!" })
      .max(20, { message: "Meno môže mať maximálne 20 znakov!" }),

    lastName: z
      .string()
      .min(3, { message: "Priezvisko musí mať aspoň 3 znaky!" })
      .max(20, { message: "Priezvisko môže mať maximálne 20 znakov!" }),

    email: z.string().email({ message: "Emailová adresa musí byť platná!" }),

    phone: z.string().regex(/^\+?\d{10,12}$/, {
      message: "Telefónne číslo musí byť platné a obsahovať 10-12 číslic!",
    }),

    iban: z.string().regex(/^SK\d{2}\s?(\d{4}\s?){6}$/, {
      message: "IBAN musí byť v správnom formáte!",
    }),
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, ...userData }) => updateProfile(id, userData),
    onSuccess: (data) => {
      setUser(data.data.user[0]);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = profileSchema.safeParse({
      firstName,
      lastName,
      email,
      phone,
      iban,
    });

    if (!result.success) {
      const errorMessages = result.error.errors.reduce((acc, err) => {
        acc[err.path[0]] = err.message;
        return acc;
      }, {});
      setErrors(errorMessages);
      return;
    }

    try {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("user", JSON.stringify(user));

        // Upload the file
        await uploadPicture(formData);
      }

      updateUserMutation.mutate({
        id: user.accountId,
        firstName,
        lastName,
        email,
        phone,
        iban,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const fields = [
    {
      name: "meno",
      value: firstName,
      label: "Meno",
      error: errors.firstName,
      set: (e) => setFirstName(e.target.value),
    },
    {
      name: "prezvisko",
      value: lastName,
      label: "Priezvisko",
      error: errors.lastName,
      set: (e) => setLastName(e.target.value),
    },
    {
      name: "email",
      value: email,
      label: "Emailová adresa",
      error: errors.email,
      set: (e) => setEmail(e.target.value),
    },
    {
      name: "telefon",
      value: phone,
      label: "Telefónne číslo",
      placeHolder: "+421",
      error: errors.phone,
      set: (e) => setPhone(e.target.value),
    },
    {
      name: "iban",
      value: iban,
      label: "IBAN",
      placeHolder: "SKXX XXXX XXXX XXXX XXXX XXXX",
      error: errors.iban,
      set: (e) => setIban(e.target.value),
    },
  ];

  const fieldsItems = fields.map((field) => (
    <div key={field.name}>
      <label
        htmlFor={field.value}
        className="block text-base/8 font-medium text-white"
      >
        {field.label}
      </label>
      <InputField
        name={field.name}
        value={field.value}
        onChange={(e) => field.set(e)}
        placeHolder={field.placeHolder}
        error={!!field.error}
      />
      <p className="mt-1 h-5 text-sm text-red-500">{field.error || "\u00A0"}</p>
    </div>
  ));

  return (
    <div className="w-full pb-12">
      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center pt-5"
        >
          <div className="w-[90vw] border-t border-white" />
        </div>
        <div className="relative flex justify-center pt-5">
          <span className="bg-primary px-3 text-4xl text-white sm:text-5xl md:text-6xl">
            Profil
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center pt-10">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center justify-center">
            <div className="contact-form">{fieldsItems}</div>

            <div className="col-span-full min-w-[50vw] py-5">
              <label
                htmlFor="cover-photo"
                className="block text-sm/6 font-medium text-white"
              >
                Profilová fotka
              </label>
              <FileUploader setFile={setFile} types={true} />
            </div>
            <button type="submit" className="submit-button">
              Potvrdiť zmeny
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
