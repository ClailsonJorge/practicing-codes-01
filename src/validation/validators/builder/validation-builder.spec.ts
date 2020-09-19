import { RequiredFieldValidation } from '@/validation/validators';
import { ValidationBuilder as sut } from './validation-builder';
import { EmailValidation } from '../email/email-validation';
import { MinLengthValidation } from '../min-length/min-length-validation';

describe('ValidationBuilder', () => {
  test('Should return RequiredFieldValidation', () => {
    const valdiations = sut.field('any_field').required().build();
    expect(valdiations).toEqual([new RequiredFieldValidation('any_field')]);
  });

  test('Should return EmailValidation', () => {
    const valdiations = sut.field('any_field').email().build();
    expect(valdiations).toEqual([new EmailValidation('any_field')]);
  });

  test('Should return MinLengthValidation', () => {
    const valdiations = sut.field('any_field').min(5).build();
    expect(valdiations).toEqual([new MinLengthValidation('any_field', 5)]);
  });
});
