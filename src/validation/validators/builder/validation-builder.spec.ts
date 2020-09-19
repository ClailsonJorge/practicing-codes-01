import { RequiredFieldValidation } from '@/validation/validators';
import { ValidationBuilder as sut } from './validation-builder';

describe('ValidationBuilder', () => {
  test('Should return RequiredFieldValidation', () => {
    const valdiations = sut.field('any_field').required().build();
    expect(valdiations).toEqual([new RequiredFieldValidation('any_field')]);
  });
});
