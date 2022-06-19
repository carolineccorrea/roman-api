import { AccountModel } from "domain/models/account"
import { AddAccountModel } from "domain/use-cases/add-account"

export interface AddAccountRepository {
  add: (data: AddAccountModel) => Promise<AccountModel>
}
