import React, { useState } from "react";
import { Input, InputProps } from "@chakra-ui/react";
import { NumberInput, Props as NumberInputProps } from "./number-input";

export function FloatInput({ onBlur, onChange, value, ...props }: Props) {
  const [internalValue, setInternalValue] = useState<string>(`${value}`);
  function handleOnBlur(evt: React.FocusEvent<HTMLInputElement>) {
    onBlur && onBlur(evt);
  }

  // function handleOnInput(evt: React.FormEvent<HTMLInputElement>) {
  //   const inputValue = trimString(evt.currentTarget.value);

  //   let nextStrValue = "";
  //   let onInputValue: number | "" = "";
  //   if (!inputValue) {
  //     setStrValue("");
  //   } else {
  //     if (
  //       inputValue.startsWith(".") ||
  //       inputValue.endsWith(".") ||
  //       inputValue === "-" ||
  //       inputValue.startsWith("-")
  //     ) {
  //       if (convertsToFloat(inputValue)) {
  //         nextStrValue = inputValue;
  //         onInputValue = parseFloat(inputValue);
  //       }
  //     } else if (!nextStrValue) {
  //       if (convertsToFloat(inputValue)) {
  //         nextStrValue = inputValue;
  //         onInputValue = parseFloat(inputValue);
  //       }
  //     }

  //     setStrValue(inputValue);
  //   }

  //   onChange && onChange(onInputValue);
  // }

  // function handleOnChange(internalValue: string, externalValue: number | "") {
  //   setInternalValue(internalValue);
  //   onChange && onChange(externalValue);
  // }
  function handleOnChange(internalValue: string, externalValue: number | "") {
    setInternalValue(internalValue);
    onChange && onChange(externalValue);
  }

  function allowedNumber(
    inputValue: string
  ): ReturnType<NumberInputProps["allowedNumber"]> {
    let internalValue = "";
    let externalValue: number | "" | null = null;
    if (
      inputValue.startsWith(".") ||
      inputValue.endsWith(".") ||
      inputValue === "-" ||
      inputValue.startsWith("-")
    ) {
      if (convertsToFloat(inputValue)) {
        internalValue = inputValue;
        externalValue = parseFloat(inputValue);
      }
    }

    if (!internalValue) {
      if (convertsToFloat(inputValue)) {
        internalValue = inputValue;
        externalValue = parseFloat(inputValue);
      }
    }

    return {
      externalValue: externalValue ?? "",
      internalValue,
      valid: externalValue !== null
    };
  }

  return (
    <NumberInput
      {...props}
      allowedNumber={allowedNumber}
      onBlur={handleOnBlur}
      // onChange={handleOnChange}
      value={internalValue}
      type="number"
    />
  );
}

interface Props extends Omit<InputProps, "onChange" | "value"> {
  onChange: (value: number | "") => void;
  value: number | "";
}

function convertsToFloat(value: string): boolean {
  try {
    parseFloat(value);
  } catch (err) {
    console.log(`convertsToNumber: '${value}' does not convert to a number.`);
    return false;
  }

  return true;
}

// function trimString(value: string): string {
//   let copy = value;
//   while (copy.startsWith(" ")) {
//     copy = copy.substring(1);
//   }

//   while (copy.endsWith(" ")) {
//     copy = copy.substring(0, copy.length - 1);
//   }

//   return copy;
// }
