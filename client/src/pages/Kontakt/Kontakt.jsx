import React, { useState } from "react";
import { z } from "zod";

import InputField from "/src/components/InputField";

export default function Kontakt() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const formSchema = z.object({
    name: z
      .string()
      .min(3, { message: "Meno musí mať aspoň 3 znaky" })
      .max(20, { message: "Meno môže mať maximálne 20 znakov" }),

    email: z.string().email(),

    phone: z.string().regex(/^\+?\d{10,12}$/, {
      message: "Telefónne číslo musí byť platné a obsahovať 10-12 číslic.",
    }),

    message: z
      .string()
      .min(10, { message: "Správa musí mať aspoň 10 znakov." })
      .max(500, { message: "Správa môže mať maximálne 500 znakov." }),
  });

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const result = formSchema.safeParse({
      name: name,
      email: email,
      phone: phone,
      message: message,
    });

    if (!result.success) {
      const errorMessages = result.error.errors.map((err) => err.message);
      alert(errorMessages.join("\n"));
      return;
    } else {
      alert("Správa bola úspešne odoslaná!");
    }
  };

  const fields = [
    {
      name: "meno",
      value: name,
      placeHolder: "Meno",
      set: (e) => setName(e.target.value),
    },
    {
      name: "email",
      value: email,
      placeHolder: "Emailová adresa",
      set: (e) => setEmail(e.target.value),
    },
    {
      name: "telefon",
      value: phone,
      placeHolder: "Telefónne číslo",
      set: (e) => setPhone(e.target.value),
    },
  ];

  const fieldsItems = fields.map((field) => (
    <div key={field.name}>
      <InputField
        name={field.name}
        value={field.value}
        onChange={(e) => field.set(e)}
        placeHolder={field.placeHolder}
      />
    </div>
  ));

  return (
    <div>
      <div className="main-container">
        <h1>Kontakt</h1>
        <p>Kontaktujte nás pre váš budúci projekt.</p>
      </div>

      <div className="contact-container">
        <h1>Napíšte nám</h1>

        <form onSubmit={handleSubmit}>
          <div className="contact-form">{fieldsItems}</div>

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

          <div>
            <button type="submit" className="submit-button">
              Odoslať
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
