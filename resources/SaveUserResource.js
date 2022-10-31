export class SaveUserResponse {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
}

/**
 * @swagger
 * components:
 *  schemas:
 *      SaveUserResponse:
 *        type: object
 *        properties:
 *         email:
 *          type: string
 *         password:
 *          type: string
 *        required:
 *          - email
 *          - password
 *        example:
 *          email: hello@example.com
 *          password: f5Haa8#asD
 */