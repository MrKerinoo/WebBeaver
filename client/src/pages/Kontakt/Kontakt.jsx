import React, { useState } from "react";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

import InputField from "/src/components/InputField";
import { sendContactForm } from "/src/api/contactApi";

export default function Kontakt() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const formSchema = z.object({
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

    message: z
      .string()
      .min(10, { message: "Správa musí mať aspoň 10 znakov." })
      .max(500, { message: "Správa môže mať maximálne 500 znakov." }),
  });

  const createFormMutation = useMutation({
    mutationFn: sendContactForm,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = formSchema.safeParse({
      firstName,
      lastName,
      email,
      phone,
      message,
    });

    if (!result.success) {
      const errorMessages = result.error.errors.map((err) => err.message);
      alert(errorMessages.join("\n"));
      return;
    } else {
      //UPOZORNIT O SPRAVE
      alert("Správa bola úspešne odoslaná!");
    }

    try {
      createFormMutation.mutate({
        firstName,
        lastName,
        email,
        phone,
        message,
      });
    } catch (error) {
      console.error("Error submitting contact form", error);
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
      />
    </div>
  ));

  return (
    <div className="w-full">
      <div className="main-container">
        <h1>Kontakt</h1>
        <p>Kontaktujte nás pre váš budúci projekt.</p>
      </div>

      <div className="contact-container">
        <h1>Napíšte nám</h1>

        <form onSubmit={handleSubmit}>
          <div className="contact-form">{fieldsItems}</div>
          <label
            htmlFor="textarea"
            className="block text-base/8 font-medium text-white"
          >
            Vaša správa
          </label>
          <div className="contact-textarea">
            <textarea
              className="input-textarea"
              id="message"
              name="message"
              type="text"
              value={message}
              onChange={handleChange}
              placeholder="Vaša správa"
            />
          </div>

          <div className="flex justify-center">
            <button type="submit" className="submit-button">
              Odoslať
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
