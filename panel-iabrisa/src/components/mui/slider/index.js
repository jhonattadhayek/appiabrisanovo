import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';

import { FormHelperText, Slider } from '@mui/material';

export default function FormInputSlider(props) {
  const { name, control, setValue, min = 0, max = 100, step = 1 } = props;

  const [sliderValue, setSliderValue] = useState(null);

  useEffect(() => {
    if (sliderValue) setValue(name, sliderValue);
  }, [name, setValue, sliderValue]);

  const handleChange = (_event, newValue) => {
    setSliderValue(newValue);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ fieldState, field: { value } }) => (
        <>
          <Slider
            value={value}
            defaultValue={value}
            onChange={handleChange}
            valueLabelDisplay="auto"
            min={min}
            max={max}
            step={step}
            color={fieldState.error ? 'error' : 'primary'}
          />

          <FormHelperText error={!!fieldState.error}>
            {fieldState?.error?.message}
          </FormHelperText>
        </>
      )}
    />
  );
}
