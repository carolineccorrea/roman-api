import { AddAccountRepository, Encrypter } from "data/protocols"
import { AccountModel } from "domain/models/account"
import { AddAccountModel } from "domain/use-cases/add-account"
import { DbAddAccount } from "./db-add-account"

interface SutTypes {
    sut: DbAddAccount
    encrypterStub: Encrypter
    addAccountRepositoryStub: AddAccountRepository
}

const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add (accountData: AddAccountModel): Promise<AccountModel> {
            const fakeAccount = {
                id: 'any_id',
                name: 'any_name',
                email: 'any_name@email.co',
                password: 'hashed_password'
            }
            return new Promise(resolve => resolve(fakeAccount))
        }
    }
    return new AddAccountRepositoryStub()
}
const makeEncrypter = (): Encrypter => {
   class EncrypterStub implements Encrypter {
       async encrypt (plaintext: string): Promise<string> {
        return new Promise(resolve => resolve('hashed_password'))
       } 
   } 
   return new EncrypterStub()
}

const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypter()
    const addAccountRepositoryStub = makeAddAccountRepository()
    const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
    return {
        sut,
        encrypterStub,
        addAccountRepositoryStub
    }
}

describe("DbAddAccount tests", () => {
    it('Deve chamar o AddAccountRepository com os valores corretos', async()=>{
        const { sut, addAccountRepositoryStub} = makeSut()
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
        const accountData = {
            name: 'any_name',
            email: 'any_email@email.co',
            password: 'any_password'
        }
        await sut.add(accountData)
        expect(addSpy).toHaveBeenCalledWith({
            name: 'any_name',
            email: 'any_email@email.co',
            password: 'hashed_password'
        })
    })
})