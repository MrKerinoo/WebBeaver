import React, { useEffect, useState } from "react";
import FileUploader from "../../components/FileUploader";
import z from "zod";
import InputField from "../../components/InputField";
import { useAuth } from "../../hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../../api/userApi";

export default function Profil() {
  const { user, setUser } = useAuth();

  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [iban, setIban] = useState(user.iban || "");

  const profileSchema = z.object({
    firstName: z
      .string()
      .min(3, { message: "Meno musí mať aspoň 3 znaky" })
      .max(20, { message: "Meno môže mať maximálne 20 znakov" }),

    lastName: z
      .string()
      .min(3, { message: "Priezvisko musí mať aspoň 3 znaky" })
      .max(20, { message: "Priezvisko môže mať maximálne 20 znakov" }),

    email: z.string().email({ message: "Emailová adresa musí byť platná." }),

    phone: z.string().regex(/^\+?\d{10,12}$/, {
      message: "Telefónne číslo musí byť platné a obsahovať 10-12 číslic.",
    }),
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, ...userData }) => updateProfile(id, userData),
    onSuccess: (data) => {
      setUser(data.data.user[0]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = profileSchema.safeParse({
      firstName,
      lastName,
      email,
      phone,
    });

    if (!result.success) {
      const errorMessages = result.error.errors.map((err) => err.message);
      alert(errorMessages.join("\n"));
      return;
    } else {
    }

    try {
      updateUserMutation.mutate({
        id: user.accountId,
        firstName,
        lastName,
        email,
        phone,
        iban,
      });
    } catch {
      throw error;
    }
    {
    }
  };

  const fields = [
    {
      name: "meno",
      value: firstName,
      label: "Meno",
      set: (e) => setFirstName(e.target.value),
    },
    {
      name: "prezvisko",
      value: lastName,
      label: "Priezvisko",
      set: (e) => setLastName(e.target.value),
    },
    {
      name: "email",
      value: email,
      label: "Emailová adresa",
      set: (e) => setEmail(e.target.value),
    },
    {
      name: "telefon",
      value: phone,
      label: "Telefónne číslo",
      placeHolder: "+421",
      set: (e) => setPhone(e.target.value),
    },
    {
      name: "iban",
      value: iban,
      label: "IBAN",
      placeHolder: "SKXX XXXX XXXX XXXX XXXX XXXX",
      set: (e) => setIban(e.target.value),
    },
  ];

  const fieldsItems = fields.map((field) => (
    <div key={field.name}>
      <label
        htmlFor="email"
        className="block text-base/8 font-medium text-white"
      >
        {field.label}
      </label>
      <InputField
        name={field.name}
        value={field.value}
        onChange={(e) => field.set(e)}
        placeHolder={field.placeHolder}
      />
    </div>
  ));

  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center">
        <h1>Profil</h1>
        <form onSubmit={handleSubmit}>
          <div className="contact-form">{fieldsItems}</div>

          <div className="col-span-full min-w-[45rem] py-5">
            <label
              htmlFor="cover-photo"
              className="block text-sm/6 font-medium text-white"
            >
              Profilová fotka
            </label>
            <FileUploader />
          </div>

          <button type="submit" className="submit-button">
            Potvrdiť zmeny
          </button>
        </form>
      </div>
    </div>
  );
}
