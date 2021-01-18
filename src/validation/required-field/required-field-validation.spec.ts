import faker from 'faker'
import { RequiredFieldError } from '../erros'
import { RequiredFieldValidation } from './required-field-validation'

const makeSut = (): RequiredFieldValidation => new RequiredFieldValidation(faker.database.column())

describe('RequiredFieldValidation', () => {
  test('Should return error if field is empty', () => {
    const sut = makeSut()
    const error = sut.valdiate('')
    expect(error).toEqual(new RequiredFieldError())
  })
})