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
 *      SpeciesSubmission:
 *        type: object
 *        properties:
 *          name:
 *           type: string
 *        required:
 *          - name
 *        example:
 *          name: Perro
 * 
 *      SubspeciesSubmission:
 *        type: object
 *        properties:
 *          name:
 *           type: string
 *          species_id:
 *           type: integer
 *        required:
 *          - name
 *          - species_id
 *        example:
 *          name: Bulldog
 *          species_id: 1
 * 
 *      SpeciesListResponse:
 *        type: array
 *        items:
 *          type: object
 *          $ref: '#/components/schemas/Species'
 * 
 *      OwnerSubmission:
 *        type: object
 *        properties:
 *          name:
 *           type: string
 *          lastname:
 *           type: string
 *          birthday:
 *           type: date
 *          direction:
 *           type: string
 *          phone:
 *           type: string
 *          dni:
 *           type: string
 *          email:
 *           type: string
 *        required:
 *          - name
 *          - lastname
 *          - birthday
 *          - direction
 *          - phone
 *          - dni
 *          - email
 *        example:
 *          name: Hugo
 *          lastname: Parker
 *          birthday: 2020-01-01
 *          direction: Av. Example 123 - Bogota
 *          phone: 999544555
 *          dni: 760987654
 *          email: hugo@example.com
 * 
 *      OwnersListResponse:
 *        type: array
 *        items:
 *          type: object
 *          $ref: '#/components/schemas/Owner'
 *
 *      EventTypeSubmission:
 *        type: object
 *        properties:
 *         name:
 *          type: string
 *         type_color:
 *          type: string
 *        required:
 *          - name
 *          - type_color
 *        example:
 *          name: Corte de cabello
 *          type_color: "#008000"
 * 
 *      EventTypeListResponse:
 *        type: array
 *        items:
 *          type: object
 *          $ref: '#/components/schemas/EventType'
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