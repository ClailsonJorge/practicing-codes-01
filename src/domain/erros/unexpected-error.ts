export class UnexpectedError extends Error {
  constructor () {
    super('Algo errado, por favor tente mais tarde!')
    this.name = 'UnexpectedError'
  }
}
