# JobHunter_Group9_TestCases.txt

## Job Application Tracker & Cover Letter Generator Test Documentation

### 1. Frontend Components Testing

#### 1.1 Authentication Components
| Test ID | Test Case | Test Steps | Expected Result | Status |
| --- | --- | --- | --- | --- |
| FE-AUTH-01 | User Registration | 1. Navigate to /register<br>2. Fill required fields (username, email, password)<br>3. Submit form | User account created, redirected to dashboard | PASS |
| FE-AUTH-02 | User Login | 1. Navigate to /login<br>2. Enter valid credentials<br>3. Submit form | User authenticated, redirected to dashboard | PASS |
| FE-AUTH-03 | User Logout | 1. Click logout button in navbar<br>2. Confirm logout | User logged out, redirected to home page | PASS |
| FE-AUTH-04 | Form Validation | 1. Submit form with invalid data<br>2. Observe error messages | Form shows appropriate validation errors | PASS |
| FE-AUTH-05 | Gender Selection | 1. Navigate to /register<br>2. Select different gender options<br>3. Submit form | Selected gender saved correctly to user profile | PASS |

#### 1.2 Cover Letter Generation Components
| Test ID | Test Case | Test Steps | Expected Result | Status |
| --- | --- | --- | --- | --- |
| FE-CL-01 | Resume Upload | 1. Navigate to cover letter page<br>2. Upload PDF/Word resume<br>3. Check if content is extracted | Resume content displayed/stored correctly | PASS |
| FE-CL-02 | Job Description Input | 1. Enter job description in textarea<br>2. Check if content is saved | Job description saved correctly | PASS |
| FE-CL-03 | Cover Letter Generation | 1. Upload resume and enter job description<br>2. Click generate button<br>3. Wait for response | Cover letter generated and displayed | PASS |
| FE-CL-04 | Copy to Clipboard | 1. Generate cover letter<br>2. Click copy button | Content copied to clipboard with success notification | PASS |
| FE-CL-05 | PDF Download | 1. Generate cover letter<br>2. Click download button | Cover letter downloaded as PDF | PASS |
| FE-CL-06 | Job Info Extraction | 1. Enter job description<br>2. Open application modal<br>3. Verify extracted job info | Job details correctly extracted and displayed | FAIL - Inconsistent extraction of deadline information |
| FE-CL-07 | Markdown Rendering | 1. Generate cover letter<br>2. Verify markdown formatting | Properly formatted text with headings and paragraphs | PASS |
| FE-CL-08 | Animation Effects | 1. Open cover letter page<br>2. Verify component animations | Smooth transitions between states | PASS |

#### 1.3 Job Application Tracking Components
| Test ID | Test Case | Test Steps | Expected Result | Status |
| --- | --- | --- | --- | --- |
| FE-JT-01 | Add New Application | 1. Fill company info form<br>2. Submit form | New application added to tracker | PASS |
| FE-JT-02 | View Applications | 1. Navigate to tracker page | List of applications displayed | PASS |
| FE-JT-03 | Update Application Status | 1. Select application<br>2. Change status<br>3. Save changes | Application status updated | PASS |
| FE-JT-04 | Delete Application | 1. Select application<br>2. Click delete button<br>3. Confirm deletion | Application removed from list | PASS |
| FE-JT-05 | Filter Applications | 1. Select status filter<br>2. Verify filtered results | Only applications matching filter displayed | PASS |
| FE-JT-06 | Search Applications | 1. Enter search text<br>2. Verify search results | Only matching applications displayed | PASS |
| FE-JT-07 | Reverse Sort Order | 1. Click reverse toggle switch<br>2. Verify display order | Applications displayed in reversed order | PASS |
| FE-JT-08 | Display Company Logo | 1. Add new application<br>2. Verify logo display | Company logo fetched and displayed | PENDING - Some company logos not loading |

#### 1.4 Profile Components
| Test ID | Test Case | Test Steps | Expected Result | Status |
| --- | --- | --- | --- | --- |
| FE-PF-01 | View Profile | 1. Navigate to profile page<br>2. Verify user information | User info correctly displayed | PASS |
| FE-PF-02 | Edit Profile | 1. Click edit button<br>2. Update fields<br>3. Save changes | Profile information updated | PASS |
| FE-PF-03 | Change Password | 1. Enter new password<br>2. Confirm password<br>3. Save changes | Password changed successfully | PASS |
| FE-PF-04 | Application Statistics | 1. View profile page<br>2. Check application statistics | Correct application statistics displayed | PASS |
| FE-PF-05 | Email Verification | 1. Click verify email button<br>2. Check verification status | Email verification status updated | FAIL - Verification emails not received in some cases |

