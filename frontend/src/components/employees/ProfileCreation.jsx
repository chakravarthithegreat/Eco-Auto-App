import React, { useState, useEffect } from 'react';
import { useEmployeeSignUpStore } from '../../state/employeeSignUpStore';
import { useAuthStore } from '../../state/authStore';
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
  Camera, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Heart, 
  AlertCircle,
  CheckCircle,
  Plus,
  Trash2,
  Upload
} from 'lucide-react';

const ProfileCreation = ({ mode = 'self' }) => {
  const { 
    currentSignUp, 
    updateProfileStatus, 
    isLoading, 
    error,
    clearError
  } = useEmployeeSignUpStore();
  
  const { user } = useAuthStore();

  const [profileData, setProfileData] = useState({
    profilePicture: null,
    bio: '',
    skills: [''],
    experience: [{
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: ''
    }],
    education: [{
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      grade: ''
    }],
    interests: [''],
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
      email: ''
    },
    socialLinks: {
      linkedin: '',
      twitter: '',
      github: ''
    }
  });

  const [previewImage, setPreviewImage] = useState(null);

  // Initialize with current sign-up data if available
  useEffect(() => {
    // Check for selected employee for editing from notifications
    const selectedEmployeeId = localStorage.getItem('selectedEmployeeForEditing');
    if (selectedEmployeeId) {
      // Get all signups from localStorage
      const existingSignUps = JSON.parse(localStorage.getItem('employeeSignUps') || '[]');
      const employee = existingSignUps.find(emp => emp._id === selectedEmployeeId);
      
      if (employee) {
        // Set the current sign-up to this employee
        // In a real app, we would use a store action to set this
        // For now, we'll just initialize the profile data with the employee data
        setProfileData(prev => ({
          ...prev,
          bio: employee.bio || '',
          skills: employee.skills && employee.skills.length > 0 ? employee.skills : [''],
          experience: employee.previousEmployment && employee.previousEmployment.length > 0 
            ? employee.previousEmployment.map(exp => ({
                company: exp.company || '',
                position: exp.position || '',
                startDate: exp.startDate || '',
                endDate: exp.endDate || '',
                isCurrent: exp.isCurrent || false,
                description: exp.description || ''
              }))
            : [{ company: '', position: '', startDate: '', endDate: '', isCurrent: false, description: '' }],
          education: employee.education && employee.education.length > 0 
            ? employee.education 
            : [{ institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', grade: '' }],
          interests: employee.personalInterests && employee.personalInterests.length > 0 
            ? employee.personalInterests 
            : [''],
          emergencyContact: employee.emergencyContact || { 
            name: '', relationship: '', phone: '', email: '' 
          },
          socialLinks: employee.socialLinks || { 
            linkedin: '', twitter: '', github: '' 
          }
        }));
        
        // Remove the item from localStorage after using it
        localStorage.removeItem('selectedEmployeeForEditing');
      }
    } else if (currentSignUp) {
      setProfileData(prev => ({
        ...prev,
        bio: currentSignUp.bio || '',
        skills: currentSignUp.skills && currentSignUp.skills.length > 0 ? currentSignUp.skills : [''],
        experience: currentSignUp.previousEmployment && currentSignUp.previousEmployment.length > 0 
          ? currentSignUp.previousEmployment.map(exp => ({
              company: exp.company || '',
              position: exp.position || '',
              startDate: exp.startDate || '',
              endDate: exp.endDate || '',
              isCurrent: exp.isCurrent || false,
              description: exp.description || ''
            }))
          : [{ company: '', position: '', startDate: '', endDate: '', isCurrent: false, description: '' }],
        education: currentSignUp.education && currentSignUp.education.length > 0 
          ? currentSignUp.education 
          : [{ institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', grade: '' }],
        interests: currentSignUp.personalInterests && currentSignUp.personalInterests.length > 0 
          ? currentSignUp.personalInterests 
          : [''],
        emergencyContact: currentSignUp.emergencyContact || { 
          name: '', relationship: '', phone: '', email: '' 
        },
        socialLinks: currentSignUp.socialLinks || { 
          linkedin: '', twitter: '', github: '' 
        }
      }));
    }
  }, [currentSignUp]);

  // Clean up preview image
  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setProfileData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleArrayInputChange = (arrayName, index, field, value) => {
    setProfileData(prev => {
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

  const handleCheckboxChange = (arrayName, index, field) => {
    setProfileData(prev => {
      const newArray = [...prev[arrayName]];
      newArray[index] = {
        ...newArray[index],
        [field]: !newArray[index][field]
      };
      return {
        ...prev,
        [arrayName]: newArray
      };
    });
  };

  const addArrayItem = (arrayName) => {
    setProfileData(prev => {
      const newArray = [...prev[arrayName]];
      if (arrayName === 'skills') {
        newArray.push('');
      } else if (arrayName === 'experience') {
        newArray.push({ 
          company: '', 
          position: '', 
          startDate: '', 
          endDate: '', 
          isCurrent: false, 
          description: '' 
        });
      } else if (arrayName === 'education') {
        newArray.push({ 
          institution: '', 
          degree: '', 
          fieldOfStudy: '', 
          startDate: '', 
          endDate: '', 
          grade: '' 
        });
      } else if (arrayName === 'interests') {
        newArray.push('');
      }
      return {
        ...prev,
        [arrayName]: newArray
      };
    });
  };

  const removeArrayItem = (arrayName, index) => {
    setProfileData(prev => {
      const newArray = [...prev[arrayName]];
      newArray.splice(index, 1);
      return {
        ...prev,
        [arrayName]: newArray
      };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData(prev => ({
        ...prev,
        profilePicture: file
      }));
      
      // Create preview
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare data for submission
    const submissionData = {
      ...profileData,
      profileStatus: 'profile_created'
    };
    
    // If we have a current sign-up ID, update the profile status
    if (currentSignUp && currentSignUp._id) {
      const result = await updateProfileStatus(currentSignUp._id, 'profile_created');
      
      if (result.success) {
        // Profile creation successful
        alert('Profile created successfully! Your profile is now pending approval.');
      }
    } else {
      alert('Profile data saved locally. Please contact admin for approval.');
    }
  };

  const renderProfilePicture = () => (
    <div className="flex flex-col items-center mb-6">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
          {previewImage ? (
            <img 
              src={previewImage} 
              alt="Profile preview" 
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-12 h-12 text-gray-400" />
          )}
        </div>
        <label 
          htmlFor="profilePicture" 
          className="absolute bottom-0 right-0 bg-primary-green rounded-full p-2 cursor-pointer hover:bg-primary-green-dark transition-colors"
        >
          <Camera className="w-4 h-4 text-white" />
        </label>
        <input
          id="profilePicture"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>
      <p className="text-sm text-gray-500 mt-2">Upload a profile picture</p>
    </div>
  );

  const renderBioSection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">About You</h3>
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          value={profileData.bio}
          onChange={handleInputChange}
          placeholder="Tell us about yourself..."
          rows={4}
        />
      </div>
    </div>
  );

  const renderSkillsSection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addArrayItem('skills')}
          className="flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add Skill
        </Button>
      </div>
      
      <div className="space-y-2">
        {profileData.skills.map((skill, index) => (
          <div key={index} className="flex items-center gap-2">
            {profileData.skills.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem('skills', index)}
                className="p-1 text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <Input
              value={skill}
              onChange={(e) => {
                const newArray = [...profileData.skills];
                newArray[index] = e.target.value;
                setProfileData(prev => ({
                  ...prev,
                  skills: newArray
                }));
              }}
              placeholder="Enter a skill"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderExperienceSection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addArrayItem('experience')}
          className="flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </Button>
      </div>
      
      <div className="space-y-4">
        {profileData.experience.map((exp, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
            {profileData.experience.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem('experience', index)}
                className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`exp-${index}-company`}>Company</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id={`exp-${index}-company`}
                    value={exp.company}
                    onChange={(e) => handleArrayInputChange('experience', index, 'company', e.target.value)}
                    placeholder="Enter company name"
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`exp-${index}-position`}>Position</Label>
                <Input
                  id={`exp-${index}-position`}
                  value={exp.position}
                  onChange={(e) => handleArrayInputChange('experience', index, 'position', e.target.value)}
                  placeholder="Enter position"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`exp-${index}-startDate`}>Start Date</Label>
                <Input
                  id={`exp-${index}-startDate`}
                  type="date"
                  value={exp.startDate}
                  onChange={(e) => handleArrayInputChange('experience', index, 'startDate', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`exp-${index}-endDate`}>End Date</Label>
                <Input
                  id={`exp-${index}-endDate`}
                  type="date"
                  value={exp.endDate}
                  onChange={(e) => handleArrayInputChange('experience', index, 'endDate', e.target.value)}
                  disabled={exp.isCurrent}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`exp-${index}-current`}
                    checked={exp.isCurrent}
                    onCheckedChange={() => handleCheckboxChange('experience', index, 'isCurrent')}
                  />
                  <Label htmlFor={`exp-${index}-current`}>I currently work here</Label>
                </div>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor={`exp-${index}-description`}>Description</Label>
                <Textarea
                  id={`exp-${index}-description`}
                  value={exp.description}
                  onChange={(e) => handleArrayInputChange('experience', index, 'description', e.target.value)}
                  placeholder="Describe your responsibilities and achievements..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEducationSection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Education</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addArrayItem('education')}
          className="flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add Education
        </Button>
      </div>
      
      <div className="space-y-4">
        {profileData.education.map((edu, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
            {profileData.education.length > 1 && (
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
                <Label htmlFor={`edu-${index}-institution`}>Institution</Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id={`edu-${index}-institution`}
                    value={edu.institution}
                    onChange={(e) => handleArrayInputChange('education', index, 'institution', e.target.value)}
                    placeholder="Enter institution name"
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`edu-${index}-degree`}>Degree</Label>
                <Input
                  id={`edu-${index}-degree`}
                  value={edu.degree}
                  onChange={(e) => handleArrayInputChange('education', index, 'degree', e.target.value)}
                  placeholder="Enter degree"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`edu-${index}-field`}>Field of Study</Label>
                <Input
                  id={`edu-${index}-field`}
                  value={edu.fieldOfStudy}
                  onChange={(e) => handleArrayInputChange('education', index, 'fieldOfStudy', e.target.value)}
                  placeholder="Enter field of study"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`edu-${index}-grade`}>Grade/Percentage</Label>
                <Input
                  id={`edu-${index}-grade`}
                  value={edu.grade}
                  onChange={(e) => handleArrayInputChange('education', index, 'grade', e.target.value)}
                  placeholder="Enter grade or percentage"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`edu-${index}-startDate`}>Start Date</Label>
                <Input
                  id={`edu-${index}-startDate`}
                  type="date"
                  value={edu.startDate}
                  onChange={(e) => handleArrayInputChange('education', index, 'startDate', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`edu-${index}-endDate`}>End Date</Label>
                <Input
                  id={`edu-${index}-endDate`}
                  type="date"
                  value={edu.endDate}
                  onChange={(e) => handleArrayInputChange('education', index, 'endDate', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInterestsSection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Personal Interests</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addArrayItem('interests')}
          className="flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add Interest
        </Button>
      </div>
      
      <div className="space-y-2">
        {profileData.interests.map((interest, index) => (
          <div key={index} className="flex items-center gap-2">
            {profileData.interests.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem('interests', index)}
                className="p-1 text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <div className="relative flex-1">
              <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={interest}
                onChange={(e) => {
                  const newArray = [...profileData.interests];
                  newArray[index] = e.target.value;
                  setProfileData(prev => ({
                    ...prev,
                    interests: newArray
                  }));
                }}
                placeholder="Enter a personal interest"
                className="pl-10"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEmergencyContactSection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Emergency Contact</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="emergency-name">Full Name</Label>
          <Input
            id="emergency-name"
            value={profileData.emergencyContact.name}
            onChange={(e) => handleNestedInputChange('emergencyContact', 'name', e.target.value)}
            placeholder="Enter full name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="emergency-relationship">Relationship</Label>
          <Input
            id="emergency-relationship"
            value={profileData.emergencyContact.relationship}
            onChange={(e) => handleNestedInputChange('emergencyContact', 'relationship', e.target.value)}
            placeholder="Relationship to you"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="emergency-phone">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="emergency-phone"
              value={profileData.emergencyContact.phone}
              onChange={(e) => handleNestedInputChange('emergencyContact', 'phone', e.target.value)}
              placeholder="Enter phone number"
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="emergency-email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="emergency-email"
              type="email"
              value={profileData.emergencyContact.email}
              onChange={(e) => handleNestedInputChange('emergencyContact', 'email', e.target.value)}
              placeholder="Enter email address"
              className="pl-10"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSocialLinksSection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Social Links</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <div className="relative">
            <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="linkedin"
              value={profileData.socialLinks.linkedin}
              onChange={(e) => handleNestedInputChange('socialLinks', 'linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="twitter">Twitter</Label>
          <div className="relative">
            <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="twitter"
              value={profileData.socialLinks.twitter}
              onChange={(e) => handleNestedInputChange('socialLinks', 'twitter', e.target.value)}
              placeholder="https://twitter.com/username"
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="github">GitHub</Label>
          <div className="relative">
            <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="github"
              value={profileData.socialLinks.github}
              onChange={(e) => handleNestedInputChange('socialLinks', 'github', e.target.value)}
              placeholder="https://github.com/username"
              className="pl-10"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {mode === 'admin' ? 'Create Employee Profile' : 'Complete Your Profile'}
            </CardTitle>
            <p className="text-gray-500">
              {mode === 'admin' 
                ? 'Add detailed information for the new employee' 
                : 'Add additional details to your profile to help us get to know you better'}
            </p>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {renderProfilePicture()}
              
              {renderBioSection()}
              
              {renderSkillsSection()}
              
              {renderExperienceSection()}
              
              {renderEducationSection()}
              
              {renderInterestsSection()}
              
              {renderEmergencyContactSection()}
              
              {renderSocialLinksSection()}
              
              <div className="flex justify-end pt-6 border-t border-gray-200">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      {mode === 'admin' ? 'Create Profile' : 'Save Profile'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Icons that were referenced but not imported
const Phone = () => <span className="inline-block w-4 h-4">📞</span>;
const Mail = () => <span className="inline-block w-4 h-4">✉️</span>;
const Linkedin = () => <span className="inline-block w-4 h-4">in</span>;
const Twitter = () => <span className="inline-block w-4 h-4">🐦</span>;
const Github = () => <span className="inline-block w-4 h-4">GH</span>;

export default ProfileCreation;