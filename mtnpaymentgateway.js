openapi: 3.0.1
info:
  title: Collection
  description: 'Enable remote collection of bills, fees or taxes'
  version: '1.0'
servers:
  - url: https://sandbox.momodeveloper.mtn.com/collection
paths:
  /v1_0/account/balance:
    get:
      summary: GetAccountBalance
      description: Get the balance of own account.
      operationId: GetAccountBalance
      parameters:
        - name: Authorization
          in: header
          description: Bearer Authentication Token generated using CreateAccessToken API Call
          required: true
          schema:
            type: string
        - name: X-Target-Environment
          in: header
          description: The identifier of the Wallet Platform system where the transaction shall be processed. This parameter is used to route the request to the Wallet Platform system that will initiate the transaction.
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Ok
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Balance'
              example:
                availableBalance: string
                currency: string
            Incorrect target environment:
              schema:
                $ref: '#/components/schemas/Balance'
              examples:
                default:
                  value: 
        '400':
          description: 'Bad request, e.g. invalid data was sent in the request.'
          content:
            application/json: { }
            Incorrect target environment: { }
        '500':
          description: Internal error. The returned response contains details.
          content:
            Incorrect target environment:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: NOT_ALLOWED_TARGET_ENVIRONMENT
                message: Access to target environment is forbidden.
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: PAYEE_NOT_FOUND
                message: string
  '/v1_0/accountholder/{accountHolderIdType}/{accountHolderId}/active':
    get:
      summary: ValidateAccountHolderStatus
      description: Operation is used  to check if an account holder is registered and active in the system.
      operationId: ValidateAccountHolderStatus
      parameters:
        - name: accountHolderId
          in: path
          description: The AccountHolder number. Validated according to the AccountHolder ID type (case Sensitive). <br> msisdn - Mobile Number validated according to ITU-T E.164. Validated with IsMSISDN<br> email - Validated to be a valid e-mail format. Validated with IsEmail
          required: true
          schema:
            type: string
        - name: accountHolderIdType
          in: path
          description: 'Specifies the type of the AccountHolder ID. Allowed values [msisdn, email].  <br> accountHolderId should explicitly be in small letters.'
          required: true
          schema:
            type: string
        - name: Authorization
          in: header
          description: Bearer Authentication Token generated using CreateAccessToken API Call
          required: true
          schema:
            type: string
        - name: X-Target-Environment
          in: header
          description: The identifier of the Wallet Platform system where the transaction shall be processed. This parameter is used to route the request to the Wallet Platform system that will initiate the transaction.
          required: true
          schema:
            type: string
      responses:
        '200':
          description: 'Ok. True if account holder is registered and active, false if the account holder is not active or not found'
          content:
            Incorrect target environment: { }
        '400':
          description: 'Bad request, e.g. invalid data was sent in the request.'
          content:
            Incorrect target environment: { }
        '500':
          description: Internal error. The returned response contains details.
          content:
            Incorrect target environment:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: NOT_ALLOWED_TARGET_ENVIRONMENT
                message: Access to target environment is forbidden.
  /v1_0/requesttopay:
    post:
      summary: RequesttoPay
      description: "This operation is used to request a payment from a consumer (Payer). The payer will be asked to authorize the payment. The transaction will be executed once the payer has authorized the payment. The requesttopay will be in status PENDING until the transaction is authorized or declined by the payer or it is timed out by the system. \n Status of the transaction can be validated by using the GET /requesttopay/\\<resourceId\\>"
      operationId: RequesttoPay
      parameters:
        - name: Authorization
          in: header
          description: Bearer Authentication Token generated using CreateAccessToken API Call
          required: true
          schema:
            type: string
        - name: X-Callback-Url
          in: header
          description: URL to the server where the callback should be sent.
          schema:
            type: string
        - name: X-Reference-Id
          in: header
          description: 'Format - UUID. Recource ID of the created request to pay transaction. This ID is used, for example, validating the status of the request. ‘Universal Unique ID’ for the transaction generated using UUID version 4.'
          required: true
          schema:
            type: string
        - name: X-Target-Environment
          in: header
          description: The identifier of the Wallet Platform system where the transaction shall be processed. This parameter is used to route the request to the Wallet Platform system that will initiate the transaction.
          required: true
          schema:
            type: string
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RequestToPay'
            example:
              amount: string
              currency: string
              externalId: string
              payer:
                partyIdType: MSISDN
                partyId: string
              payerMessage: string
              payeeNote: string
      responses:
        '202':
          description: Accepted
          content:
            application/json: { }
            ReferenceId already in use: { }
            Unspecified internal error: { }
        '400':
          description: 'Bad request, e.g. invalid data was sent in the request.'
          content:
            application/json: { }
            ReferenceId already in use: { }
            Unspecified internal error: { }
        '409':
          description: 'Conflict, duplicated reference id'
          content:
            ReferenceId already in use:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: RESOURCE_ALREADY_EXIST
                message: Duplicated reference id. Creation of resource failed.
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: PAYEE_NOT_FOUND
                message: string
            Unspecified internal error:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              examples:
                default:
                  value: 
        '500':
          description: Internal Error.
          content:
            Unspecified internal error:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: INTERNAL_PROCESSING_ERROR
                message: An internal error occurred while processing.
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: PAYEE_NOT_FOUND
                message: string
            ReferenceId already in use:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              examples:
                default:
                  value: 
  '/v1_0/requesttopay/{referenceId}':
    get:
      summary: RequesttoPayTransactionStatus
      description: This operation is used to get the status of a request to pay. X-Reference-Id that was passed in the post is used as reference to the request.
      operationId: RequesttoPayTransactionStatus
      parameters:
        - name: referenceId
          in: path
          description: UUID of transaction to get result. Reference id  used when creating the request to pay.
          required: true
          schema:
            type: string
        - name: Authorization
          in: header
          description: Bearer Authentication Token generated using CreateAccessToken API Call
          required: true
          schema:
            type: string
        - name: X-Target-Environment
          in: header
          description: The identifier of the Wallet Platform system where the transaction shall be processed. This parameter is used to route the request to the Wallet Platform system that will initiate the transaction.
          required: true
          schema:
            type: string
      responses:
        '200':
          description: OK. Note that a  failed request to pay will be returned with this status too. The 'status' of the RequestToPayResult can be used to determine the outcome of the request. The 'reason' field can be used to retrieve a cause in case of failure.
          content:
            Successful request to pay:
              schema:
                $ref: '#/components/schemas/RequestToPayResult'
              example:
                amount: 100
                currency: UGX
                financialTransactionId: 23503452
                externalId: 947354
                payer:
                  partyIdType: MSISDN
                  partyId: 4656473839
                status: SUCCESSFUL
            Payer not found:
              schema:
                $ref: '#/components/schemas/RequestToPayResult'
              example:
                amount: 100
                currency: UGX
                externalId: 947354
                payer:
                  partyIdType: MSISDN
                  partyId: 4656473839
                status: FAILED
                reason:
                  code: PAYER_NOT_FOUND
                  message: Payee does not exist
            application/json:
              schema:
                $ref: '#/components/schemas/RequestToPayResult'
              example:
                amount: string
                currency: string
                financialTransactionId: string
                externalId: string
                payer:
                  partyIdType: MSISDN
                  partyId: string
                payerMessage: string
                payeeNote: string
                status: PENDING
                reason:
                  code: PAYEE_NOT_FOUND
                  message: string
            Request to pay not found:
              schema:
                $ref: '#/components/schemas/RequestToPayResult'
              examples:
                default:
                  value: 
            Unspecified internal error:
              schema:
                $ref: '#/components/schemas/RequestToPayResult'
              examples:
                default:
                  value: 
        '400':
          description: 'Bad request, e.g. an incorrectly formatted reference id was provided.'
          content:
            Successful request to pay: { }
            Payer not found: { }
            application/json: { }
            Request to pay not found: { }
            Unspecified internal error: { }
        '404':
          description: Resource not found.
          content:
            Request to pay not found:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: RESOURCE_NOT_FOUND
                message: Requested resource was not found.
            Successful request to pay:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              examples:
                default:
                  value: 
            Payer not found:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              examples:
                default:
                  value: 
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: PAYEE_NOT_FOUND
                message: string
            Unspecified internal error:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              examples:
                default:
                  value: 
        '500':
          description: 'Internal Error. Note that if the retrieved request to pay has failed, it will not cause this status to be returned. This status is only returned if the GET request itself fails.'
          content:
            Unspecified internal error:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: INTERNAL_PROCESSING_ERROR
                message: An internal error occurred while processing.
            Successful request to pay:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              examples:
                default:
                  value: 
            Payer not found:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              examples:
                default:
                  value: 
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: PAYEE_NOT_FOUND
                message: string
            Request to pay not found:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              examples:
                default:
                  value: 
  /v1_0/bc-authorize:
    post:
      summary: bc-authorize
      description: This operation is used to claim a consent by the account holder for the requested scopes.
      operationId: bc-authorize
      parameters:
        - name: Authorization
          in: header
          description: Bearer Token. Replace with a valid oauth2 token received from oauth2 token endpoint in Wallet Platform.
          required: true
          schema:
            type: string
        - name: X-Target-Environment
          in: header
          description: The identifier of the Wallet Platform system where the transaction shall be processed. This parameter is used to route the request to the Wallet Platform system that will initiate the transaction.
          required: true
          schema:
            type: string
        - name: X-Callback-Url
          in: header
          description: URL to the server where the callback should be sent.
          schema:
            type: string
      requestBody:
        content:
          application/x-www-form-urlencoded:
            example: 'login_hint=ID:{msisdn}/MSISDN&scope={scope}&access_type={online/offline}'
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/bcauthorizeResponse'
              example:
                auth_req_id: string
                interval: 0
                expires_in: 0
  '/v1_0/accountholder/{accountHolderIdType}/{accountHolderId}/basicuserinfo':
    get:
      summary: GetBasicUserinfo
      description: This operation returns personal information of the account holder. The operation does not need any consent by the account holder.
      operationId: GetBasicUserinfo
      parameters:
        - name: accountHolderIdType
          in: path
          description: "Type of account holder identity passed in accountHolderId path param.\n\nPossible values:\nMSISDN\n\nEmail\n\nAlias\n\nID (account ID)"
          required: true
          schema:
            enum:
              - MSISDN
              - Email
              - Alias
              - ID
            type: string
        - name: accountHolderId
          in: path
          description: ID of the account holder.
          required: true
          schema:
            type: string
        - name: Authorization
          in: header
          description: Bearer Authentication Token generated using CreateAccessToken API Call
          required: true
          schema:
            type: string
        - name: X-Target-Environment
          in: header
          description: The identifier of the Wallet Platform system where the transaction shall be processed. This parameter is used to route the request to the Wallet Platform system that will initiate the transaction.
          required: true
          schema:
            type: string
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BasicUserInfoJsonResponse'
              example:
                given_name: string
                family_name: string
                birthdate: string
                locale: string
                gender: string
                status: string
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TokenPost401ApplicationJsonResponse'
              example:
                error: string
        '500':
          description: Error
          content:
            application/json: { }
  '/v1_0/requesttopay/{referenceId}/deliverynotification':
    post:
      summary: RequesttoPayDeliveryNotification
      description: This operation is used to send additional Notification to an End User.
      operationId: RequesttoPayDeliveryNotification
      parameters:
        - name: referenceId
          in: path
          description: UUID of transaction to get result. Reference id used when creating the RequesttoPay.
          required: true
          schema:
            type: string
        - name: notificationMessage
          in: header
          description: The message to send in the delivery notification. Max              length 160.
          required: true
          schema:
            type: string
        - name: Language
          in: header
          description: An ISO 639-1 or ISO 639-3 language code. The language is used to select the best matching notification template when sending the delivery notification to the end-user. A default value is used if not specified.
          schema:
            type: string
        - name: Authorization
          in: header
          description: Bearer Authentication Token generated using CreateAccessToken API Call
          required: true
          schema:
            type: string
        - name: X-Target-Environment
          in: header
          description: The identifier of the Wallet Platform system where the transaction shall be processed. This parameter is used to route the request to the Wallet Platform system that will initiate the transaction.
          required: true
          schema:
            type: string
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/deliverynotification'
            example:
              notificationMessage: string
      responses:
        '200':
          description: OK. Notification successfully enqueued.
          content:
            application/json: { }
        '400':
          description: Bad request. Invalid data was sent in the request.
          content:
            application/json: { }
        '404':
          description: 'Resource not found. The reference ID does not exist, or the calling user is not the owner of the financial transaction.'
          content:
            application/json: { }
        '409':
          description: Conflict. The transaction is not successfully completed.
          content:
            application/json: { }
        '410':
          description: Gone. The delivery notification opportunity has expired.
          content:
            application/json: { }
        '429':
          description: Too many requests. Too many attempts for the same ID has been made recently. This will only occur if a successful attempt has previously been performed.
          content:
            application/json: { }
        '500':
          description: Internal server error. An unexpected error occurred.
          content:
            application/json: { }
  '/v1_0/account/balance/{currency}':
    get:
      summary: GetAccountBalanceInSpecificCurrency
      description: Get the balance of own account. Currency parameter passed in GET
      operationId: GetAccountBalanceInSpecificCurrency
      parameters:
        - name: currency
          in: path
          description: Should be in ISO4217 Currency
          required: true
          schema:
            type: string
        - name: Authorization
          in: header
          description: Bearer Authentication Token generated using CreateAccessToken API Call
          required: true
          schema:
            type: string
        - name: X-Target-Environment
          in: header
          description: The identifier of the Wallet Platform system where the transaction shall be processed. This parameter is used to route the request to the Wallet Platform system that will initiate the transaction.
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Ok
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Balance'
              example:
                availableBalance: string
                currency: string
            Incorrect target environment:
              schema:
                $ref: '#/components/schemas/Balance'
              examples:
                default:
                  value: 
        '400':
          description: 'Bad request, e.g. invalid data was sent in the request.'
          content:
            application/json: { }
            Incorrect target environment: { }
        '500':
          description: Internal error. The returned response contains details.
          content:
            Incorrect target environment:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: NOT_ALLOWED_TARGET_ENVIRONMENT
                message: Access to target environment is forbidden.
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: PAYEE_NOT_FOUND
                message: string
  /v1_0/requesttowithdraw:
    post:
      summary: RequestToWithdraw-V1
      description: This operation is used to request a withdrawal (cash-out) from a consumer (Payer). The payer will be asked to authorize the withdrawal. The transaction will be executed once the payer has authorized the withdrawal
      operationId: RequestToWithdraw-V1
      parameters:
        - name: Authorization
          in: header
          description: Bearer Authentication Token generated using CreateAccessToken API Call
          required: true
          schema:
            type: string
        - name: X-Callback-Url
          in: header
          description: POST Callback URL to the server where the callback should be sent.
          schema:
            type: string
        - name: X-Reference-Id
          in: header
          description: 'Format - UUID. Recource ID of the created request to pay transaction. This ID is used, for example, validating the status of the request. ‘Universal Unique ID’ for the transaction generated using UUID version 4.'
          required: true
          schema:
            type: string
        - name: X-Target-Environment
          in: header
          description: The identifier of the Wallet Platform system where the transaction shall be processed. This parameter is used to route the request to the Wallet Platform system that will initiate the transaction.
          required: true
          schema:
            type: string
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RequestToPay'
            example:
              payeeNote: string
              externalId: string
              amount: string
              currency: string
              payer:
                partyIdType: MSISDN
                partyId: string
              payerMessage: string
      responses:
        '202':
          description: Accepted
          content:
            application/json: { }
            ReferenceId already in use: { }
            Unspecified internal error: { }
        '400':
          description: 'Bad request, e.g. invalid data was sent in the request.'
          content:
            application/json: { }
            ReferenceId already in use: { }
            Unspecified internal error: { }
        '409':
          description: 'Conflict, duplicated reference id'
          content:
            ReferenceId already in use:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: RESOURCE_ALREADY_EXIST
                message: Duplicated reference id. Creation of resource failed.
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: PAYEE_NOT_FOUND
                message: string
            Unspecified internal error:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              examples:
                default:
                  value: 
        '500':
          description: Internal Error.
          content:
            Unspecified internal error:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: INTERNAL_PROCESSING_ERROR
                message: An internal error occurred while processing.
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: PAYEE_NOT_FOUND
                message: string
            ReferenceId already in use:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              examples:
                default:
                  value: 
  /v2_0/requesttowithdraw:
    post:
      summary: RequestToWithdraw-V2
      description: This operation is used to request a withdrawal (cash-out) from a consumer (Payer). The payer will be asked to authorize the withdrawal. The transaction will be executed once the payer has authorized the withdrawal
      operationId: RequestToWithdraw-V2
      parameters:
        - name: Authorization
          in: header
          description: Bearer Authentication Token generated using CreateAccessToken API Call
          required: true
          schema:
            type: string
        - name: X-Callback-Url
          in: header
          description: PUT Callback URL to the server where the callback should be sent.
          schema:
            type: string
        - name: X-Reference-Id
          in: header
          description: 'Format - UUID. Recource ID of the created request to pay transaction. This ID is used, for example, validating the status of the request. ‘Universal Unique ID’ for the transaction generated using UUID version 4.'
          required: true
          schema:
            type: string
        - name: X-Target-Environment
          in: header
          description: The identifier of the Wallet Platform system where the transaction shall be processed. This parameter is used to route the request to the Wallet Platform system that will initiate the transaction.
          required: true
          schema:
            type: string
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RequestToPay'
            example:
              payeeNote: string
              externalId: string
              amount: string
              currency: string
              payer:
                partyIdType: MSISDN
                partyId: string
              payerMessage: string
      responses:
        '202':
          description: Accepted
          content:
            application/json: { }
            ReferenceId already in use: { }
            Unspecified internal error: { }
        '400':
          description: 'Bad request, e.g. invalid data was sent in the request.'
          content:
            application/json: { }
            ReferenceId already in use: { }
            Unspecified internal error: { }
        '409':
          description: 'Conflict, duplicated reference id'
          content:
            ReferenceId already in use:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: RESOURCE_ALREADY_EXIST
                message: Duplicated reference id. Creation of resource failed.
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: PAYEE_NOT_FOUND
                message: string
            Unspecified internal error:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              examples:
                default:
                  value: 
        '500':
          description: Internal Error.
          content:
            Unspecified internal error:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: INTERNAL_PROCESSING_ERROR
                message: An internal error occurred while processing.
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: PAYEE_NOT_FOUND
                message: string
            ReferenceId already in use:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              examples:
                default:
                  value: 
  '/v1_0/requesttowithdraw/{referenceId}':
    get:
      summary: RequestToWithdrawTransactionStatus
      description: This operation is used to get the status of a request to withdraw. X-Reference-Id that was passed in the post is used as reference to the request.
      operationId: RequestToWithdrawTransactionStatus
      parameters:
        - name: referenceId
          in: path
          description: UUID of transaction to get result. Reference id  used when creating the RequestToWithdraw.
          required: true
          schema:
            type: string
        - name: Authorization
          in: header
          description: Bearer Authentication Token generated using CreateAccessToken API Call
          required: true
          schema:
            type: string
        - name: X-Target-Environment
          in: header
          description: The identifier of the Wallet Platform system where the transaction shall be processed. This parameter is used to route the request to the Wallet Platform system that will initiate the transaction.
          required: true
          schema:
            type: string
      responses:
        '200':
          description: OK. Note that a  failed request to pay will be returned with this status too. The 'status' of the RequestToPayResult can be used to determine the outcome of the request. The 'reason' field can be used to retrieve a cause in case of failure.
          content:
            Successful request to pay:
              schema:
                $ref: '#/components/schemas/RequestToPayResult'
              example:
                amount: 100
                currency: UGX
                financialTransactionId: 23503452
                externalId: 947354
                payer:
                  partyIdType: MSISDN
                  partyId: 4656473839
                status: SUCCESSFUL
            Payer not found:
              schema:
                $ref: '#/components/schemas/RequestToPayResult'
              example:
                amount: 100
                currency: UGX
                externalId: 947354
                payer:
                  partyIdType: MSISDN
                  partyId: 4656473839
                status: FAILED
                reason:
                  code: PAYER_NOT_FOUND
                  message: Payee does not exist
            application/json:
              schema:
                $ref: '#/components/schemas/RequestToPayResult'
              example:
                amount: string
                currency: string
                financialTransactionId: string
                externalId: string
                payer:
                  partyIdType: MSISDN
                  partyId: string
                payerMessage: string
                payeeNote: string
                status: PENDING
                reason:
                  code: PAYEE_NOT_FOUND
                  message: string
            Request to pay not found:
              schema:
                $ref: '#/components/schemas/RequestToPayResult'
              examples:
                default:
                  value: 
            Unspecified internal error:
              schema:
                $ref: '#/components/schemas/RequestToPayResult'
              examples:
                default:
                  value: 
        '400':
          description: 'Bad request, e.g. an incorrectly formatted reference id was provided.'
          content:
            Successful request to pay: { }
            Payer not found: { }
            application/json: { }
            Request to pay not found: { }
            Unspecified internal error: { }
        '404':
          description: Resource not found.
          content:
            Request to pay not found:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: RESOURCE_NOT_FOUND
                message: Requested resource was not found.
            Successful request to pay:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              examples:
                default:
                  value: 
            Payer not found:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              examples:
                default:
                  value: 
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: PAYEE_NOT_FOUND
                message: string
            Unspecified internal error:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              examples:
                default:
                  value: 
        '500':
          description: 'Internal Error. Note that if the retrieved request to pay has failed, it will not cause this status to be returned. This status is only returned if the GET request itself fails.'
          content:
            Unspecified internal error:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: INTERNAL_PROCESSING_ERROR
                message: An internal error occurred while processing.
            Successful request to pay:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              examples:
                default:
                  value: 
            Payer not found:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              examples:
                default:
                  value: 
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: PAYEE_NOT_FOUND
                message: string
            Request to pay not found:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              examples:
                default:
                  value: 
  /v2_0/invoice:
    post:
      summary: CreateInvoice
      description: A merchant may use this in order to create an invoice that can be paid by an intended payer via any channel at a later stage.
      operationId: CreateInvoice
      parameters:
        - name: Authorization
          in: header
          description: Bearer Authentication Token generated using CreateAccessToken API Call
          required: true
          schema:
            type: string
        - name: X-Callback-Url
          in: header
          description: PUT Callback URL to send callback to once the invoice is completed.
          schema:
            type: string
        - name: X-Reference-Id
          in: header
          description: Format - UUID. An id to uniquely identify the making of an invoice
          required: true
          schema:
            type: string
        - name: X-Target-Environment
          in: header
          description: The desired target environment to use that is allowed for the API user.
          required: true
          schema:
            type: string
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateInvoice'
            example:
              externalId: string (An external transaction id to tie to the payment.)
              amount: string
              currency: string
              validityDuration: string(The duration that the invoice is valid in seconds.)
              intendedPayer:
                partyIdType: MSISDN
                partyId: string
              payee:
                partyIdType: MSISDN
                partyId: string
              description: string (An optional description of the invoice.)
      responses:
        '202':
          description: Accepted
          content:
            application/json: { }
            ReferenceId already in use: { }
            Unspecified internal error: { }
        '400':
          description: 'Bad request, e.g. invalid data was sent in the request.'
          content:
            application/json: { }
            ReferenceId already in use: { }
            Unspecified internal error: { }
        '409':
          description: 'Conflict, duplicated reference id'
          content:
            ReferenceId already in use:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: RESOURCE_ALREADY_EXIST
                message: Duplicated reference id. Creation of resource failed.
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: PAYEE_NOT_FOUND
                message: string
            Unspecified internal error:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              examples:
                default:
                  value: 
        '500':
          description: Internal Error.
          content:
            Unspecified internal error:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: INTERNAL_PROCESSING_ERROR
                message: An internal error occurred while processing.
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: PAYEE_NOT_FOUND
                message: string
            ReferenceId already in use:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              examples:
                default:
                  value: 
  '/v2_0/invoice/{x-referenceId}':
    get:
      summary: GetInvoiceStatus
      description: This operation is used to get the status of an invoice. X-Reference-Id that was passed in the post is used as reference to the request
      operationId: GetInvoiceStatus
      parameters:
        - name: x-referenceId
          in: path
          description: UUID of transaction to get result. Reference id  used when creating the Invoice.
          required: true
          schema:
            type: string
        - name: Authorization
          in: header
          description: Bearer Authentication Token generated using CreateAccessToken API Call
          required: true
          schema:
            type: string
        - name: X-Target-Environment
          in: header
          description: The identifier of the Wallet Platform system where the transaction shall be processed. This parameter is used to route the request to the Wallet Platform system that will initiate the transaction.
          required: true
          schema:
            type: string
      responses:
        '200':
          description: OK. Note that a  failed CreateInvoice will be returned with this status too. The 'status' of the CreateInvoice can be used to determine the outcome of the request. The 'errorReason' field can be used to retrieve a cause in case of failure.
          content:
            Successful Invoice Created:
              schema:
                $ref: '#/components/schemas/InvoiceResult'
              examples:
                default:
                  value: 
            Payer not found:
              schema:
                $ref: '#/components/schemas/InvoiceResult'
              examples:
                default:
                  value: 
            application/json:
              schema:
                $ref: '#/components/schemas/InvoiceResult'
              example:
                referenceId: string
                externalId: string
                amount: string
                currency: string
                status: CREATED
                paymentReference: string
                invoiceId: string
                expiryDateTime: string
                payeeFirstName: string
                payeeLastName: string
                errorReason:
                  code: PAYEE_NOT_FOUND
                  message: string
                intendedPayer:
                  partyIdType: MSISDN
                  partyId: string
                description: string
            Request to pay not found:
              schema:
                $ref: '#/components/schemas/InvoiceResult'
              examples:
                default:
                  value: 
            Unspecified internal error:
              schema:
                $ref: '#/components/schemas/InvoiceResult'
              examples:
                default:
                  value: 
        '400':
          description: 'Bad request, e.g. an incorrectly formatted reference id was provided.'
          content:
            Successful request to pay: { }
            Payer not found: { }
            application/json: { }
            Request to pay not found: { }
            Unspecified internal error: { }
        '404':
          description: Resource not found.
          content:
            Request to pay not found:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: RESOURCE_NOT_FOUND
                message: Requested resource was not found.
            Successful request to pay:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              examples:
                default:
                  value: 
            Payer not found:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              examples:
                default:
                  value: 
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: PAYEE_NOT_FOUND
                message: string
            Unspecified internal error:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              examples:
                default:
                  value: 
        '500':
          description: Internal Error
          content:
            Unspecified internal error:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: INTERNAL_PROCESSING_ERROR
                message: An internal error occurred while processing.
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: PAYEE_NOT_FOUND
                message: string
            Request to pay not found:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              examples:
                default:
                  value: 
  '/v2_0/invoice/{referenceId}':
    delete:
      summary: CancelInvoice
      description: This operation is used to delete an invoice. The ReferenceId is associated with the invoice to be cancelled
      operationId: CancelInvoice
      parameters:
        - name: referenceId
          in: path
          description: UUID of transaction to get result. An id to uniquely identify the cancelling an Invoice
          required: true
          schema:
            type: string
        - name: Authorization
          in: header
          description: Bearer Authentication Token generated using CreateAccessToken API Call
          required: true
          schema:
            type: string
        - name: X-Target-Environment
          in: header
          description: The identifier of the Wallet Platform system where the transaction shall be processed. The desired target environment to use that is allowed for the API user.
          required: true
          schema:
            type: string
        - name: X-Reference-Id
          in: header
          description: 'Format - UUID. Recource ID of the created request to pay transaction. This ID is used, for example, validating the status of the request. ‘Universal Unique ID’ for the transaction generated using UUID version 4.'
          required: true
          schema:
            type: string
        - name: X-Callback-Url
          in: header
          description: PUT Callback URL to send callback to once the invoice is completed.
          schema:
            type: string
      requestBody:
        content:
          application/json:
            schema:
              properties:
                externalId:
                  type: string
              example:
                externalId: string
            example:
              externalId: string
      responses:
        '200':
          description: OK. Note that a  failed CreateInvoice will be returned with this status too. The 'status' of the CreateInvoice can be used to determine the outcome of the request. The 'errorReason' field can be used to retrieve a cause in case of failure.
          content:
            Successful Invoice Deleted:
              schema:
                properties:
                  externalId:
                    type: string
                    description: An external transaction id to tie to the cancelling of an invoice.
                example:
                  externalId: string (An external transaction id to tie to the payment.)
              examples:
                default:
                  value: 
            Payer not found:
              schema:
                $ref: '#/components/schemas/InvoiceResult'
              examples:
                default:
                  value: 
            application/json:
              schema:
                properties:
                  externalId:
                    type: string
                    description: An external transaction id to tie to the cancelling of an invoice.
                example:
                  externalId: string (An external transaction id to tie to the payment.)
              example:
                externalId: string (An external transaction id to tie to the payment.)
        '400':
          description: 'Bad request, e.g. an incorrectly formatted reference id was provided.'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: PAYEE_NOT_FOUND
                message: string
        '404':
          description: Resource not found.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: PAYEE_NOT_FOUND
                message: string
            Unspecified internal error:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              examples:
                default:
                  value: 
        '500':
          description: 'Internal Error. Note that if the retrieved request to pay has failed, it will not cause this status to be returned. This status is only returned if the GET request itself fails.'
          content:
            Unspecified internal error:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: INTERNAL_PROCESSING_ERROR
                message: An internal error occurred while processing.
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: PAYEE_NOT_FOUND
                message: string
  /v2_0/preapproval:
    post:
      summary: PreApproval
      description: Preapproval operation is used to create a pre-approval.
      operationId: PreApproval
      parameters:
        - name: Authorization
          in: header
          description: Bearer Authentication Token generated using CreateAccessToken API Call
          required: true
          schema:
            type: string
        - name: X-Callback-Url
          in: header
          description: PUT Callback URL to send callback to once the invoice is completed.
          schema:
            type: string
        - name: X-Reference-Id
          in: header
          description: Format - UUID. An id to uniquely identify the making of an invoice
          required: true
          schema:
            type: string
        - name: X-Target-Environment
          in: header
          description: The desired target environment to use that is allowed for the API user.
          required: true
          schema:
            type: string
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PreApproval'
            example:
              payer:
                partyIdType: MSISDN
                partyId: string
              payerCurrency: string(The currency code of the sending account. Amount to be paid.)
              payerMessage: string (Message to the end user.)
              validityTime: integer (The time duration in seconds that the pre-approval is valid once it is accepted.)
      responses:
        '202':
          description: Accepted
          content:
            application/json: { }
            ReferenceId already in use: { }
            Unspecified internal error: { }
        '400':
          description: 'Bad request, e.g. invalid data was sent in the request.'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: PAYEE_NOT_FOUND
                message: string
        '409':
          description: 'Conflict, duplicated reference id'
          content:
            ReferenceId already in use:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: RESOURCE_ALREADY_EXIST
                message: Duplicated reference id. Creation of resource failed.
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: PAYEE_NOT_FOUND
                message: string
            Unspecified internal error:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              examples:
                default:
                  value: 
        '500':
          description: Internal Error.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: PAYEE_NOT_FOUND
                message: string
  '/v2_0/preapproval/{referenceId}':
    get:
      summary: GetPreApprovalStatus
      description: This operation is used to get the status of a pre-approval. X-Reference-Id that was passed in the post is used as reference to the request.
      operationId: GetPreApprovalStatus
      parameters:
        - name: referenceId
          in: path
          description: UUID of transaction to get result. Reference id  used when creating the PreApproval.
          required: true
          schema:
            type: string
        - name: Authorization
          in: header
          description: Bearer Authentication Token generated using CreateAccessToken API Call
          required: true
          schema:
            type: string
        - name: X-Target-Environment
          in: header
          description: The identifier of the Wallet Platform system where the transaction shall be processed. This parameter is used to route the request to the Wallet Platform system that will initiate the transaction.
          required: true
          schema:
            type: string
      responses:
        '200':
          description: OK. Note that a  failed CreateInvoice will be returned with this status too. The 'status' of the CreateInvoice can be used to determine the outcome of the request. The 'errorReason' field can be used to retrieve a cause in case of failure.
          content:
            Successful Invoice Created:
              schema:
                $ref: '#/components/schemas/PreApprovalResult'
              examples:
                default:
                  value: 
            Payer not found:
              schema:
                $ref: '#/components/schemas/PreApprovalResult'
              examples:
                default:
                  value: 
            application/json:
              schema:
                $ref: '#/components/schemas/PreApprovalResult'
              example:
                payer:
                  partyIdType: MSISDN
                  partyId: string
                payerCurrency: string
                payerMessage: string
                status: PENDING
                expirationDateTime: 0
                reason:
                  code: PAYEE_NOT_FOUND
                  message: string
        '400':
          description: 'Bad request, e.g. an incorrectly formatted reference id was provided.'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: PAYEE_NOT_FOUND
                message: string
        '404':
          description: Resource not found.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: PAYEE_NOT_FOUND
                message: string
            Unspecified internal error:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              examples:
                default:
                  value: 
        '500':
          description: 'Internal Error. Note that if the retrieved request to pay has failed, it will not cause this status to be returned. This status is only returned if the GET request itself fails.'
          content:
            Unspecified internal error:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: INTERNAL_PROCESSING_ERROR
                message: An internal error occurred while processing.
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: PAYEE_NOT_FOUND
                message: string
  /v2_0/payment:
    post:
      summary: CreatePayments
      description: Making it possible to perform payments via the partner gateway. This may be used to pay for external bills or to perform air-time top-ups.
      operationId: CreatePayments
      parameters:
        - name: Authorization
          in: header
          description: Bearer Authentication Token generated using CreateAccessToken API Call
          required: true
          schema:
            type: string
        - name: X-Callback-Url
          in: header
          description: PUT Callback URL to send callback to once the invoice is completed.
          schema:
            type: string
        - name: X-Reference-Id
          in: header
          description: Format - UUID. An id to uniquely identify the making of an invoice
          required: true
          schema:
            type: string
        - name: X-Target-Environment
          in: header
          description: The desired target environment to use that is allowed for the API user.
          required: true
          schema:
            type: string
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreatePayments'
            example:
              externalTransactionId: string (An external transaction id to tie to the payment.)
              money:
                amount: string
                currency: string
              customerReference: String(661551442)
              serviceProviderUserName: String
      responses:
        '202':
          description: Accepted
          content:
            application/json: { }
            ReferenceId already in use: { }
            Unspecified internal error: { }
        '400':
          description: 'Bad request, e.g. invalid data was sent in the request.'
          content:
            application/json: { }
            ReferenceId already in use: { }
            Unspecified internal error: { }
        '409':
          description: 'Conflict, duplicated reference id'
          content:
            ReferenceId already in use:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: RESOURCE_ALREADY_EXIST
                message: Duplicated reference id. Creation of resource failed.
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: PAYEE_NOT_FOUND
                message: string
            Unspecified internal error:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              examples:
                default:
                  value: 
        '500':
          description: Internal Error.
          content:
            Unspecified internal error:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: INTERNAL_PROCESSING_ERROR
                message: An internal error occurred while processing.
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: PAYEE_NOT_FOUND
                message: string
            ReferenceId already in use:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              examples:
                default:
                  value: 
  '/v2_0/payment/{x-referenceId}':
    get:
      summary: GetPaymentStatus
      description: This operation is used to get the status of a Payment. X-Reference-Id that was passed in the post is used as reference to the request
      operationId: GetPaymentStatus
      parameters:
        - name: x-referenceId
          in: path
          description: UUID of transaction to get result. Reference id  used when creating the Payment.
          required: true
          schema:
            type: string
        - name: Authorization
          in: header
          description: Bearer Authentication Token generated using CreateAccessToken API Call
          required: true
          schema:
            type: string
        - name: X-Target-Environment
          in: header
          description: The identifier of the Wallet Platform system where the transaction shall be processed. This parameter is used to route the request to the Wallet Platform system that will initiate the transaction.
          required: true
          schema:
            type: string
      responses:
        '200':
          description: OK. Note that a  failed CreateInvoice will be returned with this status too. The 'status' of the CreateInvoice can be used to determine the outcome of the request. The 'errorReason' field can be used to retrieve a cause in case of failure.
          content:
            Successful Payment Created:
              schema:
                $ref: '#/components/schemas/PaymentResult'
              examples:
                default:
                  value: 
            Payer not found:
              schema:
                $ref: '#/components/schemas/PaymentResult'
              examples:
                default:
                  value: 
            application/json:
              schema:
                $ref: '#/components/schemas/PaymentResult'
              example:
                referenceId: string
                status: CREATED
                financialTransactionId: string
                reason:
                  code: PAYEE_NOT_FOUND
            Payment not found:
              schema:
                $ref: '#/components/schemas/PaymentResult'
              examples:
                default:
                  value: 
            Unspecified internal error:
              schema:
                $ref: '#/components/schemas/PaymentResult'
              examples:
                default:
                  value: 
        '400':
          description: 'Bad request, e.g. an incorrectly formatted reference id was provided.'
          content:
            Successful request to pay: { }
            Payer not found: { }
            application/json: { }
            Request to pay not found: { }
            Unspecified internal error: { }
        '404':
          description: Resource not found.
          content:
            Request to pay not found:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: RESOURCE_NOT_FOUND
                message: Requested resource was not found.
            Successful request to pay:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              examples:
                default:
                  value: 
            Payer not found:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              examples:
                default:
                  value: 
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: PAYEE_NOT_FOUND
                message: string
            Unspecified internal error:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              examples:
                default:
                  value: 
        '500':
          description: 'Internal Error. Note that if the retrieved request to pay has failed, it will not cause this status to be returned. This status is only returned if the GET request itself fails.'
          content:
            Unspecified internal error:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: INTERNAL_PROCESSING_ERROR
                message: An internal error occurred while processing.
            Successful request to pay:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              examples:
                default:
                  value: 
            Payer not found:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              examples:
                default:
                  value: 
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: PAYEE_NOT_FOUND
                message: string
            Request to pay not found:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              examples:
                default:
                  value: 
  /oauth2/token/:
    post:
      summary: CreateOauth2Token
      description: This operation is used to claim a consent by the account holder for the requested scopes.
      operationId: CreateOauth2Token
      parameters:
        - name: Authorization
          in: header
          description: Basic authentication header containing API user ID and API key. Should be sent in as B64 encoded.
          required: true
          schema:
            type: string
        - name: X-Target-Environment
          in: header
          description: The identifier of the Wallet Platform system where the transaction shall be processed. This parameter is used to route the request to the Wallet Platform system that will initiate the transaction.
          required: true
          schema:
            type: string
      requestBody:
        content:
          application/x-www-form-urlencoded:
            schema:
              properties:
                grant_type:
                  type: string
                auth_req_id:
                  type: string
                refresh_token:
                  type: string
            example: 'grant_type=urn:openid:params:grant-type:ciba&auth_req_id={auth_req_id}'
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/oauth2TokenResponse'
              example:
                access_token: string
                token_type: string
                expires_in: 0
                scope: string
                refresh_token: string
                refresh_token_expired_in: 0
  /oauth2/v1_0/userinfo:
    get:
      summary: GetUserInfoWithConsent
      description: This operation is used to claim a consent by the account holder for the requested scopes.
      operationId: GetUserInfoWithConsent
      parameters:
        - name: Authorization
          in: header
          description: Bearer Token. Replace with a valid oauth2 token received from oauth2 token endpoint in Wallet Platform.
          required: true
          schema:
            type: string
        - name: X-Target-Environment
          in: header
          description: The identifier of the Wallet Platform system where the transaction shall be processed. This parameter is used to route the request to the Wallet Platform system that will initiate the transaction.
          required: true
          schema:
            type: string
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/consentkycResponse'
              example:
                sub: string
                name: string
                given_name: string
                family_name: string
                middle_name: string
                email: string
                email_verified: true
                gender: string
                locale: string
                phone_number: string
                phone_number_verified: true
                address: string
                updated_at: 0
                status: string
                birthdate: string
                credit_score: string
                active: true
                country_of_birth: string
                region_of_birth: string
                city_of_birth: string
                occupation: string
                employer_name: string
                identification_type: string
                identification_value: string
  /token/:
    post:
      summary: CreateAccessToken
      description: This operation is used to create an access token which can then be used to authorize and authenticate towards the other end-points of the API.
      operationId: CreateAccessToken
      parameters:
        - name: Authorization
          in: header
          description: Basic authentication header containing API user ID and API key. Should be sent in as B64 encoded.
          required: true
          schema:
            type: string
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TokenPost200ApplicationJsonResponse'
              example:
                access_token: string
                token_type: string
                expires_in: 0
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TokenPost401ApplicationJsonResponse'
              example:
                error: string
        '500':
          description: Error
          content:
            application/json: { }
  '/v1_0/preapprovals/{accountHolderIdType}/{accountHolderId}':
    get:
      summary: GetApprovedPreApprovals
      description: 'This operation is used to get approved pre-approvals of an account holder. Only those pre-approvals of account holder, where requesting Account Holder (Service Provider or Merchant) is the payee, are returned.'
      operationId: GetApprovedPreApprovals
      parameters:
        - name: accountHolderIdType
          in: path
          description: "Specifies the type of the accountHolderId.\n\nAllowed values:\nmsisdn\nemail\nid\nalias"
          required: true
          schema:
            enum:
              - msisdn
              - email
              - id
              - alias
            type: string
            default: msisdn
        - name: accountHolderId
          in: path
          description: "The AccountHolderId .\n\nValidated according to the accountHolderIdType:\nmsisdn - Mobile Number. Validated with IsMSISDN.\nemail - E-mail. Validated with IsEmail.\nid - Internal Id of Account Holder. Validated with IsLongString.\nalias - Alias of the party. Validated with IsAlias."
          required: true
          schema:
            type: string
        - name: Authorization
          in: header
          description: Bearer Authentication Token generated using CreateAccessToken API Call
          required: true
          schema:
            type: string
        - name: X-Target-Environment
          in: header
          description: The identifier of the Wallet Platform system where the transaction shall be processed. This parameter is used to route the request to the Wallet Platform system that will initiate the transaction.
          required: true
          schema:
            type: string
      responses:
        '200':
          description: OK. Note that a  failed CreateInvoice will be returned with this status too. The 'status' of the CreateInvoice can be used to determine the outcome of the request. The 'errorReason' field can be used to retrieve a cause in case of failure.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/PreApprovalDetails'
                example:
                  - preApprovalId: string
                    toFri: string
                    fromFri: string
                    fromCurrency: string
                    createdTime: string
                    approvedTime: string
                    expiryTime: string
                    status: string
                    message: string
                    frequency: string
                    startDate: string
                    lastUsedDate: string
                    offer: string
                    externalId: string
                    maxDebitAmount: string
              example:
                - preApprovalId: string
                  toFri: string
                  fromFri: string
                  fromCurrency: string
                  createdTime: string
                  approvedTime: string
                  expiryTime: string
                  status: string
                  message: string
                  frequency: string
                  startDate: string
                  lastUsedDate: string
                  offer: string
                  externalId: string
                  maxDebitAmount: string
        '400':
          description: 'Bad request, e.g. an incorrectly formatted reference id was provided.'
        '404':
          description: Resource not found.
        '500':
          description: 'Internal Error. Note that if the retrieved request to pay has failed, it will not cause this status to be returned. This status is only returned if the GET request itself fails.'
          content:
            Unspecified internal error:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: INTERNAL_PROCESSING_ERROR
                message: An internal error occurred while processing.
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: PAYEE_NOT_FOUND
                message: string
  '/v1_0/preapproval/{preapprovalid}':
    delete:
      summary: CancelPreApproval
      description: This operation is used to cancel a pre-approval. It is possible to cancel only that preapproval which is in approved state and the requesting Account Holder (Service Provider or Merchant) is the payee
      operationId: CancelPreApproval
      parameters:
        - name: preapprovalid
          in: path
          description: UUID of transaction to get result. Reference id  used when creating the PreApproval.
          required: true
          schema:
            type: string
        - name: Authorization
          in: header
          description: Bearer Authentication Token generated using CreateAccessToken API Call
          required: true
          schema:
            type: string
        - name: X-Target-Environment
          in: header
          description: The identifier of the Wallet Platform system where the transaction shall be processed. This parameter is used to route the request to the Wallet Platform system that will initiate the transaction.
          required: true
          schema:
            type: string
      responses:
        '200':
          description: OK.
        '400':
          description: 'Bad request, e.g. an incorrectly formatted reference id was provided.'
        '404':
          description: Resource not found.
        '500':
          description: 'Internal Error. Note that if the retrieved request to pay has failed, it will not cause this status to be returned. This status is only returned if the GET request itself fails.'
          content:
            Unspecified internal error:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: INTERNAL_PROCESSING_ERROR
                message: An internal error occurred while processing.
            Successful request to pay:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              examples:
                default:
                  value: 
            Payer not found:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              examples:
                default:
                  value: 
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              example:
                code: PAYEE_NOT_FOUND
                message: string
            Request to pay not found:
              schema:
                $ref: '#/components/schemas/ErrorReason'
              examples:
                default:
                  value: 
components:
  schemas:
    BasicUserInfoJsonResponse:
      type: object
      properties:
        given_name:
          type: string
          description: 'Given name(s) or first name(s) of the End-User. Note that in some cultures, people can have multiple given names; all can be present, with the names being separated by space characters.'
        family_name:
          type: string
          description: 'Surname(s) or last name(s) of the End-User. Note that in some cultures, people can have multiple family names or no family name; all can be present, with the names being separated by space characters.'
        birthdate:
          type: string
          description: Account holder birth date.
        locale:
          type: string
          description: 'End-User''s locale, represented as a  BCP47 [RFC5646] language tag. This is typically an  ISO 639-1 Alpha-2 [ISO639�|�1] language code in lowercase and an  ISO 3166-1 Alpha-2 [ISO3166�|�1] country code in uppercase, separated by a dash. For example,  en-US or  fr-CA. As a compatibility note, some implementations have used an underscore as the separator rather than a dash, for example,  en_US; Relying Parties may choose to accept this locale syntax as well.'
        gender:
          type: string
          description: End-User's gender. Values defined by this specification are female and male. Other values may be used when neither of the defined values are applicable.
        status:
          type: string
          description: Accountholder status.
    bcauthorize:
      type: object
      properties:
        scope:
          type: string
          description: Space separated list of scopes.
        login_hint:
          type: string
          description: The identity of the account holder.
        access_type:
          enum:
            - online
            - offline
          type: string
          description: 'Value either online, or offline.'
        consent_valid_in:
          type: integer
          description: The validity time of the consent in secondsThis parameter can only be used together with access type offline.
        client_notification_token:
          type: string
          description: This token is required when the client is using Ping or Push mode.
        scope_instruction:
          type: string
          description: Base64 encoded Instrcution of the financial transaction.
    bcauthorizeResponse:
      type: object
      properties:
        auth_req_id:
          type: string
          description: Authentication request ID as an UUID.
        interval:
          type: number
          description: Indicates how long time the client should wait between retries towards the endpoint /oauth2/token.
        expires_in:
          type: number
          description: 'Shows when the authentication request ID expires, in seconds.'
    TokenPost200ApplicationJsonResponse:
      type: object
      properties:
        access_token:
          type: string
          description: A JWT token which can be used to authrize against the other API end-points. The format of the token follows the JWT standard format (see jwt.io for an example). This is the token that should be sent in in the Authorization header when calling the other API end-points.
        token_type:
          type: string
          description: The token type.
        expires_in:
          type: integer
          description: The validity time in seconds of the token.
    oauth2TokenRequest:
      type: object
      properties:
        grant_type:
          type: string
          description: Value can be either "urn:openid:params:grant-type:ciba" or "refresh_token"
        auth_req_id:
          type: string
          description: Authentication request ID.Value is only mandatory if grant_type is "urn:openid:params:grant-type:ciba"
        refresh_token:
          type: string
          description: UUID.Refresh token retrieved from oauth2 token endpoint for consents with grant_type offline. This parameter is only valid if grant_type is refresh_token.
    oauth2TokenResponse:
      type: object
      properties:
        access_token:
          type: string
          description: Oauth2 JWT access token.The generated token is valid 3600 seconds as default.
        token_type:
          type: string
          description: Value is Bearer
        expires_in:
          type: number
          description: 'Shows when the authentication request ID expires, in seconds.'
        scope:
          type: string
          description: List of scopes that belongs to the authentication request ID.
        refresh_token:
          type: string
          description: UUID of the refresh_token
        refresh_token_expired_in:
          type: integer
          description: 'The time in seconds until the consent can no longer be refreshed. Based on the default value for consent validity, or the value set to parameter consent_valid_in sent in the bc-authorize request.'
    consentkycResponse:
      type: object
      properties:
        sub:
          type: string
          description: Subject - Identifier for the End-User at the Issuer.
        name:
          type: string
          description: End-User's full name in displayable form including all name parts.
        given_name:
          type: string
          description: Given name(s) or first name(s) of the End-User.
        family_name:
          type: string
          description: Surname(s) or last name(s) of the End-User.
        middle_name:
          type: string
          description: Middle name(s) of the End-User.
        email:
          type: string
          description: 'End-User''s preferred e-mail address. Its value MUST conform to the  RFC 5322 [RFC5322] address specification syntax.'
        email_verified:
          type: boolean
          description: The response value is True if the End-User's e-mail address has been verified;otherwise false.
        gender:
          type: string
          description: End-User's gender.
        locale:
          type: string
          description: Preffered language.
        phone_number:
          type: string
          description: End-User's preferred telephone number
        phone_number_verified:
          type: boolean
          description: The response value is True if the End-User's phone number has been verified; otherwise false.
        address:
          type: string
          description: User Address
        updated_at:
          type: number
          description: The time the End-User's information was last updated.
        status:
          type: string
          description: Account holder status.
        birthdate:
          type: string
          description: The birth date of the account holder.
        credit_score:
          type: string
          description: The credit score of the account holder.
        active:
          type: boolean
          description: The status of the account holder.
        country_of_birth:
          type: string
          description: Account holder country of birth.
        region_of_birth:
          type: string
          description: The birth region of the account holder.
        city_of_birth:
          type: string
          description: The city of birth for the account holder.
        occupation:
          type: string
          description: Occupation of the account holder.
        employer_name:
          type: string
          description: The name of the employer.
        identification_type:
          type: string
          description: Type of identification.The first non-expired identification is always chosen.
        identification_value:
          type: string
          description: The value of the identification.
    address:
      type: object
      properties:
        formatted:
          type: string
          description: 'Full mailing address, formatted for display or use on a mailing label. This field may contain multiple lines, separated by newlines.'
        street_address:
          type: string
          description: 'Full street address component, which may include house number, street name, Post Office Box, and multi-line extended street address information.'
        locality:
          type: string
          description: City or locality component.
        region:
          type: string
          description: 'State, province, prefecture, or region component.'
        postal_code:
          type: string
          description: Zip code or postal code component.
        country:
          type: string
          description: Country name component.
    TokenPost401ApplicationJsonResponse:
      type: object
      properties:
        error:
          type: string
          description: An error code.
    Balance:
      type: object
      properties:
        availableBalance:
          type: string
          description: The available balance of the account
        currency:
          type: string
          description: ISO4217 Currency
      description: The available balance of the account
    Party:
      type: object
      properties:
        partyIdType:
          enum:
            - MSISDN
            - EMAIL
            - PARTY_CODE
          type: string
        partyId:
          type: string
      description: 'Party identifies a account holder in the wallet platform. Party consists of two parameters, type and partyId. Each type have its own validation of the partyId<br> MSISDN - Mobile Number validated according to ITU-T E.164. Validated with IsMSISDN<br> EMAIL - Validated to be a valid e-mail format. Validated with IsEmail<br> PARTY_CODE - UUID of the party. Validated with IsUuid'
    RequestToPay:
      type: object
      properties:
        amount:
          type: string
          description: Amount that will be debited from the payer account.
        currency:
          type: string
          description: ISO4217 Currency
        externalId:
          type: string
          description: External id is used as a reference to the transaction. External id is used for reconciliation. The external id will be included in transaction history report. <br>External id is not required to be unique.
        payer:
          $ref: '#/components/schemas/Party'
        payerMessage:
          type: string
          description: Message that will be written in the payer transaction history message field.
        payeeNote:
          type: string
          description: Message that will be written in the payee transaction history note field.
    RequestToPayResult:
      type: object
      properties:
        amount:
          type: string
          description: Amount that will be debited from the payer account.
        currency:
          type: string
          description: ISO4217 Currency
        financialTransactionId:
          type: string
          description: Financial transactionIdd from mobile money manager.<br> Used to connect to the specific financial transaction made in the account
        externalId:
          type: string
          description: External id provided in the creation of the requestToPay transaction.
        payer:
          $ref: '#/components/schemas/Party'
        payerMessage:
          type: string
          description: Message that will be written in the payer transaction history message field.
        payeeNote:
          type: string
          description: Message that will be written in the payee transaction history note field.
        status:
          enum:
            - PENDING
            - SUCCESSFUL
            - FAILED
          type: string
        reason:
          $ref: '#/components/schemas/ErrorReason'
    Transfer:
      type: object
      properties:
        amount:
          type: string
          description: Amount that will be debited from the payer account.
        currency:
          type: string
          description: ISO4217 Currency
        externalId:
          type: string
          description: External id is used as a reference to the transaction. External id is used for reconciliation. The external id will be included in transaction history report. <br>External id is not required to be unique.
        payee:
          $ref: '#/components/schemas/Party'
        payerMessage:
          type: string
          description: Message that will be written in the payer transaction history message field.
        payeeNote:
          type: string
          description: Message that will be written in the payee transaction history note field.
    TransferResult:
      type: object
      properties:
        amount:
          type: string
          description: Amount that will be debited from the payer account.
        currency:
          type: string
          description: ISO4217 Currency
        financialTransactionId:
          type: string
          description: Financial transactionIdd from mobile money manager.<br> Used to connect to the specific financial transaction made in the account
        externalId:
          type: string
          description: External id is used as a reference to the transaction. External id is used for reconciliation. The external id will be included in transaction history report. <br>External id is not required to be unique.
        payee:
          $ref: '#/components/schemas/Party'
        payerMessage:
          type: string
          description: Message that will be written in the payer transaction history message field.
        payeeNote:
          type: string
          description: Message that will be written in the payee transaction history note field.
        status:
          enum:
            - PENDING
            - SUCCESSFUL
            - FAILED
          type: string
        reason:
          $ref: '#/components/schemas/ErrorReason'
    deliverynotification:
      type: object
      properties:
        notificationMessage:
          type: string
    PreApproval:
      type: object
      properties:
        payer:
          $ref: '#/components/schemas/Party'
        payerCurrency:
          type: string
          description: ISO4217 Currency
        payerMessage:
          type: string
          description: The mesage that is shown to the approver.
        validityTime:
          type: integer
          description: The request validity time of the pre-approval
    PreApprovalResult:
      type: object
      properties:
        payer:
          $ref: '#/components/schemas/Party'
        payerCurrency:
          type: string
          description: ISO4217 Currency
        payerMessage:
          type: string
          description: The mesage that is shown to the approver.
        status:
          enum:
            - PENDING
            - SUCCESSFUL
            - FAILED
          type: string
        expirationDateTime:
          type: integer
          description: 'The expiry date +time of the preapproval, in YYYY-MM-DDTHH:mm:SS format'
        reason:
          $ref: '#/components/schemas/ErrorReason'
    CreateInvoice:
      type: object
      properties:
        externalId:
          type: string
          description: External id is used as a reference to the transaction. External id is used for reconciliation. The external id will be included in transaction history report. <br>External id is not required to be unique.
        amount:
          type: string
          description: Amount that will be debited from the payer account.
        currency:
          type: string
          description: ISO4217 Currency
        validityDuration:
          type: string
          description: ValidityTime - The duration that the invoice is valid in seconds.
        intendedPayer:
          $ref: '#/components/schemas/Party'
        payee:
          $ref: '#/components/schemas/Party'
        description:
          type: string
          description: Message that will be written in the payer transaction history message field.
    InvoiceResult:
      type: object
      properties:
        referenceId:
          type: string
          description: The reference id for this invoice.
        externalId:
          type: string
          description: An external transaction id to tie to the payment.
        amount:
          type: string
          description: A positive amount for this invoice.
        currency:
          type: string
          description: ISO4217 Currency - The currency used in this invoice.
        status:
          enum:
            - CREATED
            - PENDING
            - SUCCESSFUL
            - FAILED
          type: string
        paymentReference:
          type: string
          description: A unique id that identifies a pending invoice.
        invoiceId:
          type: string
          description: An id for the invoice.
        expiryDateTime:
          type: string
          description: 'DateTime for when invoice expires, in YYYY-MM-DD:THH:mm:ss format.'
        payeeFirstName:
          type: string
          description: First name of the payee in this invoice.
        payeeLastName:
          type: string
          description: Surname of the payee in this invoice
        errorReason:
          $ref: '#/components/schemas/ErrorReason'
        intendedPayer:
          $ref: '#/components/schemas/Party'
        description:
          type: string
          description: An optional description of the invoice.
    Money:
      type: object
      properties:
        amount:
          type: string
          description: A positive amount
        currency:
          type: string
          description: Currency in ISO4217 format
    CreatePayments:
      type: object
      properties:
        externalTransactionId:
          type: string
          description: An external transaction id to tie to the payment.
        money:
          $ref: '#/components/schemas/Money'
        customerReference:
          type: string
          description: 'A customer reference for a provider. Example: +46070911111'
        serviceProviderUserName:
          type: string
          description: 'A service provider name. Example: Electricity Inc.'
        couponId:
          type: string
          description: A coupon the user would like to redeem and use the reward as part of this payment.
        productId:
          type: string
          description: 'Optional id of a product, used if paying for a product.'
        productOfferingId:
          type: string
          description: 'Optional id of a product offering, used when paying for a particular offering of a product.'
        receiverMessage:
          type: string
          description: A descriptive note for receiver transaction history.
        senderNote:
          type: string
          description: A descriptive note for sender transaction history.
        maxNumberOfRetries:
          type: integer
          description: maxNumberOfRetries
        includeSenderCharges:
          type: boolean
          description: 'Specifies if sender charges, this is, fee and tax paid by the sender, should be included in the specified transaction amount. This means that the charges will be deducted from the transaction amount before the remaining amount is transferred to the receiver.True indicates that charges shall be included in the specified transaction amount. The default value is false, meaning that sender charges are charged on top of the transaction amount.'
    PaymentResult:
      type: object
      properties:
        referenceId:
          type: string
          description: The reference id for this Payment.
        status:
          enum:
            - CREATED
            - PENDING
            - SUCCESSFUL
            - FAILED
          type: string
        financialTransactionId:
          type: string
          description: A transaction id associated with this payment.
        reason:
          $ref: '#/components/schemas/ErrorReason'
    PreApprovalDetails:
      required:
        - preApprovalId
        - toFri
        - fromFri
        - fromCurrency
        - createdTime
        - status
        - message
      type: object
      properties:
        preApprovalId:
          type: string
          description: The ID of the pre-approval. Parameter cannot be NULL.
        toFri:
          type: string
          description: The Financial Resource Identifier of the receiving account.
        fromFri:
          type: string
          description: The Financial Resource Identifier of the sending account.
        fromCurrency:
          type: string
          description: The currency of the account holder from where the debit happens. ISO4217 Currency
        createdTime:
          type: string
          description: The date and time at which the pre-approval was created. Validated with IsIso8601DateTime. Parameter can not be NULL
        approvedTime:
          type: string
          description: The date and time at which the pre-approval was approved. Validated with IsIso8601DateTime. Parameter can not be NULL.
        expiryTime:
          type: string
          description: The date and time at which the pre-approval expires. Validated with IsIso8601DateTime. Parameter can not be NULL.
        status:
          enum:
            - APPROVED
            - CANCELLED
            - EXPIRED
            - REJECTED
            - PENDING
          type: string
        message:
          type: string
          description: Message. Validated with IsRestirctedString. Parameter can not be NULL.
        frequency:
          enum:
            - DAILY
            - MONTHLY
            - WEEKLY
          type: string
        startDate:
          type: string
          description: The start date of the pre-approval. Validated with IsDateString. Parameter can not be NULL.
        lastUsedDate:
          type: string
          description: The date pre-approval was used last. Validated with IsIso8601DateTime. Parameter can not be NULL.
        offer:
          type: string
          description: The offer description. Validated with IsRestrictedString. Parameter can not be NULL.
        externalId:
          type: string
          description: The external reference id. Validated with IsExternalReferenceString. Parameter can not be NULL.
        maxDebitAmount:
          type: string
          description: The max debit amount allowed. Contains a non-negative amount. Validated with IsAmount.
      example:
        preApprovalId: string
        toFri: string
        fromFri: string
        fromCurrency: string
        createdTime: string
        approvedTime: string
        expiryTime: string
        status: string
        message: string
        frequency: string
        startDate: string
        lastUsedDate: string
        offer: string
        externalId: string
        maxDebitAmount: string
    ErrorReason:
      type: object
      properties:
        code:
          enum:
            - PAYEE_NOT_FOUND
            - PAYER_NOT_FOUND
            - NOT_ALLOWED
            - NOT_ALLOWED_TARGET_ENVIRONMENT
            - INVALID_CALLBACK_URL_HOST
            - INVALID_CURRENCY
            - SERVICE_UNAVAILABLE
            - INTERNAL_PROCESSING_ERROR
            - NOT_ENOUGH_FUNDS
            - PAYER_LIMIT_REACHED
            - PAYEE_NOT_ALLOWED_TO_RECEIVE
            - PAYMENT_NOT_APPROVED
            - RESOURCE_NOT_FOUND
            - APPROVAL_REJECTED
            - EXPIRED
            - TRANSACTION_CANCELED
            - RESOURCE_ALREADY_EXIST
          type: string
        message:
          type: string
    BooleanResult:
      type: object
      properties:
        result:
          type: boolean
  securitySchemes:
    apiKeyHeader:
      type: apiKey
      name: Ocp-Apim-Subscription-Key
      in: header
    apiKeyQuery:
      type: apiKey
      name: subscription-key
      in: query
security:
  - apiKeyHeader: [ ]
  - apiKeyQuery: [ ]