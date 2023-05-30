import { ValidateIf, ValidatorOptions } from 'class-validator';

export const IsNullable = (validationOptions?: ValidatorOptions) => {
  return ValidateIf((_object, value) => value !== null, validationOptions);
};
