import React, { useState, Dispatch, SetStateAction } from 'react';

const REGEX = /^[+-]?\d*(?:[.]\d*)?$/;

interface InputProps {
  value: string | number | undefined;
  valid: boolean;
  reset: () => void;
  onChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<SetStateAction<string | number | undefined>>;
}

const useHandleInputs = (): InputProps => {
  const [valid, setValid] = useState<boolean>(false);
  const [value, setValue] = useState<string | number | undefined>(undefined);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const currentValue = e.target.value.trim()

    if (REGEX.test(currentValue)) {
      setValid(true);
      setValue(Number(currentValue))
    }
  };

  const reset = () => {
    setValid(false);
    setValue('');
  };

  return {
    value,
    valid,
    reset,
    onChange,
    setValue,
  };
};

export default useHandleInputs;
