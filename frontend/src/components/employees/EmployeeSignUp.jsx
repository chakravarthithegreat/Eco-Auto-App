import React, { useState, useEffect } from 'react';
import { useEmployeeSignUpStore } from '../../state/employeeSignUpStore';
import { useNavigationStore } from '../../state/navigationStore';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Checkbox } from '../ui/Checkbox';
import { Alert, AlertDescription } from '../ui/Alert';
import { 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  Building, 
  CreditCard, 
  AlertCircle,
  CheckCircle,
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  Briefcase,
  X,
  Bell,
  Lock
} from 'lucide-react';

const EmployeeSignUp = () => {
  console.log('EmployeeSignUp: Component rendering');
  const { 
    submitEmployeeSignUp, 
    isLoading, 
    error, 
    currentSignUp,
    clearError,
    resetSignUp
  } = useEmployeeSignUpStore();
  
  const { setCurrentPage } = useNavigationStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    emergencyContact: false,
    previousEmployment: false,
    education: false,
    personalInterests: false
  });
  
  const [validationErrors, setValidationErrors] = useState({});

  const [formData, setFormData] = useState({
    // Essential Details
    fullName: '',
    dateOfBirth: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    },
    phoneNumber: '',
    email: '',
    // Authentication Details
    username: '',
    password: '',
    confirmPassword: '',
    idProof: {
      type: 'Aadhaar',
      number: ''
    },
    joiningDate: '',
    jobTitle: '',
    bankDetails: {
      accountNumber: '',
      ifscCode: '',
      bankName: '',
      accountHolderName: ''
    },
    
    // Optional Fields
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
      email: ''
    },
    previousEmployment: [{
      company: '',
      position: '',
      duration: '',
      reasonForLeaving: ''
    }],
    education: [{
      degree: '',
      institution: '',
      yearOfCompletion: '',
      percentage: ''
    }],
    personalInterests: [''],
    
    // Terms acceptance
    termsAccepted: false
  });

  // Clear any existing errors when component mounts
  useEffect(() => {
    clearError();
    console.log('EmployeeSignUp: Component mounted, clearing errors');
    
    // Request notification permissions for admin/manager alerts
    const requestNotificationPermissions = async () => {
      if ('Notification' in window && Notification.permission === 'default') {
        try {
          await Notification.requestPermission();
          console.log('EmployeeSignUp: Notification permission requested');
        } catch (error) {
          console.log('EmployeeSignUp: Notification permission request failed:', error);
        }
      }
    };
    
    requestNotificationPermissions();
    
    return () => {
      resetSignUp();
      console.log('EmployeeSignUp: Component unmounted, resetting state');
    };
  }, [clearError, resetSignUp]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested fields
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleArrayInputChange = (arrayName, index, field, value) => {
    setFormData(prev => {
      const newArray = [...prev[arrayName]];
      newArray[index] = {
        ...newArray[index],
        [field]: value
      };
      return {
        ...prev,
        [arrayName]: newArray
      };
    });
  };

  const addArrayItem = (arrayName) => {
    setFormData(prev => {
      const newArray = [...prev[arrayName]];
      if (arrayName === 'previousEmployment') {
        newArray.push({ company: '', position: '', duration: '', reasonForLeaving: '' });
      } else if (arrayName === 'education') {
        newArray.push({ degree: '', institution: '', yearOfCompletion: '', percentage: '' });
      } else if (arrayName === 'personalInterests') {
        newArray.push('');
      }
      return {
        ...prev,
        [arrayName]: newArray
      };
    });
  };

  const removeArrayItem = (arrayName, index) => {
    setFormData(prev => {
      const newArray = [...prev[arrayName]];
      newArray.splice(index, 1);
      return {
        ...prev,
        [arrayName]: newArray
      };
    });
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.fullName && 
               formData.fullName.length >= 2 && 
               formData.dateOfBirth && 
               formData.address.street && 
               formData.address.city && 
               formData.address.state && 
               formData.address.zipCode;
      case 2:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        
        return formData.phoneNumber && 
               phoneRegex.test(formData.phoneNumber.replace(/\s/g, '')) &&
               formData.email && 
               emailRegex.test(formData.email) &&
               formData.username && 
               usernameRegex.test(formData.username) &&
               formData.password && 
               passwordRegex.test(formData.password) &&
               formData.confirmPassword && 
               formData.password === formData.confirmPassword &&
               formData.idProof.number && 
               formData.joiningDate && 
               formData.jobTitle;
      case 3:
        const accountRegex = /^\d{9,18}$/;
        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        
        return formData.bankDetails.accountNumber && 
               accountRegex.test(formData.bankDetails.accountNumber) &&
               formData.bankDetails.ifscCode && 
               ifscRegex.test(formData.bankDetails.ifscCode.toUpperCase()) &&
               formData.bankDetails.bankName && 
               formData.bankDetails.accountHolderName;
      default:
        return false;
    }
  };

  const getValidationErrors = (step) => {
    const errors = {};
    
    switch (step) {
      case 1:
        if (!formData.personalInfo.firstName?.trim()) {
          errors.firstName = 'First name is required';
        }
        if (!formData.personalInfo.lastName?.trim()) {
          errors.lastName = 'Last name is required';
        }
        if (!formData.personalInfo.email?.trim()) {
          errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personalInfo.email)) {
          errors.email = 'Please enter a valid email address';
        }
        if (!formData.personalInfo.phone?.trim()) {
          errors.phone = 'Phone number is required';
        }
        if (!formData.personalInfo.dateOfBirth) {
          errors.dateOfBirth = 'Date of birth is required';
        }
        break;
        
      case 2:
        if (!formData.idProof?.number?.trim()) {
          errors.idProofNumber = 'ID proof number is required';
        }
        if (!formData.joiningDate) {
          errors.joiningDate = 'Joining date is required';
        }
        if (!formData.jobTitle?.trim()) {
          errors.jobTitle = 'Job title is required';
        }
        break;
        
      case 3:
        const accountRegex = /^\d{9,18}$/;
        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        
        if (!formData.bankDetails?.accountNumber || !accountRegex.test(formData.bankDetails.accountNumber)) {
          errors.accountNumber = 'Please enter a valid account number (9-18 digits)';
        }
        if (!formData.bankDetails?.ifscCode || !ifscRegex.test(formData.bankDetails.ifscCode.toUpperCase())) {
          errors.ifscCode = 'Please enter a valid IFSC code (e.g., SBIN0001234)';
        }
        if (!formData.bankDetails?.bankName?.trim()) {
          errors.bankName = 'Bank name is required';
        }
        if (!formData.bankDetails?.accountHolderName?.trim()) {
          errors.accountHolderName = 'Account holder name is required';
        }
        break;
    }
    
    return errors;
  };

  const handleNext = () => {
    const errors = getValidationErrors(currentStep);
    setValidationErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      setCurrentStep(prev => prev + 1);
      setValidationErrors({});
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('EmployeeSignUp: Form submitted');
    
    if (!isTermsAccepted) {
      alert('Please accept the Terms and Conditions to proceed.');
      return;
    }
    
    const submissionData = {
      ...formData,
      termsAccepted: isTermsAccepted,
      termsAcceptedAt: new Date().toISOString()
    };
    
    console.log('EmployeeSignUp: Submitting data:', submissionData);
    const result = await submitEmployeeSignUp(submissionData);
    console.log('EmployeeSignUp: Submission result:', result);
    
    if (result && result.success) {
      setCurrentStep(5); // Success step
      
      // Show notification to user
      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification('Registration Submitted', {
            body: 'Your employee registration has been submitted successfully. Admin will review it shortly.',
            icon: '/favicon.ico',
            timestamp: Date.now()
          });
        } catch (error) {
          console.log('EmployeeSignUp: Failed to show user notification:', error);
        }
      }
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <React.Fragment key={step}>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
            currentStep === step 
              ? 'bg-primary-green border-primary-green text-white' 
              : currentStep > step 
                ? 'bg-green-100 border-green-500 text-green-700' 
                : 'bg-white border-gray-300 text-gray-500'
          }`}>
            {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
          </div>
          {step < 4 && (
            <div className={`w-16 h-1 border-t-2 ${
              currentStep > step ? 'border-green-500' : 'border-gray-300'
            }`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter full name"
              className="pl-10"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="pl-10"
              required
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Address *</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="address.street">Street Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="address.street"
                name="address.street"
                value={formData.address.street}
                onChange={handleInputChange}
                placeholder="Street address"
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address.city">City</Label>
            <Input
              id="address.city"
              name="address.city"
              value={formData.address.city}
              onChange={handleInputChange}
              placeholder="City"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address.state">State</Label>
            <Input
              id="address.state"
              name="address.state"
              value={formData.address.state}
              onChange={handleInputChange}
              placeholder="State"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address.zipCode">ZIP Code</Label>
            <Input
              id="address.zipCode"
              name="address.zipCode"
              value={formData.address.zipCode}
              onChange={handleInputChange}
              placeholder="ZIP Code"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number *</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              className="pl-10"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
              className="pl-10"
              required
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Login Credentials *</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Choose a username"
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Choose a password"
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                className="pl-10"
                required
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">ID Proof *</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="idProof.type">ID Type</Label>
            <Select 
              value={formData.idProof.type} 
              onValueChange={(value) => handleNestedInputChange('idProof', 'type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select ID type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Aadhaar">Aadhaar</SelectItem>
                <SelectItem value="PAN">PAN</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="idProof.number">ID Number</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="idProof.number"
                name="idProof.number"
                value={formData.idProof.number}
                onChange={handleInputChange}
                placeholder="Enter ID number"
                className="pl-10"
                required
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="joiningDate">Joining Date *</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="joiningDate"
              name="joiningDate"
              type="date"
              value={formData.joiningDate}
              onChange={handleInputChange}
              className="pl-10"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="jobTitle">Job Title *</Label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              placeholder="Enter job title"
              className="pl-10"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Bank Details *</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bankDetails.accountNumber">Account Number</Label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="bankDetails.accountNumber"
                name="bankDetails.accountNumber"
                value={formData.bankDetails.accountNumber}
                onChange={handleInputChange}
                placeholder="Enter account number"
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bankDetails.ifscCode">IFSC Code</Label>
            <Input
              id="bankDetails.ifscCode"
              name="bankDetails.ifscCode"
              value={formData.bankDetails.ifscCode}
              onChange={handleInputChange}
              placeholder="Enter IFSC code"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bankDetails.bankName">Bank Name</Label>
            <Input
              id="bankDetails.bankName"
              name="bankDetails.bankName"
              value={formData.bankDetails.bankName}
              onChange={handleInputChange}
              placeholder="Enter bank name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bankDetails.accountHolderName">Account Holder Name</Label>
            <Input
              id="bankDetails.accountHolderName"
              name="bankDetails.accountHolderName"
              value={formData.bankDetails.accountHolderName}
              onChange={handleInputChange}
              placeholder="Enter account holder name"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      {/* Emergency Contact */}
      <div className="border border-gray-200 rounded-lg">
        <button
          type="button"
          className="w-full flex items-center justify-between p-4 text-left"
          onClick={() => toggleSection('emergencyContact')}
        >
          <h3 className="text-lg font-semibold text-gray-900">Emergency Contact</h3>
          {expandedSections.emergencyContact ? 
            <ChevronDown className="w-5 h-5 text-gray-500" /> : 
            <ChevronRight className="w-5 h-5 text-gray-500" />
          }
        </button>
        
        {expandedSections.emergencyContact && (
          <div className="p-4 border-t border-gray-200 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact.name">Name</Label>
                <Input
                  id="emergencyContact.name"
                  name="emergencyContact.name"
                  value={formData.emergencyContact.name}
                  onChange={handleInputChange}
                  placeholder="Enter contact name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergencyContact.relationship">Relationship</Label>
                <Input
                  id="emergencyContact.relationship"
                  name="emergencyContact.relationship"
                  value={formData.emergencyContact.relationship}
                  onChange={handleInputChange}
                  placeholder="Relationship to employee"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergencyContact.phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="emergencyContact.phone"
                    name="emergencyContact.phone"
                    value={formData.emergencyContact.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergencyContact.email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="emergencyContact.email"
                    name="emergencyContact.email"
                    type="email"
                    value={formData.emergencyContact.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Previous Employment */}
      <div className="border border-gray-200 rounded-lg">
        <button
          type="button"
          className="w-full flex items-center justify-between p-4 text-left"
          onClick={() => toggleSection('previousEmployment')}
        >
          <h3 className="text-lg font-semibold text-gray-900">Previous Employment</h3>
          {expandedSections.previousEmployment ? 
            <ChevronDown className="w-5 h-5 text-gray-500" /> : 
            <ChevronRight className="w-5 h-5 text-gray-500" />
          }
        </button>
        
        {expandedSections.previousEmployment && (
          <div className="p-4 border-t border-gray-200 space-y-4">
            {formData.previousEmployment.map((employment, index) => (
              <div key={index} className="border border-gray-100 rounded-lg p-4 relative">
                {formData.previousEmployment.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('previousEmployment', index)}
                    className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`employment-${index}-company`}>Company</Label>
                    <Input
                      id={`employment-${index}-company`}
                      value={employment.company}
                      onChange={(e) => handleArrayInputChange('previousEmployment', index, 'company', e.target.value)}
                      placeholder="Enter company name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`employment-${index}-position`}>Position</Label>
                    <Input
                      id={`employment-${index}-position`}
                      value={employment.position}
                      onChange={(e) => handleArrayInputChange('previousEmployment', index, 'position', e.target.value)}
                      placeholder="Enter position"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`employment-${index}-duration`}>Duration</Label>
                    <Input
                      id={`employment-${index}-duration`}
                      value={employment.duration}
                      onChange={(e) => handleArrayInputChange('previousEmployment', index, 'duration', e.target.value)}
                      placeholder="e.g., 2 years"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`employment-${index}-reason`}>Reason for Leaving</Label>
                    <Input
                      id={`employment-${index}-reason`}
                      value={employment.reasonForLeaving}
                      onChange={(e) => handleArrayInputChange('previousEmployment', index, 'reasonForLeaving', e.target.value)}
                      placeholder="Enter reason"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem('previousEmployment')}
              className="w-full flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Another Employment
            </Button>
          </div>
        )}
      </div>
      
      {/* Education */}
      <div className="border border-gray-200 rounded-lg">
        <button
          type="button"
          className="w-full flex items-center justify-between p-4 text-left"
          onClick={() => toggleSection('education')}
        >
          <h3 className="text-lg font-semibold text-gray-900">Education</h3>
          {expandedSections.education ? 
            <ChevronDown className="w-5 h-5 text-gray-500" /> : 
            <ChevronRight className="w-5 h-5 text-gray-500" />
          }
        </button>
        
        {expandedSections.education && (
          <div className="p-4 border-t border-gray-200 space-y-4">
            {formData.education.map((edu, index) => (
              <div key={index} className="border border-gray-100 rounded-lg p-4 relative">
                {formData.education.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('education', index)}
                    className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`education-${index}-degree`}>Degree</Label>
                    <Input
                      id={`education-${index}-degree`}
                      value={edu.degree}
                      onChange={(e) => handleArrayInputChange('education', index, 'degree', e.target.value)}
                      placeholder="Enter degree"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`education-${index}-institution`}>Institution</Label>
                    <Input
                      id={`education-${index}-institution`}
                      value={edu.institution}
                      onChange={(e) => handleArrayInputChange('education', index, 'institution', e.target.value)}
                      placeholder="Enter institution name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`education-${index}-year`}>Year of Completion</Label>
                    <Input
                      id={`education-${index}-year`}
                      type="number"
                      value={edu.yearOfCompletion}
                      onChange={(e) => handleArrayInputChange('education', index, 'yearOfCompletion', e.target.value)}
                      placeholder="Enter year"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`education-${index}-percentage`}>Percentage/Grade</Label>
                    <Input
                      id={`education-${index}-percentage`}
                      value={edu.percentage}
                      onChange={(e) => handleArrayInputChange('education', index, 'percentage', e.target.value)}
                      placeholder="Enter percentage or grade"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem('education')}
              className="w-full flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Another Education
            </Button>
          </div>
        )}
      </div>
      
      {/* Personal Interests */}
      <div className="border border-gray-200 rounded-lg">
        <button
          type="button"
          className="w-full flex items-center justify-between p-4 text-left"
          onClick={() => toggleSection('personalInterests')}
        >
          <h3 className="text-lg font-semibold text-gray-900">Personal Interests</h3>
          {expandedSections.personalInterests ? 
            <ChevronDown className="w-5 h-5 text-gray-500" /> : 
            <ChevronRight className="w-5 h-5 text-gray-500" />
          }
        </button>
        
        {expandedSections.personalInterests && (
          <div className="p-4 border-t border-gray-200 space-y-4">
            {formData.personalInterests.map((interest, index) => (
              <div key={index} className="flex items-center gap-2">
                {formData.personalInterests.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('personalInterests', index)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <Input
                  value={interest}
                  onChange={(e) => {
                    const newArray = [...formData.personalInterests];
                    newArray[index] = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      personalInterests: newArray
                    }));
                  }}
                  placeholder="Enter personal interest"
                />
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem('personalInterests')}
              className="w-full flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Another Interest
            </Button>
          </div>
        )}
      </div>
      
      {/* Terms & Conditions */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="termsAccepted"
            checked={isTermsAccepted}
            onCheckedChange={setIsTermsAccepted}
            className="mt-1"
          />
          <div>
            <Label htmlFor="termsAccepted" className="font-medium">
              I accept the Terms and Conditions *
            </Label>
            <p className="text-sm text-gray-500 mt-1">
              Please read and accept our terms and conditions to proceed with registration.
            </p>
            <Button
              type="button"
              variant="link"
              onClick={() => setShowTerms(true)}
              className="p-0 h-auto font-normal text-primary-green hover:text-primary-green-dark"
            >
              View Terms and Conditions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center py-8">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      <h3 className="mt-4 text-xl font-semibold text-gray-900">Registration Submitted Successfully!</h3>
      <p className="mt-2 text-gray-500">
        Thank you for completing your registration. Your information has been submitted for review.
      </p>
      <p className="mt-2 text-gray-500">
        You will receive an email notification once your account has been approved.
      </p>
      <p className="mt-4">
        <a href="#" onClick={(e) => {
          e.preventDefault();
          setCurrentPage('dashboard');
        }} className="text-primary-green hover:underline">Return to login</a>
      </p>
      <div className="mt-6">
        <Button onClick={() => {
          resetSignUp();
          setCurrentStep(1);
          setFormData({
            // Reset to initial state
            fullName: '',
            dateOfBirth: '',
            address: {
              street: '',
              city: '',
              state: '',
              zipCode: '',
              country: 'India'
            },
            phoneNumber: '',
            email: '',
            idProof: {
              type: 'Aadhaar',
              number: ''
            },
            joiningDate: '',
            jobTitle: '',
            bankDetails: {
              accountNumber: '',
              ifscCode: '',
              bankName: '',
              accountHolderName: ''
            },
            emergencyContact: {
              name: '',
              relationship: '',
              phone: '',
              email: ''
            },
            previousEmployment: [{
              company: '',
              position: '',
              duration: '',
              reasonForLeaving: ''
            }],
            education: [{
              degree: '',
              institution: '',
              yearOfCompletion: '',
              percentage: ''
            }],
            personalInterests: [''],
            termsAccepted: false
          });
          setIsTermsAccepted(false);
        }}>
          Submit Another Registration
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Employee Registration
            </CardTitle>
            <p className="text-gray-500">
              Please fill in all required information to complete your registration
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Already have an account? <a href="#" onClick={(e) => {
                e.preventDefault();
                setCurrentPage('dashboard');
              }} className="text-primary-green hover:underline">Sign in</a>
            </p>
          </CardHeader>
          
          <CardContent>
            {/* Display error message if any */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {typeof error === 'string' ? error : 'An error occurred during submission. Please try again.'}
                </AlertDescription>
              </Alert>
            )}
            
            {currentStep < 5 && renderStepIndicator()}
            
            <form onSubmit={handleSubmit}>
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
              {currentStep === 5 && renderSuccessStep()}
              
              {currentStep < 5 && (
                <div className="flex justify-between mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1 || isLoading}
                  >
                    Previous
                  </Button>
                  
                  {currentStep < 4 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={isLoading}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isLoading || !isTermsAccepted}
                    >
                      {isLoading ? 'Submitting...' : 'Submit Registration'}
                    </Button>
                  )}
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
      
      {/* Terms and Conditions Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Terms and Conditions</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTerms(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="prose max-w-none">
                <p className="mb-4">
                  By registering with Eco-Auto, you agree to the following terms and conditions:
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>All information provided must be accurate and truthful.</li>
                  <li>Confidentiality of company information is mandatory.</li>
                  <li>Regular attendance and punctuality are required.</li>
                  <li>Professional conduct is expected at all times.</li>
                  <li>Compliance with Indian labor laws is mandatory.</li>
                  <li>Company policies and procedures must be followed.</li>
                  <li>Any violation may result in disciplinary action.</li>
                </ol>
                <h4 className="font-bold mt-6 mb-2">Legal References:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Industrial Disputes Act, 1947 (Act No. 14 of 1947)</li>
                  <li>Factories Act, 1948 (Act No. 63 of 1948)</li>
                  <li>Minimum Wages Act, 1948 (Act No. 11 of 1948)</li>
                  <li>Employees' State Insurance Act, 1948 (Act No. 34 of 1948)</li>
                </ul>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={() => setShowTerms(false)}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeSignUp;