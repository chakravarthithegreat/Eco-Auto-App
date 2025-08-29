# Employee Sign-Up Components

This directory contains all the components related to the employee sign-up workflow.

## Components

### 1. EmployeeSignUp.jsx
A multi-step form for employee registration that collects all required information:
- Personal details (name, DOB, address)
- Contact information (phone, email)
- ID proof (Aadhaar/PAN)
- Employment details (joining date, job title)
- Bank details
- Optional information (emergency contact, previous employment, education, personal interests)
- Terms and conditions acceptance

### 2. TermsAndConditions.jsx
Displays the company's terms and conditions with legal references:
- Company policies
- Indian law references
- Rules and regulations
- Acceptance checkbox

### 3. ProfileCreation.jsx
Allows employees to complete their profile after initial sign-up:
- Profile picture upload
- Bio/description
- Skills
- Work experience
- Education
- Personal interests
- Emergency contact
- Social links

### 4. ApprovalDashboard.jsx
Manager/Admin interface for reviewing and approving employee registrations:
- List of pending approvals
- Detailed employee information view
- Approval/rejection workflow
- Status tracking

## Navigation

The following routes have been added to the application:
- `/employee-signup` - Employee registration form
- `/terms-and-conditions` - Terms and conditions display
- `/profile-creation` - Profile completion page
- `/employee-approvals` - Employee approval dashboard

## Access Points

1. **For New Employees**: 
   - Navigate to the login page and click "Create Employee Account" to start the registration process

2. **For Admins/Managers**:
   - From the Employee Management page, click "Create Profile" to add detailed employee information
   - Within the "Add Employee" modal, click "Create detailed employee profile" for comprehensive profile creation

## Integration

These components are integrated with:
- `employeeSignUpStore` for state management
- `authStore` for authentication
- `navigationStore` for routing
- MainLayout for navigation menu

## Usage

### For Employees
1. Navigate to the login page and click "Create Employee Account" to begin registration
2. Complete all required fields in the multi-step form
3. Accept terms and conditions
4. Submit the form
5. Wait for approval from manager/admin
6. Once approved, complete profile at `/profile-creation`

### For Managers/Admins
1. Navigate to `/employee-approvals` to view pending registrations
2. Review employee details
3. Approve or reject registrations with comments
4. Track approval status
5. From Employee Management, click "Create Profile" to add detailed employee information

## API Integration

These components work with the following backend endpoints:
- `GET /api/employee-signup/terms-and-conditions` - Fetch terms and conditions
- `POST /api/employee-signup/signup` - Submit employee registration
- `GET /api/employee-signup/pending/approvals` - Fetch pending approvals
- `PATCH /api/employee-signup/:id/approve` - Approve/reject employee
- `PATCH /api/employee-signup/:id/profile-status` - Update profile status

## Data Structure

### EmployeeSignUp Model
```javascript
{
  fullName: String,
  dateOfBirth: Date,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  phoneNumber: String,
  email: String,
  idProof: {
    type: String, // 'Aadhaar' or 'PAN'
    number: String
  },
  joiningDate: Date,
  jobTitle: String,
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    accountHolderName: String
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
    email: String
  },
  previousEmployment: [{
    company: String,
    position: String,
    duration: String,
    reasonForLeaving: String
  }],
  education: [{
    degree: String,
    institution: String,
    yearOfCompletion: Number,
    percentage: Number
  }],
  personalInterests: [String],
  termsAccepted: Boolean,
  termsAcceptedAt: Date,
  profileStatus: String, // 'pending', 'profile_created', 'under_review', 'approved', 'rejected'
  approvalWorkflow: {
    submittedAt: Date,
    reviewedBy: ObjectId,
    reviewedAt: Date,
    approvalStatus: String, // 'pending', 'approved', 'rejected'
    approvalComments: String,
    rejectionReason: String
  },
  accountStatus: String // 'pending', 'active', 'inactive'
}
```

## Compliance Policies Model
```javascript
{
  policyType: String, // 'leave', 'time', 'salary', 'general'
  title: String,
  description: String,
  lawReference: {
    lawName: String,
    lawNumber: String,
    section: String,
    subsection: String,
    year: Number
  },
  content: String,
  rules: [{
    ruleTitle: String,
    ruleDescription: String,
    isMandatory: Boolean
  }],
  applicableTo: [String], // 'all', 'permanent', 'contract', 'temporary', 'probation'
  isActive: Boolean,
  version: String,
  approvedBy: ObjectId,
  approvedAt: Date
}
```