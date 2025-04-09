
import React, { useState } from 'react';
import { useData, LeaveRequest } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const AddDummyDataForm: React.FC = () => {
  const [jsonData, setJsonData] = useState('');
  const { setCustomLeaveRequests } = useData();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const parsedData = JSON.parse(jsonData);
      
      // Basic validation to ensure it's an array of leave requests
      if (!Array.isArray(parsedData)) {
        throw new Error('The provided data must be an array of leave requests');
      }
      
      // Check if each item has the required properties
      parsedData.forEach((item, index) => {
        const requiredProps = ['studentId', 'studentName', 'reason', 'startDate', 'endDate', 'status', 'contactNumber'];
        for (const prop of requiredProps) {
          if (!(prop in item)) {
            throw new Error(`Item at index ${index} is missing the required property: ${prop}`);
          }
        }
        
        // Add ID and createdAt if missing
        if (!item.id) {
          item.id = Math.random().toString(36).substring(2, 9);
        }
        
        if (!item.createdAt) {
          item.createdAt = new Date().toISOString();
        }
      });
      
      // Set the custom data
      setCustomLeaveRequests(parsedData as LeaveRequest[]);
      
      toast({
        title: "Success",
        description: `Added ${parsedData.length} custom leave requests`,
      });
      
      // Clear the textarea
      setJsonData('');
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error adding custom data",
        description: error instanceof Error ? error.message : 'Invalid JSON format',
      });
    }
  };

  const sampleData = [
    {
      "studentId": "student1@example.com",
      "studentName": "Alex Johnson",
      "reason": "Family wedding",
      "startDate": "2025-05-10",
      "endDate": "2025-05-15",
      "status": "pending",
      "contactNumber": "9876543210"
    },
    {
      "studentId": "student2@example.com",
      "studentName": "Maya Patel",
      "reason": "Medical emergency",
      "startDate": "2025-05-05",
      "endDate": "2025-05-07",
      "status": "approved",
      "contactNumber": "8765432109"
    }
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Add Custom Dummy Data</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Textarea
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              placeholder={`Paste your JSON array here, for example:\n${JSON.stringify(sampleData, null, 2)}`}
              className="h-[200px] font-mono text-sm"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Paste a JSON array of leave requests. Each object must have studentId, studentName, reason, startDate, endDate, status, and contactNumber.
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button type="submit">Add Custom Data</Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setJsonData(JSON.stringify(sampleData, null, 2))}
            >
              Load Sample
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddDummyDataForm;
