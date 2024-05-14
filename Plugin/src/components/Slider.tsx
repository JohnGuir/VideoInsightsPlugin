import React, { useState } from "react";

function Slider({ min, max, value, onChange }) {
  const handleChange = (event) => {
    onChange(parseInt(event.target.value));
  };

  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={handleChange}
    />
  );
}

export default Slider;