### 2. Backend API Testing

#### 2.1 User Routes
| Test ID | Test Case | Test Steps | Expected Result | Status |
| --- | --- | --- | --- | --- |
| BE-USER-01 | User Registration | Send POST request to /api/users with valid data | 201 status with user object | PASS |
| BE-USER-02 | User Login | Send POST request to /api/users/login with valid credentials | 200 status with auth token | PASS |
| BE-USER-03 | Get User Profile | Send authenticated GET request to /api/users/:id | 200 status with user data | PASS |
| BE-USER-04 | Update User Profile | Send PUT request to /api/users/:id with updated data | 200 status with updated user data | PASS |
| BE-USER-05 | Delete User | Send DELETE request to /api/users/:id | 200 status with success message | PASS |
| BE-USER-06 | Email Verification | Send GET request to verify-email endpoint with token | 200 status with verification success | PASS |
| BE-USER-07 | Send Verification Email | Send POST request to send-verification-email | 200 status with email sent confirmation | PASS |

#### 2.2 Company Routes
| Test ID | Test Case | Test Steps | Expected Result | Status |
| --- | --- | --- | --- | --- |
| BE-COMP-01 | Create Application | Send POST request to /api/companies with application data | 201 status with company object | PASS |
| BE-COMP-02 | Get User Applications | Send GET request to /api/companies/user/:id | 200 status with applications array | PASS |
| BE-COMP-03 | Update Application | Send PUT request to /api/companies/:id with updated data | 200 status with updated object | PASS |
| BE-COMP-04 | Delete Application | Send DELETE request to /api/companies/:id | 200 status with success message | PASS |
| BE-COMP-05 | Invalid Company ID | Send GET request with invalid company ID | 404 status with error message | PASS |
| BE-COMP-06 | Missing Required Fields | Send POST request with missing fields | 400 status with validation errors | PASS |
| BE-COMP-07 | Date Format Validation | Send POST request with incorrect date format | 400 status with format error | FAIL - Accepts some invalid date formats |

#### 2.3 Cover Letter Generation API
| Test ID | Test Case | Test Steps | Expected Result | Status |
| --- | --- | --- | --- | --- |
| BE-CL-01 | Generate Cover Letter | Send POST request with resume and job description | 200 status with cover letter text | PASS |
| BE-CL-02 | Handle Missing Data | Send POST request without resume or job description | 400 status with error message | PASS |
| BE-CL-03 | API Error Handling | Trigger API error (e.g., by invalid format) | 200 status with fallback cover letter | PASS |
| BE-CL-04 | PDF Processing | Upload PDF and process with extraction | 200 status with extracted text | PASS |
| BE-CL-05 | Word Doc Processing | Upload Word document and process | 200 status with warning about limited extraction | PASS |
| BE-CL-06 | Large File Handling | Upload very large PDF file | 200 status with properly truncated text | PENDING - Need to test with larger files |

#### 2.4 Job Information Extraction API
| Test ID | Test Case | Test Steps | Expected Result | Status |
| --- | --- | --- | --- | --- |
| BE-JI-01 | Extract Job Info | Send POST with job description | 200 status with company, role, city, deadline | PASS |
| BE-JI-02 | Handle Extraction Errors | Send malformed request | 200 status with default values | PASS |
| BE-JI-03 | Extract Partial Info | Send job description with missing fields | 200 status with available fields, null for missing | PASS |
| BE-JI-04 | Date Format Conversion | Send job description with various date formats | 200 status with standardized date format | FAIL - Some date formats not correctly converted |

### 3. Database Operations Testing

