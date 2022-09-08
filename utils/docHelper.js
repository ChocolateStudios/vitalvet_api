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
 *         accessToken:
 *          type: string
 *         expiresIn:
 *          type: integer
 *        required:
 *          - accessToken
 *          - expiresIn
 *        example:
 *          accessToken: eyJhbGciOi1NiIsIVCJ9.aWQiOjlhdCI6Y1OTISwiZXhwIxNQ5fQ.RpvhB4XId-sVJ823lpjDe5AlE
 *          expiresIn: 900
 * 
 *      RefreshTokenSubmission:
 *        type: object
 *        properties:
 *         refreshToken:
 *          type: string
 *        required:
 *          - refreshToken
 *        example:
 *          refreshToken: eyJhbGciOi1NiIsIVCJ9.aWQiOjlhdCI6Y1OTISwiZXhwIxNQ5fQ.RpvhB4XId-sVJ823lpjDe5AlE
 * 
 *      TokenWithRefreshResponse:
 *        type: object
 *        properties:
 *         accessToken:
 *          type: string
 *         expiresIn:
 *          type: integer
 *         refreshToken:
 *          type: string
 *        required:
 *          - accessToken
 *          - expiresIn
 *          - refreshToken
 *        example:
 *          accessToken: eyJhbGciOi1NiIsIVCJ9.aWQiOjlhdCI6Y1OTISwiZXhwIxNQ5fQ.RpvhB4XId-sVJ823lpjDe5AlE
 *          expiresIn: 900
 *          refreshToken: eyJhbGciOi1NiIsIVCJ9.aWQiOjlhdCI6Y1OTISwiZXhwIxNQ5fQ.RpvhB4XId-sVJ823lpjDe5AlE
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
 *      ProfileUserResponse:
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
 *          $ref: '#/components/schemas/ProfileResponse'
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
 *      SpeciesWithSubspeciesResponse:
 *        type: object
 *        properties:
 *          id:
 *           type: integer
 *          name:
 *           type: string
 *          subspecies:
 *           type: array
 *        required:
 *          - id
 *          - name
 *          - subspecies
 *        example:
 *          id: 1
 *          name: Perro
 *          subspecies:
 *              - id: 3
 *                name: Bulldog
 * 
 *      SpeciesListResponse:
 *        type: array
 *        items:
 *          type: object
 *          $ref: '#/components/schemas/SpeciesWithSubspeciesResponse'
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
 *          phone: "999544555"
 *          dni: "760987654"
 *          email: hugo@example.com
 * 
 *      OwnerListResponse:
 *        type: array
 *        items:
 *          type: object
 *          $ref: '#/components/schemas/OwnerResponse'
 *
 *      EventTypeSubmission:
 *        type: object
 *        properties:
 *         name:
 *          type: string
 *         typeColor:
 *          type: string
 *        required:
 *          - name
 *          - typeColor
 *        example:
 *          name: Corte de cabello
 *          typeColor: "#008000"
 * 
 *      EventTypeListResponse:
 *        type: array
 *        items:
 *          type: object
 *          $ref: '#/components/schemas/EventTypeResponse'
 * 
 *      PatientSubmission:
 *        type: object
 *        properties:
 *          name:
 *           type: string
 *          weight:
 *           type: number
 *          birthday:
 *           type: date
 *          dayOfDeath:
 *           type: date
 *          mainPicture:
 *           type: string
 *          subspeciesId:
 *           type: integer
 *          ownerId:
 *           type: integer
 *        required:
 *          - name
 *          - weight
 *          - birthday
 *          - subspeciesId
 *          - ownerId
 *        example:
 *          name: Pepe
 *          weight: 40
 *          birthday: 2019-03-17
 *          dayOfDeath: 2021-06-24
 *          mainPicture: https://www.example.com/image.png
 *          subspeciesId: 1
 *          ownerId: 1
 * 
 *      PatientListResponse:
 *        type: array
 *        items:
 *          type: object
 *          $ref: '#/components/schemas/PatientResponse'
 * 
 *      EventSubmission:
 *        type: object
 *        properties:
 *         title:
 *          type: string
 *         description:
 *          type: string
 *         startTime:
 *          type: datetime
 *         endTime:
 *          type: datetime
 *         patientId:
 *          type: integer
 *         eventTypeId:
 *          type: integer
 *        required:
 *          - title
 *          - description
 *          - startTime
 *          - patientId
 *          - eventTypeId
 *        example:
 *          title: Bañar a Pepe
 *          description: Shampoo de Limon
 *          startTime: 2019-03-17T00:00:00.000Z
 *          endTime: 2019-03-17T01:00:00.000Z
 *          patientId: 1
 *          eventTypeId: 1
 * 
 *      EventListResponse:
 *        type: array
 *        items:
 *          type: object
 *          $ref: '#/components/schemas/EventResponse'
 * 
 *      MedicineListResponse:
 *        type: array
 *        items:
 *          type: object
 *          $ref: '#/components/schemas/MedicineResponse' 
 * 
 *      MedicineSubmission:
 *        type: object
 *        properties:
 *          name:
 *           type: string
 *        required:
 *          - name
 *        example:
 *          name: Apronax
 * 
 *      DocumentFileSubmission:
 *        type: object
 *        properties:
 *          name:
 *           type: string
 *          link:
 *           type: string
 *          type:
 *           type: string
 *        required:
 *          - link
 *          - type
 *        example:
 *          name: Pepe_profile_image
 *          link: https://www.example.com/image.png
 *          type: IMAGE_PNG
 * 
 *      DocumentFileTypeEnum:
 *        type: string
 *        enum: ['IMAGE_JPG', 'IMAGE_PNG', 'IMAGE_SVG', 'TEXT_TXT', 'TEXT_PDF', 'TEXT_WORD', 'SPREADSHEET_EXCEL', 'PRESENTATION_PPT']
 * 
 *      PatientDocumentFileListResponse:
 *        type: array
 *        items:
 *          type: object
 *          $ref: '#/components/schemas/PatientDocumentFileResponse' 
 * 
 *      MedicalAttentionDocumentFileListResponse:
 *        type: array
 *        items:
 *          type: object
 *          $ref: '#/components/schemas/MedicalAttentionDocumentFileResponse' 
 * 
 *      MedicalAttentionSubmission:
 *        type: object
 *        properties:
 *          weight:
 *           type: number
 *          description:
 *           type: string
 *          date:
 *           type: date
 *          resultNotes:
 *           type: string
 *          patientId:
 *           type: integer
 *        required:
 *          - weight
 *          - description
 *          - date
 *          - resultNotes
 *          - patientId
 *        example:
 *          weight: 25.5
 *          description: Tiene dolores en la cola
 *          date: 2022-03-17
 *          resultNotes: Lo pisaron muy fuerte, colocarle crema todos los dias
 *          patientId: 1
 * 
 *      MedicalAttentionListResponse:
 *        type: array
 *        items:
 *          type: object
 *          $ref: '#/components/schemas/MedicalAttentionResponse' 
 * 
 * 
 * 
 * 
 * 
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