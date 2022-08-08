/*
    File to define some swagger documentation for the API.
*/


/**
 * @swagger
 * components:
 *  schemas:
 *      TokenResponse:
 *        type: object
 *        properties:
 *         token:
 *          type: string
 *         expiresIn:
 *          type: integer
 *        required:
 *          - token
 *          - expiresIn
 *        example:
 *          token: eyJhbGciOi1NiIsIVCJ9.aWQiOjlhdCI6Y1OTISwiZXhwIxNQ5fQ.RpvhB4XId-sVJ823lpjDe5AlE
 *          expiresIn: 900
 * 
 *      UnauthorizedResponse:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *        required:
 *          - message
 *        example:
 *          message: Not authorized
 * 
 *      ProfileSubmission:
 *        type: object
 *        properties:
 *         name:
 *          type: string
 *         lastname:
 *          type: string
 *         birthday:
 *          type: date
 *         picture:
 *          type: string
 *         college:
 *          type: string
 *         review:
 *          type: string
 *        required:
 *          - name
 *          - lastname
 *          - birthday
 *          - college
 *          - review
 *        example:
 *          name: Manuel
 *          lastname: Quispe
 *          birthday: 2020-01-01
 *          picture: http://www.example.com/image.png
 *          college: Universidad Nacional de Colombia
 *          review: Lorem ipsum dolor sit amet, consectetur
 * 
 *      ProfileUser:
 *        type: object
 *        properties:
 *         id:
 *          type: integer
 *         email:
 *          type: string
 *        required:
 *          - id
 *          - email
 *        example:
 *          id: 1
 *          email: hello@example.com
 * 
 *      ProfileListResponse:
 *        type: array
 *        items:
 *          type: object
 *          $ref: '#/components/schemas/Profile'
 * 
 * 
 * 
 * 
 *  securitySchemes:
 *      BearerAuth:
 *        type: http
 *        scheme: bearer
 *        bearerFormat: JWT
 * 
 * 
 * 
 * 
 * 
 *  responses:
 *      UnauthorizedError:
 *        description: Invalid token
 *        content:
 *         application/json:
 *             schema:
 *                 type: object
 *                 $ref: '#/components/schemas/UnauthorizedResponse'
 */