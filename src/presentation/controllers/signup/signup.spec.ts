import { AddAccount, AddAccountModel } from "domain/use-cases/add-account";
import { AccountModel } from "domain/use-cases/models/account";
import { MissingParamError } from "presentation/errors";
import { InvalidParamError } from "presentation/errors/invalid-param-error";
import { ServerError } from "presentation/errors/server-error";
import { EmailValidator } from "presentation/protocols/email-validator";
import { SignUpController } from "./signup";

interface SutTypes {
    sut: SignUpController
    emailValidatorStub: EmailValidator
    addAccountStub: AddAccount
}

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean { return true }
    }

    return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
    class AddAccountStub implements AddAccount {
        add(account: AddAccountModel): AccountModel { 
            const fakeAccount = {
                id: 'any_id',
                name: 'any_name',
                email: 'any_email@email.co',
                password: 'any_password'
            }
            return fakeAccount;
        }
    }

    return new AddAccountStub()
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const addAccountStub = makeAddAccount()
    const sut = new SignUpController(emailValidatorStub, addAccountStub)

    return {
        sut,
        emailValidatorStub,
        addAccountStub
    }
}

describe("Signup Controllers", () => {
    it('Deve retornar 400 se nenhum nome for passado', () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                email: 'any_email@email.co',
                password: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('name'))
    });

    it('Deve retornar 400 se nenhum email for passado', () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'any_name',
                password: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
    });

    it('Deve retornar 400 se nenhum password for passado', () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@email.co'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('password'))
    });

    it('Deve retornar 400 se um email invalido for passado', () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'invalid_email@email.co',
                password: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    });

    it('Deve chamar o EmailValidator com o email correto', () => {
        const { sut, emailValidatorStub } = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@email.co',
                password: 'any_password'
            }
        }
        sut.handle(httpRequest)
        expect(isValidSpy).toHaveBeenCalledWith('any_email@email.co')
    });

    it('Deve retornar 500 se o EmailValidator estourar um erro de excessao', () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@email.co',
                password: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    });

    test('Deve chamar o AddAccount com os valores corretos', () => {
        const { sut, addAccountStub } = makeSut()
        const addAccountSpy = jest.spyOn(addAccountStub, 'add')
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@email.co',
                password: 'any_password'
            }
        }
        sut.handle(httpRequest)
        expect(addAccountSpy).toHaveBeenCalledWith({
            name: 'any_name',
            email: 'any_email@email.co',
            password: 'any_password'
        });
    });
    it('Deve retornar 200 se forem passados os valores corretos', () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@email.co',
                password: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(200)
        expect(httpResponse.body).toEqual({
            id: 'any_id',
            name: 'any_name',
            email: 'any_email@email.co',
            password: 'any_password'
        });
    });
});