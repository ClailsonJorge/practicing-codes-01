import { RequiredFieldValidation } from '@/validation/validators';
import { ValidationBuilder as sut } from './validation-builder';
import { EmailValidation } from '../email/email-validation';

describe('ValidationBuilder', () => {
  test('Should return RequiredFieldValidation', () => {
    const valdiations = sut.field('any_field').required().build();
    expect(valdiations).toEqual([new RequiredFieldValidation('any_field')]);
  });

  test('Should return EmailValidation', () => {
    const valdiations = sut.field('any_field').email().build();
    expect(valdiations).toEqual([new EmailValidation('any_field')]);
  });
});
