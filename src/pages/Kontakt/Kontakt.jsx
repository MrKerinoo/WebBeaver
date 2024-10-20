import React, { useState } from "react";

import InputField from "/src/components/InputField";

export default function Kontakt() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, email, phone, message } = event.target.value;
    setName(name);
    setEmail(email);
    setPhone(phone);
    setMessage(message);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(name);
  };

  const fields = [
    { name: "meno", value: name, placeHolder: "Meno" },
    { name: "email", value: email, placeHolder: "Emailová adresa" },
    { name: "telefon", value: phone, placeHolder: "Telefónne číslo" },
  ];

  const fieldsItems = fields.map((field) => (
    <div key={field.name}>
      <InputField
        name={field.name}
        value={field.value}
        onChange={handleChange}
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
              name="message"
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
