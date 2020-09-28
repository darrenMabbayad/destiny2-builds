import React from "react";

function FormInput({ label, name, value, placeholder, handleChange }) {
  return (
    <div>
      <p>{label}</p>
      <input
        name={name}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={e => handleChange(e)}
      />
    </div>
  );
}

export default FormInput;
