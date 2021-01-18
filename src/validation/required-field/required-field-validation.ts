import { RequiredFieldError } from '../erros'
import { FieldValidation } from '../protocols/field-validation'

export class RequiredFieldValidation implements FieldValidation {
  constructor (readonly field: string) {}

  valdiate (value: string): Error {
    return value ? null : new RequiredFieldError()
  }
}
