import React, { useState } from "react";
import { Input, InputProps } from "@chakra-ui/react";

export function PhoneInput({ onChange, value, ...props }: Props) {
  const [internalValue, setInternalValue] = useState(formatPhoneNumber(value));

  function handleBlur(evt: React.FocusEvent<HTMLInputElement>) {
    const formatted = formatPhoneNumber(value);
    const valid = /^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/m.test(formatted);

    if (valid) {
      setInternalValue(formatted);
    } else {
      evt.currentTarget.setCustomValidity(
        "Please enter a 10 digit phone number including area code."
      );
      evt.currentTarget.reportValidity();
    }
  }

  function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
    evt.currentTarget.setCustomValidity("");

    const { value: changeValue } = evt.currentTarget;
    setInternalValue(changeValue);

    if (onChange) {
      // Strip to just digits and fire onChange.
      const output = reduceToDigits(changeValue);
      value !== output && onChange(output);
    }
  }

  return (
    <Input
      {...props}
      onBlur={handleBlur}
      onChange={handleChange}
      type="tel"
      value={internalValue}
    />
  );
}

export interface Props
  extends Omit<
    InputProps,
    "onBlur" | "onInput" | "onChange" | "type" | "value"
  > {
  onChange: (value: string) => void;
  value: string;
}

function formatPhoneNumber(value: string) {
  const reduced = reduceToDigits(value);

  const valid = reduced.length === 10;
  if (!valid) {
    return value;
  }

  const area = reduced.substring(0, 3);
  const exchange = reduced.substring(3, 6);
  const num = reduced.substring(6);
  return `(${area}) ${exchange}-${num}`;
}

function reduceToDigits(value: string) {
  let output = "";
  for (let i = 0; i < value.length; i++) {
    if (47 < value.charCodeAt(i) && value.charCodeAt(i) < 58) {
      output += value[i];
    }
  }

  return output;
}
