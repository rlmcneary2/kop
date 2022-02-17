import React, { useRef } from "react";
import { Input, InputProps } from "@chakra-ui/react";

export function NumberInput({
  allowedNumber,
  onBlur,
  onChange,
  value,
  ...props
}: Props) {
  const keyDownValue = useRef("");
  function handleOnBlur(evt: React.FocusEvent<HTMLInputElement>) {
    onBlur && onBlur(evt);
  }

  function handleOnChange(evt: React.ChangeEvent<HTMLInputElement>) {
    // console.log(
    //   `NumberInput handleOnChange: value='${value}', event value='${evt.currentTarget.value}'`
    // );
    // const inputValue = trimString(evt.currentTarget.value);

    // let externalValue: number | "" = "";
    // let internalValue = "";
    // let valid = false;
    // if (!inputValue) {
    //   valid = true;
    // } else {
    //   ({ externalValue, internalValue, valid } = allowedNumber(inputValue));
    // }

    // valid && onChange(internalValue, externalValue);
    console.log(
      `NumberInput handleOnChange: value='${value}', event value='${evt.currentTarget.value}'`
    );
    onChange && onChange(evt);
  }

  function handleOnInput(evt: React.FormEvent<HTMLInputElement>) {
    console.log(
      `NumberInput handleOnInput: value='${value}', event value='${evt.currentTarget.value}'`
    );
  }

  function handleOnKeyDown(evt: React.KeyboardEvent<HTMLInputElement>) {
    console.log(
      `NumberInput handleOnKeyDown: value='${value}', event value='${evt.currentTarget.value}', key='${evt.key}'`
    );
  }

  return (
    <Input
      {...props}
      onBlur={handleOnBlur}
      onChange={handleOnChange}
      onInput={handleOnInput}
      onKeyDown={handleOnKeyDown}
      value={value}
      type="number"
    />
  );
}

// export interface Props extends Omit<InputProps, "onChange" | "value"> {
//   allowedNumber: (value: string) => {
//     externalValue: number | "";
//     internalValue: string;
//     valid: boolean;
//   };
//   onChange: (internalValue: string, externalValue: number | "") => void;
//   value: string;
// }
export interface Props extends Omit<InputProps, "value"> {
  allowedNumber: (value: string) => {
    externalValue: number | "";
    internalValue: string;
    valid: boolean;
  };
  value: string;
}

function trimString(value: string): string {
  let copy = value;
  while (copy.startsWith(" ")) {
    copy = copy.substring(1);
  }

  while (copy.endsWith(" ")) {
    copy = copy.substring(0, copy.length - 1);
  }

  copy.replace(",", ".");
  const parts = copy.split(".");

  // eslint-disable-next-line prefer-const
  let [left, ...right] = parts;
  while (left.startsWith("0") && 1 < left.length) {
    left = left.substring(1);
  }

  copy = `${left}${right.length ? `.${right.join("")}` : ""}`;

  if (1 < copy.length && copy.endsWith("-")) {
    copy = copy.substring(0, copy.length - 1);
  }

  console.log(`trimString: copy='${copy}'`);

  return copy;
}
