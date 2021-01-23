import { InvalidFieldError } from '../erros'
import { FieldValidation } from '../protocols/field-validation'

export class MinLengthValidation implements FieldValidation {
  constructor (public readonly field: string, private readonly minLength: number) {}

  validate (value: string): Error {
    return value.length >= this.minLength ? null : new InvalidFieldError()
  }
}
