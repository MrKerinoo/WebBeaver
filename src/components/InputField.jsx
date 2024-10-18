
export default function InputField({ name, value, onChange, placeHolder }) {
  return (
    <div>
      <input className="input-field"
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeHolder}
      />
    </div>
  );
}