#### 3.1 User Document Operations
| Test ID | Test Case | Test Steps | Expected Result | Status |
| --- | --- | --- | --- | --- |
| DB-USER-01 | Create User | Call user creation function | User document created in MongoDB | PASS |
| DB-USER-02 | Update User | Call user update function | User document updated in MongoDB | PASS |
| DB-USER-03 | User-Application Link | Add application to user | Application ID added to user's applications array | PASS |
| DB-USER-04 | Delete User | Call user deletion function | User and associated data removed from MongoDB | PASS |
| DB-USER-05 | Unique Username | Try creating user with existing username | Error thrown, duplicate user not created | PASS |
| DB-USER-06 | Unique Email | Try creating user with existing email | Error thrown, duplicate user not created | PASS |

#### 3.2 Company/Application Document Operations
| Test ID | Test Case | Test Steps | Expected Result | Status |
| --- | --- | --- | --- | --- |
| DB-COMP-01 | Create Application | Call company creation function | Company document created in MongoDB | PASS |
| DB-COMP-02 | Update Application | Call company update function | Company document updated in MongoDB | PASS |
| DB-COMP-03 | Delete Application | Call company deletion function | Company document removed from MongoDB | PASS |
| DB-COMP-04 | Get Applications by User | Query companies by user_id | Return only companies for that user | PASS |
| DB-COMP-05 | Status Filter Query | Query companies by status | Return only companies with specified status | PASS |
| DB-COMP-06 | Date Range Query | Query companies by date range | Return only companies within date range | PENDING - Functionality not fully implemented |

### 4. AI/ML Component Testing

#### 4.1 Cover Letter Generation Quality
| Test ID | Test Case | Test Steps | Expected Result | Status |
| --- | --- | --- | --- | --- |
| AI-CL-01 | Format Verification | Generate cover letter and check structure | Properly formatted with sections and markdown | PASS |
| AI-CL-02 | Content Relevance | Generate cover letter and review content | Content matches resume skills and job requirements | PASS |
| AI-CL-03 | Token Limits | Submit very long resume and job description | Content properly truncated before API call | PASS |
| AI-CL-04 | API Fallback | Simulate API failure and check response | Fallback cover letter template provided | PASS |
| AI-CL-05 | Response Consistency | Generate multiple cover letters for same inputs | Consistent quality and structure across generations | FAIL - Some inconsistency in structure |

#### 4.2 Job Information Extraction
| Test ID | Test Case | Test Steps | Expected Result | Status |
| --- | --- | --- | --- | --- |
| AI-JI-01 | Extract Complete Info | Submit job posting with all details | Correctly extracts company, role, city, deadline | PASS |
| AI-JI-02 | Extract Partial Info | Submit job posting with missing details | Correctly extracts available info, nulls for missing | PASS |
| AI-JI-03 | Date Format Handling | Submit various date formats | Correctly normalizes to MM/DD/YYYY format | PASS |
| AI-JI-04 | Company Name Accuracy | Test with various job descriptions | Company name extracted with high accuracy | PASS |
| AI-JI-05 | Remote Location Detection | Test with remote job postings | Correctly identifies "Remote" as location | FAIL - Sometimes returns city name instead of "Remote" |

### 5. Integration Testing

#### 5.1 End-to-End Workflows
| Test ID | Test Case | Test Steps | Expected Result | Status |
| --- | --- | --- | --- | --- |
| INT-01 | Cover Letter Generation Flow | 1. Login<br>2. Navigate to cover letter page<br>3. Upload resume<br>4. Enter job description<br>5. Generate cover letter<br>6. Download PDF | Complete workflow executes without errors | PASS |
| INT-02 | Job Application Tracking Flow | 1. Login<br>2. Generate cover letter<br>3. Extract job info<br>4. Add to application tracker<br>5. View in tracker list | Application appears in tracker with correct info | PASS |
| INT-03 | Application Status Update Flow | 1. Login<br>2. View applications<br>3. Update status<br>4. Check updated data persists | Status change reflected in UI and database | PASS |
| INT-04 | User Profile Management Flow | 1. Login<br>2. View profile<br>3. Edit profile<br>4. Verify changes persist | Profile changes saved and displayed correctly | PASS |
| INT-05 | User Deletion Flow | 1. Login<br>2. Delete user account<br>3. Verify user and associated data removed | User and related data completely removed | PASS |
| INT-06 | Email Verification Flow | 1. Register<br>2. Request verification email<br>3. Click verification link<br>4. Check updated user role | User verified and role updated to superuser | PENDING - Email delivery issues in some environments |
