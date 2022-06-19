import { badRequest, serverError } from "presentation/helpers"
import { MissingParamError, InvalidParamError } from "presentation/errors"
import { EmailValidator } from "presentation/protocols"
import { HttpRequest, HttpResponse } from "presentation/protocols/http"
import { Controller } from "presentation/protocols/controller"
import { AddAccount } from "domain/use-cases/add-account"

export class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator
    private readonly addAccount: AddAccount

    constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
        this.emailValidator = emailValidator
        this.addAccount = addAccount
    }

    handle(request: HttpRequest): HttpResponse {
        try {
            const requireFields = ['name', 'email', 'password']
            for (const field of requireFields) {
                if (!request.body[field]) {
                    return badRequest(new MissingParamError(field))
                }
            }
            const { name, email, password } = request.body
            const isValid = this.emailValidator.isValid(email)
            if (!isValid) {
                return badRequest(new InvalidParamError('email'))
            }
            const account = this.addAccount.add({
                name,
                email,
                password
            })

            return {
                statusCode: 200,
                body: account
            }

        } catch (error) {
            return serverError()
        }
    }
}