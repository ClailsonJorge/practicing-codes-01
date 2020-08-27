import axios from 'axios';
import { AxiosHttpClient } from './axios-http-client';
import faker from 'faker';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const makeSut = (): AxiosHttpClient => {
  return new AxiosHttpClient();
};

describe('AxiosHttpClient', () => {
  test('Should call axios with correct URL', async () => {
    const url = faker.internet.url();
    const sut = makeSut();
    sut.post({ url: url });
    expect(mockedAxios).toHaveBeenCalledWith(url);
  });
});
