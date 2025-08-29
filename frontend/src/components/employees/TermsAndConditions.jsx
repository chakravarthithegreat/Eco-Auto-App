import React, { useState, useEffect } from 'react';
import { useEmployeeSignUpStore } from '../../state/employeeSignUpStore';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Checkbox } from '../ui/Checkbox';
import { Label } from '../ui/Label';
import { Alert, AlertDescription } from '../ui/Alert';
import { 
  FileText, 
  AlertCircle,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

const TermsAndConditions = ({ onAccept, showAcceptButton = true }) => {
  const { 
    termsAndConditions, 
    fetchTermsAndConditions, 
    isLoading, 
    error 
  } = useEmployeeSignUpStore();

  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    fetchTermsAndConditions();
  }, [fetchTermsAndConditions]);

  const handleAccept = () => {
    if (onAccept) {
      onAccept(accepted);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading terms and conditions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading terms and conditions: {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <FileText className="h-6 w-6 text-primary-green" />
            Terms and Conditions
          </CardTitle>
          <p className="text-gray-500">
            Please read and understand the following terms and conditions
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="prose max-w-none">
            {termsAndConditions && termsAndConditions.length > 0 ? (
              termsAndConditions.map((policy, index) => (
                <div key={index} className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{policy.title}</h2>
                  <p className="text-gray-700 mb-4">{policy.description}</p>
                  
                  {policy.content && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <div className="whitespace-pre-wrap">{policy.content}</div>
                    </div>
                  )}
                  
                  {policy.rules && policy.rules.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-800 mb-2">Rules:</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {policy.rules.map((rule, ruleIndex) => (
                          <li key={ruleIndex} className={rule.isMandatory ? "font-medium" : ""}>
                            <span className="font-medium">{rule.ruleTitle}:</span> {rule.ruleDescription}
                            {rule.isMandatory && <span className="text-red-500 ml-1">*</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {policy.lawReference && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Legal Reference
                      </h3>
                      <p className="text-blue-700">
                        <span className="font-medium">{policy.lawReference.lawName}</span> 
                        {policy.lawReference.lawNumber && ` (${policy.lawReference.lawNumber})`}
                        {policy.lawReference.year && `, ${policy.lawReference.year}`}
                        {policy.lawReference.section && `, Section ${policy.lawReference.section}`}
                        {policy.lawReference.subsection && `, Subsection ${policy.lawReference.subsection}`}
                      </p>
                    </div>
                  )}
                  
                  {policy.applicableTo && policy.applicableTo.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Applicable to:</span> {policy.applicableTo.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No terms and conditions found</h3>
                <p className="text-gray-500">
                  There are currently no terms and conditions configured in the system.
                </p>
              </div>
            )}
          </div>
          
          {showAcceptButton && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="acceptTerms"
                  checked={accepted}
                  onCheckedChange={setAccepted}
                  className="mt-1"
                />
                <div>
                  <Label htmlFor="acceptTerms" className="font-medium">
                    I accept these Terms and Conditions *
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">
                    By checking this box, you agree to abide by all the terms and conditions listed above.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={handleAccept} 
                  disabled={!accepted}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Accept Terms and Conditions
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsAndConditions;