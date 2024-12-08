---

# Authentication API Documentation

**Base URL:** `http://your-domain.com/auth`

---

## Table of Contents

1. [User Registration (`POST /signup`)](#1-user-registration-post-signup)
2. [User Login (`POST /signin`)](#2-user-login-post-signin)
3. [Token Refresh (`POST /refresh-token`)](#3-token-refresh-post-refresh-token)
4. [Google OAuth Login (`GET /google`)](#4-google-oauth-login-get-google)
5. [Google OAuth Callback (`GET /google/callback`)](#5-google-oauth-callback-get-googlecallback)
6. [Facebook OAuth Login (`GET /facebook`)](#6-facebook-oauth-login-get-facebook)
7. [Facebook OAuth Callback (`GET /facebook/callback`)](#7-facebook-oauth-callback-get-facebookcallback)
8. [Protected Route Example (`GET /protected`)](#8-protected-route-example-get-protected)

---

## 1. User Registration (`POST /signup`)

### Description

Register a new user with email and password.

### Endpoint

```
POST /signup
```

### Request Headers

- `Content-Type: application/json`

### Request Body

```json
{
  "email": "user@example.com",
  "password": "yourpassword",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "1234567890"
}
```

- **email** (string, required): User's email address.
- **password** (string, required): User's password (minimum 8 characters).
- **firstName** (string, required): User's first name.
- **lastName** (string, required): User's last name.
- **phoneNumber** (string, required): User's phone number (digits only).

### Response

#### Success (201 Created)

```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "1234567890",
    "role": "USER",
    "isVerified": false,
    "avatar": null
  }
}
```

- **user**: Object containing the newly registered user's information.

#### Error Responses

- **400 Bad Request**

  ```json
  {
    "error": "Validation error message"
  }
  ```

- **500 Internal Server Error**

  ```json
  {
    "error": "An error occurred during registration."
  }
  ```

### Example Request

```bash
curl -X POST http://your-domain.com/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
        "email": "user@example.com",
        "password": "yourpassword",
        "firstName": "John",
        "lastName": "Doe",
        "phoneNumber": "1234567890"
      }'
```

---

## 2. User Login (`POST /signin`)

### Description

Authenticate a user with email and password.

### Endpoint

```
POST /signin
```

### Request Headers

- `Content-Type: application/json`

### Request Body

```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

- **email** (string, required): User's email address.
- **password** (string, required): User's password.

### Response

#### Success (200 OK)

```json
{
  "accessToken": "your_jwt_access_token",
  "refreshToken": "your_jwt_refresh_token",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "1234567890",
    "role": "USER",
    "isVerified": false,
    "avatar": null
  }
}
```

- **accessToken**: JWT access token for authorization (expires in 15 minutes).
- **refreshToken**: JWT refresh token to obtain new access tokens (expires in 7 days).
- **user**: Object containing the authenticated user's information.

#### Error Responses

- **400 Bad Request**

  ```json
  {
    "error": "Validation error message"
  }
  ```

- **401 Unauthorized**

  ```json
  {
    "error": "Invalid email or password"
  }
  ```

### Example Request

```bash
curl -X POST http://your-domain.com/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
        "email": "user@example.com",
        "password": "yourpassword"
      }'
```

---

## 3. Token Refresh (`POST /refresh-token`)

### Description

Obtain new access and refresh tokens using a valid refresh token.

### Endpoint

```
POST /refresh-token
```

### Request Headers

- `Content-Type: application/json`

### Request Body

```json
{
  "refreshToken": "your_jwt_refresh_token"
}
```

- **refreshToken** (string, required): A valid JWT refresh token.

### Response

#### Success (200 OK)

```json
{
  "accessToken": "new_jwt_access_token",
  "refreshToken": "new_jwt_refresh_token"
}
```

- **accessToken**: New JWT access token (expires in 15 minutes).
- **refreshToken**: New JWT refresh token (expires in 7 days).

#### Error Responses

- **400 Bad Request**

  ```json
  {
    "error": "Validation error message"
  }
  ```

- **401 Unauthorized**

  ```json
  {
    "error": "Invalid or expired refresh token"
  }
  ```

### Example Request

```bash
curl -X POST http://your-domain.com/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
        "refreshToken": "your_jwt_refresh_token"
      }'
```

---

## 4. Google OAuth Login (`GET /google`)

### Description

Initiate the OAuth 2.0 authentication flow with Google.

### Endpoint

```
GET /google
```

### Response

- Redirects the user to Google's OAuth 2.0 authentication page.

### Example Request

Access the following URL in a browser:

```
http://your-domain.com/auth/google
```

---

## 5. Google OAuth Callback (`GET /google/callback`)

### Description

Handle the OAuth 2.0 callback from Google after user authentication.

### Endpoint

```
GET /google/callback
```

### Response

#### Success

- Redirects the user to your client application with `accessToken` and `refreshToken` as URL parameters.

#### Error Responses

- **500 Internal Server Error**

  ```json
  {
    "error": "An error occurred during Google authentication."
  }
  ```

### Notes

- Ensure that the callback URL is registered in your Google API Console under OAuth 2.0 Client IDs.
- Replace `your-client-app-url` in the controller with the actual URL of your client application.

---

## 6. Facebook OAuth Login (`GET /facebook`)

### Description

Initiate the OAuth 2.0 authentication flow with Facebook.

### Endpoint

```
GET /facebook
```

### Response

- Redirects the user to Facebook's OAuth 2.0 authentication page.

### Example Request

Access the following URL in a browser:

```
http://your-domain.com/auth/facebook
```

---

## 7. Facebook OAuth Callback (`GET /facebook/callback`)

### Description

Handle the OAuth 2.0 callback from Facebook after user authentication.

### Endpoint

```
GET /facebook/callback
```

### Response

#### Success

- Redirects the user to your client application with `accessToken` and `refreshToken` as URL parameters.

#### Error Responses

- **500 Internal Server Error**

  ```json
  {
    "error": "An error occurred during Facebook authentication."
  }
  ```

### Notes

- Ensure that the callback URL is registered in your Facebook App under Valid OAuth Redirect URIs.
- Replace `your-client-app-url` in the controller with the actual URL of your client application.

---

## 8. Protected Route Example (`GET /protected`)

### Description

An example of a protected route that requires a valid access token.

### Endpoint

```
GET /protected
```

### Request Headers

- `Authorization: Bearer your_jwt_access_token`

### Response

#### Success (200 OK)

```json
{
  "message": "You have accessed a protected route.",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "1234567890",
    "role": "USER",
    "isVerified": false,
    "avatar": null
  }
}
```

#### Error Responses

- **401 Unauthorized**

  ```json
  {
    "error": "Authorization header missing"
  }
  ```

  or

  ```json
  {
    "error": "Invalid or expired access token"
  }
  ```

### Notes

- This route is an example and may not be implemented in your current code.
- Use the `authenticate` middleware to protect routes.

---

# Authentication and Authorization

- **Access Token**

  - A JWT token used to access protected routes.
  - Expires in 15 minutes.
  - Include it in the `Authorization` header as follows:

    ```
    Authorization: Bearer your_jwt_access_token
    ```

- **Refresh Token**

  - A JWT token used to obtain new access tokens.
  - Expires in 7 days.
  - Should be stored securely (e.g., HTTP-only cookies or secure storage).

# Error Handling

- **400 Bad Request**

  - Occurs when the request body is invalid or missing required fields.
  - Response includes an `error` message detailing the issue.

- **401 Unauthorized**

  - Occurs when authentication fails due to invalid credentials or tokens.
  - Response includes an `error` message.

- **500 Internal Server Error**

  - Occurs when an unexpected error happens on the server.
  - Response includes an `error` message.

# Best Practices

- **Secure Storage of Tokens**

  - Store `accessToken` and `refreshToken` securely.
  - Avoid storing tokens in local storage or insecure cookies.

- **HTTPS**

  - Always use HTTPS in production to secure data in transit.

- **CORS**

  - Configure Cross-Origin Resource Sharing (CORS) policies if your API and frontend are on different domains.

- **Input Validation**

  - The API validates inputs using Joi.
  - Ensure that client-side validation aligns with server-side expectations.

# Environment Variables

Ensure the following environment variables are set:

```env
DATABASE_URL=your_database_url
JWT_ACCESS_TOKEN_SECRET=your_access_token_secret
JWT_REFRESH_TOKEN_SECRET=your_refresh_token_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
```

# Dependencies

The following packages are required:

- express
- prisma
- @prisma/client
- bcryptjs
- jsonwebtoken
- joi
- passport
- passport-google-oauth20
- passport-facebook
- express-async-handler

Install them using:

```bash
npm install express prisma @prisma/client bcryptjs jsonwebtoken joi passport passport-google-oauth20 passport-facebook express-async-handler
```

# Running the Application

1. **Set Up Environment Variables**

   - Create a `.env` file in the root directory.
   - Add all the required environment variables.

2. **Database Migration**

   - Run Prisma migrations to set up the database schema:

     ```bash
     npx prisma migrate dev --name init
     npx prisma generate
     ```

3. **Start the Server**

   - Start the application:

     ```bash
     npm run dev
     ```

     or

     ```bash
     node app.js
     ```

# Additional Notes

- **Social Login**

  - Ensure that your Google and Facebook apps are properly configured.
  - The callback URLs must match those configured in your OAuth app settings.

- **Client Application**

  - Replace `your-client-app-url` in the `socialCallback` method with the actual URL of your client application.
  - Handle the `accessToken` and `refreshToken` received in the query parameters.

- **Security**

  - Regularly update dependencies to patch security vulnerabilities.
  - Consider implementing additional security measures such as rate limiting and input sanitization.

# Conclusion

This documentation provides all the necessary information to interact with your authentication API. Make sure to update any placeholder values (e.g., `your-domain.com`, `your-client-app-url`) with actual values relevant to your deployment. If you have any further questions or need assistance, feel free to ask!

---

Feel free to integrate this documentation into your project's README or API documentation site. Let me know if you need any additional information or further assistance!