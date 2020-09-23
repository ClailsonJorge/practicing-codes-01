import { RequiredFieldValidation } from '@/validation/validators';
import { ValidationBuilder as sut } from './validation-builder';
import { EmailValidation } from '../email/email-validation';
import { MinLengthValidation } from '../min-length/min-length-validation';
import faker from 'faker';

describe('ValidationBuilder', () => {
  test('Should return RequiredFieldValidation', () => {
    const field = faker.database.column();
    const valdiations = sut.field(field).required().build();
    expect(valdiations).toEqual([new RequiredFieldValidation(field)]);
  });

  test('Should return EmailValidation', () => {
    const field = faker.database.column();
    const valdiations = sut.field(field).email().build();
    expect(valdiations).toEqual([new EmailValidation(field)]);
  });

  test('Should return MinLengthValidation', () => {
    const field = faker.database.column();
    const length = faker.random.number();
    const valdiations = sut.field(field).min(length).build();
    expect(valdiations).toEqual([new MinLengthValidation(field, length)]);
  });

  test('Should return a list of validations', () => {
    const length = faker.random.number();
    const field = faker.database.column();
    const valdiations = sut.field(field).required().min(length).email().build();
    expect(valdiations).toEqual([
      new RequiredFieldValidation(field),
      new MinLengthValidation(field, length),
      new EmailValidation(field),
    ]);
  });
});