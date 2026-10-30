curl -X POST http://localhost:3060/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"janedoe@example.com","password":"password123"}'

{
  "authtoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjUzYTFkNGU1ZjY3ODkwYWJjZGVmMDEyIn0sImlhdCI6MTY5ODU3OTMwMH0.X_1aB2c3d4E5F6G7H8I9J0K1",
  "userName": "Jane",
  "userEmail": "janedoe@example.com"
}
