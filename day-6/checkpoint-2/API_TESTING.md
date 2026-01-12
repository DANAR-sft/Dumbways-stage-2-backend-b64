# API Testing Guide untuk Session-Based Authentication

## Endpoints yang Tersedia

### 1. Registration Supplier

```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "supplier@example.com",
  "username": "suppliertest",
  "password": "password123",
  "name": "Supplier Test",
  "phone": "081234567890",
  "address": "Jalan Supplier No. 123"
}
```

### 2. Login Supplier

```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "username": "testsupplier",
  "password": "password123"
}
```

**Note:** Setelah login berhasil, cookie `supplier_session` akan otomatis disimpan oleh browser.

### 3. Get Profile (Protected)

```bash
GET http://localhost:3000/api/auth/profile
```

**Note:** Memerlukan cookie session yang valid.

### 4. Update Profile (Protected)

```bash
PUT http://localhost:3000/api/auth/profile
Content-Type: application/json

{
  "name": "Updated Supplier Name",
  "phone": "081999888777",
  "address": "Updated Address"
}
```

### 5. Logout

```bash
POST http://localhost:3000/api/auth/logout
```

### 6. Check Session Status

```bash
GET http://localhost:3000/api/auth/check
```

### 7. Upload Product (Protected)

```bash
POST http://localhost:3000/api/products/upload-image
Content-Type: multipart/form-data

Form data:
- name: "Product Name"
- price: 50000
- image: [file]
```

### 8. Get Products (Public dengan Optional Auth)

```bash
GET http://localhost:3000/api/products
```

## Testing dengan cURL

### 1. Login dan Simpan Cookie

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testsupplier", "password": "password123"}' \
  -c cookies.txt
```

### 2. Akses Protected Endpoint dengan Cookie

```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -b cookies.txt
```

### 3. Logout

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt
```

## Testing dengan Postman/Thunder Client

1. **Login**: POST ke `/api/auth/login` dengan credentials
2. **Cookie otomatis tersimpan** di browser/client
3. **Akses protected endpoints** tanpa perlu menambahkan header authorization
4. **Cookie akan expired** setelah 7 hari atau saat logout

## Informasi Session

- **Session Duration**: 7 hari
- **Cookie Name**: `supplier_session`
- **Storage**: Database (tabel Session)
- **Security**: httpOnly, secure (production), sameSite: strict

## Test Account

- **Email**: supplier@test.com
- **Username**: testsupplier
- **Password**: password123

## Error Responses

### 401 Unauthorized

```json
{
  "error": "Session tidak ditemukan. Silakan login terlebih dahulu."
}
```

### 400 Bad Request

```json
{
  "error": "Username dan password wajib diisi"
}
```

### 500 Server Error

```json
{
  "error": "Terjadi kesalahan server"
}
```
