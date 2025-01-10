import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

import InputField from "/src/components/InputField";
import { sendContactForm } from "/src/api/contactApi";

import { MdClose } from "react-icons/md";

export default function Kontakt() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  const formSchema = z.object({
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

    message: z
      .string()
      .min(10, { message: "Správa musí mať aspoň 10 znakov!" })
      .max(500, { message: "Správa môže mať maximálne 500 znakov!" }),
  });

  const createFormMutation = useMutation({
    mutationFn: sendContactForm,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

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
      const validationErrors = result.error.errors.reduce(
        (acc, err) => ({ ...acc, [err.path[0]]: err.message }),
        {},
      );
      setErrors(validationErrors);
      return;
    }

    try {
      createFormMutation.mutate({
        firstName,
        lastName,
        email,
        phone,
        message,
      });

      setShowModal(true);
    } catch (error) {
      console.error("Error submitting contact form", error);
    }
  };

  const fields = [
    {
      name: "firstName",
      value: firstName,
      label: "Meno",
      error: errors.firstName,
      set: (e) => setFirstName(e.target.value),
    },
    {
      name: "lastName",
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
              className={`${errors.message ? "border-red-500" : ""}`}
              id="message"
              name="message"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Vaša správa"
            />
            <p className="mt-1 h-5 text-sm text-red-500">
              {errors.message || "\u00A0"}
            </p>
          </div>

          <div className="flex items-center justify-start">
            <button type="submit" className="contact-submit-button">
              Odoslať
            </button>
          </div>
        </form>
      </div>
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/30"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <div className="relative w-[400px] rounded-lg border-2 border-secondary bg-primary p-6">
            <button
              className="absolute right-2 top-2 text-white hover:text-secondary"
              onClick={() => setShowModal(false)}
            >
              <MdClose className="text-2xl" />
            </button>
            <h1 className="text-center text-2xl text-white">
              Správa bola úspešne odoslaná!
            </h1>
          </div>
        </div>
      )}
    </div>
  );
}
