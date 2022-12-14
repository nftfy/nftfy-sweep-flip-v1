import { ChangeEventHandler, useState, Dispatch, SetStateAction } from 'react';

const REGEX = /^[+-]?\d*(?:[.]\d*)?$/;

interface InputProps {
  value: string | number;
  valid: boolean;
  reset: Function;
  onChange: ChangeEventHandler;
  setValue: Dispatch<SetStateAction<string | number>>;
}

const useHandleInputs = (): InputProps => {
  const [valid, setValid] = useState<boolean>(false);
  const [value, setValue] = useState<string | number>(0);

  const onChange = (e: any) => {
    e.preventDefault();
    let value = e.target.value.trim();
    if (REGEX.test(value)) {
      setValid(true);
      setValue(Number(value));

      return;
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
