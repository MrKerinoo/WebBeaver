import React, { useState } from "react";

import InputField from "/src/components/InputField";

export default function Kontakt() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  
  const handleChange = (e) => {
    const { message } = e.target;
    setMessage(message);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(name);
  };

  const fields = [
    { name: "meno", value: name, placeHolder: "Meno", set: (e) => setName(e.target.value) },
    { name: "email", value: email, placeHolder: "Emailová adresa", set: (e) => setEmail(e.target.value) },
    { name: "telefon", value: phone, placeHolder: "Telefónne číslo", set: (e) => setPhone(e.target.value) },
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
