import React from 'react'
import faker from 'faker'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import 'jest-localstorage-mock'
import { render, RenderResult, fireEvent, cleanup, waitFor } from '@testing-library/react'
import Login from './login'
import { ValidationStub, AuthenticationSpy } from '@/presentation/test'
import { InvalidCredentialsError } from '@/domain/erros'

type SutTypes = {
  sut: RenderResult
  authenticationSpy: AuthenticationSpy
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  validationStub.errorMessage = params?.validationError
  const sut = render(
    <Router history={history}>
      <Login validation={validationStub} authentication={authenticationSpy}/>
    </Router>
  )
  return {
    sut,
    authenticationSpy
  }
}

const simulateFillEmail = (sut: RenderResult, email = faker.internet.email()): void => {
  const emailInput = sut.getByTestId('email')
  fireEvent.input(emailInput, { target: { value: email } })
}

const simulateFillPassword = (sut: RenderResult, password = faker.internet.password()): void => {
  const passwordInput = sut.getByTestId('password')
  fireEvent.input(passwordInput, { target: { value: password } })
}

const simulateValidationStatus = (sut: RenderResult, fieldName: string, validationError?: string): void => {
  const fieldStatus = sut.getByTestId(`${fieldName}-status`)
  expect(fieldStatus.title).toBe(validationError || 'Tudo Certo!')
  expect(fieldStatus.textContent).toBe(validationError ? '🔴' : '🟢')
}

const simulateFillValidForm = (sut: RenderResult, email = faker.internet.email(), password = faker.internet.password()): void => {
  simulateFillEmail(sut, email)
  simulateFillPassword(sut, password)
  const submitButton = sut.getByTestId('submit')
  fireEvent.click(submitButton)
}

const history = createMemoryHistory({ initialEntries: ['/login'] })

describe('Login Component', () => {
  afterEach(cleanup)
  beforeEach(() => {
    localStorage.clear()
  })

  test('Should start with initial state', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError: validationError })
    const errorWrap = sut.getByTestId('error-wrap')
    expect(errorWrap.childElementCount).toBe(0)
    const submitButton = sut.getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBe(true)
    simulateValidationStatus(sut, 'email', validationError)
    simulateValidationStatus(sut, 'password', validationError)
  })

  test('Should show email error if validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError: validationError })
    simulateFillEmail(sut)
    simulateValidationStatus(sut, 'email', validationError)
  })

  test('Should show password error if validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError: validationError })
    simulateFillPassword(sut)
    simulateValidationStatus(sut, 'password', validationError)
  })

  test('Should show valid email state if validation sucessed', () => {
    const { sut } = makeSut()
    simulateFillEmail(sut)
    simulateValidationStatus(sut, 'email')
  })

  test('Should show valid password state if validation sucessed', () => {
    const { sut } = makeSut()
    simulateFillPassword(sut)
    simulateValidationStatus(sut, 'password')
  })

  test('Should enable submit button if form is valid', () => {
    const { sut } = makeSut()
    simulateFillEmail(sut)
    simulateFillPassword(sut)
    const submitButton = sut.getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBe(false)
  })

  test('Should show spinner on submit', () => {
    const { sut } = makeSut()
    simulateFillValidForm(sut)
    const spinner = sut.getByTestId('spinner')
    expect(spinner).toBeTruthy()
  })

  test('Should call authentication with correct value', () => {
    const { sut, authenticationSpy } = makeSut()
    const email = faker.internet.email()
    const password = faker.internet.password()
    simulateFillValidForm(sut, email, password)
    expect(authenticationSpy.params).toEqual({
      email,
      password
    })
  })

  test('Should call authentication only once', () => {
    const { sut, authenticationSpy } = makeSut()
    simulateFillValidForm(sut)
    simulateFillValidForm(sut)
    expect(authenticationSpy.count).toBe(1)
  })

  test('Should not call authentication if form is invalid', () => {
    const validationError = faker.random.words()
    const { sut, authenticationSpy } = makeSut({ validationError })
    simulateFillEmail(sut)
    fireEvent.submit(sut.getByTestId('form'))
    expect(authenticationSpy.count).toBe(0)
  })

  test('Should present error if autehntication fails', async () => {
    const { sut, authenticationSpy } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(Promise.reject(error))
    simulateFillValidForm(sut)
    const errorWrap = sut.getByTestId('error-wrap')
    await waitFor(() => errorWrap)
    const mainError = sut.getByTestId('main-error')
    expect(mainError.textContent).toBe(error.message)
    expect(errorWrap.childElementCount).toBe(1)
  })

  test('Should add accessToken to localStorage on sucess', async () => {
    const { sut, authenticationSpy } = makeSut()
    simulateFillValidForm(sut)
    await waitFor(() => sut.getByTestId('form'))
    expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', authenticationSpy.account.accessToken)
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/')
  })

  test('Should go to Signup page', () => {
    const { sut } = makeSut()
    const register = sut.getByTestId('signup')
    fireEvent.click(register)
    expect(history.length).toBe(2)
    expect(history.location.pathname).toBe('/signup')
  })
})
