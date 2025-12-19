# Alumni Connect Backend - Postman API Testing Guide


## 1. STUDENT ENDPOINTS

### 1.1 Student Signup
**POST** `{{BASE_URL}}/api/v1/student/signup`

**Headers:** Content-Type: application/json

**Body (JSON):**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.student@example.com",
  "password": "password123",
  "collegeName": "MIT College"
}
```

**Response:** Save `token` and `user._id` to environment

---

### 1.2 Student Login
**POST** `{{BASE_URL}}/api/v1/student/login`

**Headers:** Content-Type: application/json

**Body (JSON):**
```json
{
  "email": "john.student@example.com",
  "password": "password123"
}
```

**Response:** Save `token` to environment

---

### 1.3 Update Student Profile
**PUT** `{{BASE_URL}}/api/v1/student/profile`

**Headers:**
- Content-Type: application/json
- Authorization: Bearer {{TOKEN}}

**Body (JSON):**
```json
{
  "branch": "Computer Science",
  "graduationYear": 2025,
  "skills": ["JavaScript", "React", "Node.js", "MongoDB"],
  "projects": [
    {
      "title": "E-commerce Platform",
      "description": "Built a full-stack e-commerce application",
      "link": "https://github.com/john/ecommerce"
    }
  ],
  "certifications": [
    {
      "name": "AWS Certified Developer",
      "issuer": "Amazon",
      "date": "2024-06-15"
    }
  ],
  "preferredRoles": ["Full Stack Developer", "Backend Developer"]
}
```

---

### 1.4 Get Student Profile
**GET** `{{BASE_URL}}/api/v1/student/profile`

**Headers:**
- Authorization: Bearer {{TOKEN}}

---

### 1.5 Get Profile Status
**GET** `{{BASE_URL}}/api/v1/student/profile/status`

**Headers:**
- Authorization: Bearer {{TOKEN}}

---

### 1.6 Upload Resume (First Time)
**POST** `{{BASE_URL}}/api/v1/student/resume/upload`

**Headers:**
- Authorization: Bearer {{TOKEN}}

**Body (form-data):**
- Key: `resume`
- Type: File
- Value: [Select your PDF file]

---

### 1.7 Update Resume
**PUT** `{{BASE_URL}}/api/v1/student/resume/update`

**Headers:**
- Authorization: Bearer {{TOKEN}}

**Body (form-data):**
- Key: `resume`
- Type: File
- Value: [Select your PDF file]

---

### 1.8 Get Resume Details
**GET** `{{BASE_URL}}/api/v1/student/resume`

**Headers:**
- Authorization: Bearer {{TOKEN}}

---

### 1.9 Delete Resume
**DELETE** `{{BASE_URL}}/api/v1/student/resume`

**Headers:**
- Authorization: Bearer {{TOKEN}}

---

## 2. ALUMNI ENDPOINTS

### 2.1 Alumni Signup
**POST** `{{BASE_URL}}/api/v1/alumni/signup`

**Headers:** Content-Type: application/json

**Body (JSON):**
```json
{
  "firstName": "Sarah",
  "lastName": "Smith",
  "email": "sarah.alumni@example.com",
  "password": "password123",
  "collegeName": "MIT College",
  "company": "Google",
  "jobTitle": "Senior Software Engineer"
}
```

**Response:** Save `token` and `user._id` to environment

---

### 2.2 Alumni Login
**POST** `{{BASE_URL}}/api/v1/alumni/login`

**Headers:** Content-Type: application/json

**Body (JSON):**
```json
{
  "email": "sarah.alumni@example.com",
  "password": "password123"
}
```

**Response:** Save `token` to environment

---

### 2.3 Update Alumni Profile
**PUT** `{{BASE_URL}}/api/v1/alumni/profile`

**Headers:**
- Content-Type: application/json
- Authorization: Bearer {{TOKEN}}

**Body (JSON):**
```json
{
  "company": "Google",
  "jobTitle": "Senior Software Engineer",
  "yearsOfExperience": 5,
  "skills": ["JavaScript", "Python", "React", "Node.js", "System Design"],
  "referralPreferences": "Looking for candidates with strong technical skills and cultural fit. Prefer candidates with at least 1 year of experience in web development."
}
```

---

### 2.4 Get Alumni Profile
**GET** `{{BASE_URL}}/api/v1/alumni/profile`

**Headers:**
- Authorization: Bearer {{TOKEN}}

---

### 2.5 Get Alumni Data
**GET** `{{BASE_URL}}/api/v1/alumni/me`

**Headers:**
- Authorization: Bearer {{TOKEN}}

---

## 3. OPPORTUNITY MANAGEMENT (Alumni Only)

### 3.1 Create Referral Opportunity
**POST** `{{BASE_URL}}/api/v1/opportunities/create`

**Headers:**
- Content-Type: application/json
- Authorization: Bearer {{TOKEN}}

**Body (JSON):**
```json
{
  "jobTitle": "Full Stack Developer",
  "roleDescription": "We are looking for a talented full-stack developer to join our team. You will work on building scalable web applications using modern technologies.",
  "requiredSkills": ["JavaScript", "React", "Node.js", "MongoDB"],
  "experienceLevel": "0-2 years",
  "numberOfReferrals": 3
}
```

**Valid Experience Levels:**
- "Fresher"
- "0-2 years"
- "2-5 years"
- "5+ years"

**Response:** Save `data._id` as `OPPORTUNITY_ID`

---

### 3.2 Update Opportunity
**PUT** `{{BASE_URL}}/api/v1/opportunities/{{OPPORTUNITY_ID}}`

**Headers:**
- Content-Type: application/json
- Authorization: Bearer {{TOKEN}}

**Body (JSON):**
```json
{
  "jobTitle": "Senior Full Stack Developer",
  "numberOfReferrals": 5
}
```

---

### 3.3 Close Opportunity
**DELETE** `{{BASE_URL}}/api/v1/opportunities/{{OPPORTUNITY_ID}}`

**Headers:**
- Authorization: Bearer {{TOKEN}}

---

### 3.4 Get All Opportunities (Same College)
**GET** `{{BASE_URL}}/api/v1/opportunities`

**Headers:**
- Authorization: Bearer {{TOKEN}}

**Note:** Shows only opportunities from your college (works for both Students & Alumni)

---

### 3.5 Get My Posted Opportunities (Alumni Only)
**GET** `{{BASE_URL}}/api/v1/my-opportunities`

**Headers:**
- Authorization: Bearer {{TOKEN}}

---

## 4. APPLICATION MANAGEMENT

### 4.1 View Applications for Opportunity (Alumni Only)
**GET** `{{BASE_URL}}/api/v1/applications/{{OPPORTUNITY_ID}}`

**Headers:**
- Authorization: Bearer {{TOKEN}}

**Response:** Shows all applications grouped by status (Applied, Shortlisted, Referred, Rejected)

---

### 4.2 View Student Profile (Alumni - Same College)
**GET** `{{BASE_URL}}/api/v1/applications/student/{{STUDENT_ID}}`

**Headers:**
- Authorization: Bearer {{TOKEN}}

**Note:** Alumni can view full profile including resume of students from same college

---

### 4.3 Shortlist Student
**POST** `{{BASE_URL}}/api/v1/applications/{{APPLICATION_ID}}/shortlist`

**Headers:**
- Authorization: Bearer {{TOKEN}}

**Body:** None required

---

### 4.4 Mark as Referred
**POST** `{{BASE_URL}}/api/v1/applications/{{APPLICATION_ID}}/refer`

**Headers:**
- Authorization: Bearer {{TOKEN}}

**Body:** None required

**Note:** This confirms that alumni has submitted the referral to their company

---

### 4.5 Reject Application
**POST** `{{BASE_URL}}/api/v1/applications/{{APPLICATION_ID}}/reject`

**Headers:**
- Authorization: Bearer {{TOKEN}}

**Body:** None required

---

## 5. HEALTH CHECK

### 5.1 API Health Check
**GET** `{{BASE_URL}}/`

**Headers:** None

**Response:**
```json
{
  "success": true,
  "message": "Alumni Connect API is running successfully!",
  "timestamp": "2025-12-18T10:30:00.000Z"
}
```

---

## Testing Flow (Recommended Order)

### Phase 1: Setup Users
1. Create Student account (Student Signup)
2. Create Alumni account (Alumni Signup)
3. Login as Student (save token)
4. Login as Alumni (save token)

### Phase 2: Complete Profiles
5. Update Student Profile (with token)
6. Upload Student Resume
7. Check Student Profile Status
8. Update Alumni Profile (with token)

### Phase 3: Opportunity Management
9. Login as Alumni
10. Create Referral Opportunity
11. View All Opportunities (as Student)
12. View All Opportunities (as Alumni)

### Phase 4: Application Review (Future Implementation)
13. Apply to Opportunity (as Student)
14. View Applications (as Alumni)
15. View Student Profile (as Alumni)
16. Shortlist Student
17. Mark as Referred

---

## Common Error Responses

### 400 - Bad Request
```json
{
  "success": false,
  "message": "All Fields are required"
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "message": "Token Missing"
}
```

### 403 - Forbidden
```json
{
  "success": false,
  "message": "You are not authorized to update this opportunity"
}
```

### 404 - Not Found
```json
{
  "success": false,
  "message": "Student not found"
}
```

### 500 - Server Error
```json
{
  "success": false,
  "message": "Failed to create opportunity. Please try again."
}
```

---

## Important Notes

1. **Authentication:** Most endpoints require a valid JWT token in the Authorization header
2. **College Matching:** Students and Alumni from the same college can see each other's opportunities
3. **File Upload:** Resume upload uses `multipart/form-data`, not JSON
4. **Profile Completeness:** Automatically calculated based on filled fields (0-100%)
5. **Status Flow:** Application → Shortlisted → Referred (cannot go backward)
6. **Authorization:** Only opportunity owners can update/delete their opportunities
7. **College Creation:** Automatically creates college if doesn't exist during signup

---

## Postman Collection Structure

```
Alumni Connect API
├── 1. Health Check
├── 2. Student Auth
│   ├── Signup
│   └── Login
├── 3. Student Profile
│   ├── Update Profile
│   ├── Get Profile
│   └── Get Profile Status
├── 4. Student Resume
│   ├── Upload Resume
│   ├── Update Resume
│   ├── Get Resume
│   └── Delete Resume
├── 5. Alumni Auth
│   ├── Signup
│   ├── Login
│   └── Get Alumni Data
├── 6. Alumni Profile
│   ├── Update Profile
│   └── Get Profile
├── 7. Opportunities
│   ├── Create Opportunity
│   ├── Update Opportunity
│   ├── Close Opportunity
│   ├── Get All Opportunities
│   └── Get My Opportunities
└── 8. Applications
    ├── View Applications
    ├── View Student Profile
    ├── Shortlist Student
    ├── Mark as Referred
    └── Reject Application
```

---

## Environment Setup in Postman

1. Create a new Environment called "Alumni Connect Local"
2. Add these variables:
   - `BASE_URL`: http://localhost:4000
   - `TOKEN`: (leave empty, will be set by tests)
   - `STUDENT_ID`: (leave empty)
   - `ALUMNI_ID`: (leave empty)
   - `OPPORTUNITY_ID`: (leave empty)
   - `APPLICATION_ID`: (leave empty)

3. Use this script in the "Tests" tab of login endpoints to auto-save token:
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("TOKEN", jsonData.token);
    if (jsonData.user._id) {
        pm.environment.set("STUDENT_ID", jsonData.user._id);
    }
}
```

---

## Tips for Testing

1. **Start with Health Check** to ensure server is running
2. **Create both Student and Alumni** accounts with the same `collegeName`
3. **Complete profiles** before testing opportunities
4. **Use environment variables** to avoid copying IDs manually
5. **Test authorization** by trying to access protected routes without token
6. **Test validation** by sending incomplete data
7. **Check database** after each operation to verify changes

---

## Support

For issues or questions:
- Check server logs in terminal
- Verify MongoDB connection
- Ensure Cloudinary credentials are set in .env
- Check that all required fields are included in requests
