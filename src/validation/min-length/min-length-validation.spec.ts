import { InvalidFieldError } from '../erros'
import { FieldValidation } from '../protocols/field-validation'

class MinLengthValidation implements FieldValidation {
  constructor (public readonly field: string, private readonly minLength: number) {}

  validate (value: string): Error {
    return value.length >= this.minLength ? null : new InvalidFieldError()
  }
}

describe('MinLengthValidation', () => {
  test('Should return error if value is invalid', () => {
    const sut = new MinLengthValidation('field', 5)
    const error = sut.validate('123')
    expect(error).toEqual(new InvalidFieldError())
  })

  test('Should return falsy if value is valid', () => {
    const sut = new MinLengthValidation('field', 5)
    const error = sut.validate('12345')
    expect(error).toBeFalsy()
  })
})
