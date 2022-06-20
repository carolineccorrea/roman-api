import { Hasher, AddAccountRepository, LoadAccountByEmailRepository, Encrypter } from "data/protocols"
import { AddAccount, AddAccountModel } from "domain/use-cases/add-account"
import { AccountModel } from "domain/models/account"

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: AddAccountRepository
  constructor(
    encrypter: Encrypter,
    addAccountRepository: AddAccountRepository
  ) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)
    const account = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
    return account
  }
}