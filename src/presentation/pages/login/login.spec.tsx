import React from 'react';
import {
  render,
  RenderResult,
  cleanup,
  fireEvent,
} from '@testing-library/react';
import Login from '@/presentation/pages/login/login';
import { ValidationStub } from '@/presentation/test';
import faker from 'faker';

type SutTypes = {
  sut: RenderResult;
  validationSpy: ValidationStub;
};

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationStub();
  const errorMessage = faker.random.words();
  validationSpy.erroMessage = errorMessage;
  const sut = render(<Login validation={validationSpy} />);
  return {
    sut,
    validationSpy,
  };
};

describe('Login Component', () => {
  afterEach(cleanup);
  test('Should not render spinner and error on start', () => {
    const { sut, validationSpy } = makeSut();
    const errorWrap = sut.getByTestId('error-wrap');
    expect(errorWrap.childElementCount).toBe(0);
    const submitButton = sut.getByTestId('submit') as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);
    const emailStatus = sut.getByTestId('email-status');
    expect(emailStatus.title).toBe(validationSpy.erroMessage);
    expect(emailStatus.textContent).toBe('🔴');
    const passwordStatus = sut.getByTestId('password-status');
    expect(passwordStatus.title).toBe(validationSpy.erroMessage);
    expect(passwordStatus.textContent).toBe('🔴');
  });

  test('Should show email error if validation fails', () => {
    const { sut, validationSpy } = makeSut();
    const emailInput = sut.getByTestId('email');
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } });
    const emailStatus = sut.getByTestId('email-status');
    expect(emailStatus.title).toBe(validationSpy.erroMessage);
    expect(emailStatus.textContent).toBe('🔴');
  });

  test('Should show password error if validation fails', () => {
    const { sut, validationSpy } = makeSut();
    const passwordInput = sut.getByTestId('password');
    fireEvent.input(passwordInput, {
      target: { value: faker.internet.password() },
    });
    const passwordStatus = sut.getByTestId('password-status');
    expect(passwordStatus.title).toBe(validationSpy.erroMessage);
    expect(passwordStatus.textContent).toBe('🔴');
  });
});
