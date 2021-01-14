import { Authentication, AuthenticationParams } from '@/domain/usecases'
import { AccountModel } from '@/domain/models'
import { mockAccountModel } from '@/domain/test'

export class AuthenticationSpy implements Authentication {
  account = mockAccountModel()
  params: AuthenticationParams
  count = 0
  async auth (params: AuthenticationParams): Promise<AccountModel> {
    this.params = params
    this.count++
    return Promise.resolve(this.account)
  }
}
