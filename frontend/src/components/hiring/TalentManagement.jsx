import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Calendar,
  Plus,
  Upload,
  Users
} from 'lucide-react';

const TalentManagement = () => {
  const [candidateData, setCandidateData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    skills: '',
    photoUrl: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCandidateData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);
    
    try {
      // Prepare data for submission
      const dataToSend = {
        ...candidateData,
        experience: parseInt(candidateData.experience) || 0,
        skills: candidateData.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
      };
      
      const response = await fetch('/api/hiring/candidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });
      
      if (response.ok) {
        setSubmitSuccess(true);
        // Reset form
        setCandidateData({
          name: '',
          email: '',
          phone: '',
          position: '',
          experience: '',
          skills: '',
          photoUrl: ''
        });
        
        // Hide success message after 3 seconds
        setTimeout(() => setSubmitSuccess(false), 3000);
      } else {
        const errorData = await response.json();
        setSubmitError(errorData.message || 'Failed to add candidate');
      }
    } catch (error) {
      setSubmitError('Network error. Please try again.');
      console.error('Error adding candidate:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Talent Management</h1>
        <p className="text-gray-600">Add and manage new talent for your organization</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add New Talent Form */}
        <div className="lg:col-span-2">
          <Card className="rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add New Talent
              </CardTitle>
            </CardHeader>
            <CardContent>
              {submitSuccess && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
                  Candidate added successfully!
                </div>
              )}
              
              {submitError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {submitError}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        name="name"
                        value={candidateData.name}
                        onChange={handleInputChange}
                        placeholder="Enter full name"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="email"
                        name="email"
                        value={candidateData.email}
                        onChange={handleInputChange}
                        placeholder="Enter email address"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="tel"
                        name="phone"
                        value={candidateData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position Applied For *
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        name="position"
                        value={candidateData.position}
                        onChange={handleInputChange}
                        placeholder="Enter position"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Years of Experience
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="number"
                        name="experience"
                        value={candidateData.experience}
                        onChange={handleInputChange}
                        placeholder="Enter years of experience"
                        className="pl-10"
                        min="0"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Photo URL
                    </label>
                    <div className="relative">
                      <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        name="photoUrl"
                        value={candidateData.photoUrl}
                        onChange={handleInputChange}
                        placeholder="Enter photo URL"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skills (comma separated)
                  </label>
                  <Textarea
                    name="skills"
                    value={candidateData.skills}
                    onChange={handleInputChange}
                    placeholder="e.g., JavaScript, React, Node.js, Python"
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-primary-green to-accent-blue hover:from-primary-green-light hover:to-accent-blue-light"
                  >
                    {isSubmitting ? 'Adding...' : 'Add Candidate'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        {/* Instructions Panel */}
        <div>
          <Card className="rounded-3xl overflow-hidden h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">How to Add Talent</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="w-5 h-5 rounded-full bg-primary-green text-white text-xs flex items-center justify-center mr-2 mt-0.5">1</span>
                      <span>Fill in all required fields marked with *</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-5 h-5 rounded-full bg-primary-green text-white text-xs flex items-center justify-center mr-2 mt-0.5">2</span>
                      <span>Enter skills as comma-separated values</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-5 h-5 rounded-full bg-primary-green text-white text-xs flex items-center justify-center mr-2 mt-0.5">3</span>
                      <span>Optionally add a photo URL for the candidate</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-5 h-5 rounded-full bg-primary-green text-white text-xs flex items-center justify-center mr-2 mt-0.5">4</span>
                      <span>Click "Add Candidate" to submit</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Note</h3>
                  <p className="text-sm text-gray-600">
                    New candidates will appear in the Hiring Statistics dashboard after they are added. 
                    You can update their status later in the candidate management section.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TalentManagement;