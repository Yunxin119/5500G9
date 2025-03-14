# Current API reference for backend developmenbt

### Endpoints:

1. **POST /register**
   - **PUBLIC**: Register a new user account.

2. **POST /login**
   - **PUBLIC**: Log in an existing user and receive an authentication token.

3. **GET /profile/:id**
   - **PRIVATE**: Retrieve the authenticated user's profile information.

4. **PUT /profile/:id**
   - **PRIVATE**: Update the authenticated user’s profile information.

5. **GET /profile/:id**
   - **PRIVATE**