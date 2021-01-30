import React from 'react'
import faker from 'faker'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import 'jest-localstorage-mock'
import { render, RenderResult, fireEvent, cleanup, waitFor } from '@testing-library/react'
import { Login } from '@/presentation/pages'
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

const testFillEmail = (sut: RenderResult, email = faker.internet.email()): void => {
  const emailInput = sut.getByTestId('email')
  fireEvent.input(emailInput, { target: { value: email } })
}

const testFillPassword = (sut: RenderResult, password = faker.internet.password()): void => {
  const passwordInput = sut.getByTestId('password')
  fireEvent.input(passwordInput, { target: { value: password } })
}

const testHowManyChild = (sut: RenderResult, elementName: string, child: number): void => {
  const element = sut.getByTestId(elementName)
  expect(element.childElementCount).toBe(child)
}

const testButtonStatus = (sut: RenderResult, buttonName: string, disabled: boolean): void => {
  const submitButton = sut.getByTestId(buttonName) as HTMLButtonElement
  expect(submitButton.disabled).toBe(disabled)
}

const testElementExist = (sut: RenderResult, elementName: string): void => {
  const element = sut.getByTestId(elementName)
  expect(element).toBeTruthy()
}

const testElementText = (sut: RenderResult, elementName: string, text: string): void => {
  const element = sut.getByTestId(elementName)
  expect(element.textContent).toBe(text)
}

const simulateValidationStatus = (sut: RenderResult, fieldName: string, validationError?: string): void => {
  const fieldStatus = sut.getByTestId(`${fieldName}-status`)
  expect(fieldStatus.title).toBe(validationError || 'Tudo Certo!')
  expect(fieldStatus.textContent).toBe(validationError ? '🔴' : '🟢')
}

const simulateFillValidForm = async (sut: RenderResult, email = faker.internet.email(), password = faker.internet.password()): Promise<void> => {
  testFillEmail(sut, email)
  testFillPassword(sut, password)
  const form = sut.getByTestId('form')
  fireEvent.submit(form)
  await waitFor(() => form)
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
    testHowManyChild(sut, 'error-wrap', 0)
    testButtonStatus(sut, 'submit', true)
    simulateValidationStatus(sut, 'email', validationError)
    simulateValidationStatus(sut, 'password', validationError)
  })

  test('Should show email error if validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError: validationError })
    testFillEmail(sut)
    simulateValidationStatus(sut, 'email', validationError)
  })

  test('Should show password error if validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError: validationError })
    testFillPassword(sut)
    simulateValidationStatus(sut, 'password', validationError)
  })

  test('Should show valid email state if validation sucessed', () => {
    const { sut } = makeSut()
    testFillEmail(sut)
    simulateValidationStatus(sut, 'email')
  })

  test('Should show valid password state if validation sucessed', () => {
    const { sut } = makeSut()
    testFillPassword(sut)
    simulateValidationStatus(sut, 'password')
  })

  test('Should enable submit button if form is valid', () => {
    const { sut } = makeSut()
    testFillEmail(sut)
    testFillPassword(sut)
    testButtonStatus(sut, 'submit', false)
  })

  test('Should show spinner on submit', async () => {
    const { sut } = makeSut()
    await simulateFillValidForm(sut)
    testElementExist(sut, 'spinner')
  })

  test('Should call authentication with correct value', async () => {
    const { sut, authenticationSpy } = makeSut()
    const email = faker.internet.email()
    const password = faker.internet.password()
    await simulateFillValidForm(sut, email, password)
    expect(authenticationSpy.params).toEqual({ email, password })
  })

  test('Should call authentication only once', async () => {
    const { sut, authenticationSpy } = makeSut()
    await simulateFillValidForm(sut)
    await simulateFillValidForm(sut)
    expect(authenticationSpy.count).toBe(1)
  })

  test('Should not call authentication if form is invalid', () => {
    const validationError = faker.random.words()
    const { sut, authenticationSpy } = makeSut({ validationError })
    testFillEmail(sut)
    fireEvent.submit(sut.getByTestId('form'))
    expect(authenticationSpy.count).toBe(0)
  })

  test('Should present error if autehntication fails', async () => {
    const { sut, authenticationSpy } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(Promise.reject(error))
    await simulateFillValidForm(sut)
    testHowManyChild(sut, 'error-wrap', 1)
    testElementText(sut, 'main-error', error.message)
  })

  test('Should add accessToken to localStorage on sucess', async () => {
    const { sut, authenticationSpy } = makeSut()
    await simulateFillValidForm(sut)
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
