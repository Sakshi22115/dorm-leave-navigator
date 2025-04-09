
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { useData, LeaveRequest } from '@/context/DataContext';
import Layout from '@/components/Layout';
import StatusBadge from '@/components/StatusBadge';
import { useToast } from '@/components/ui/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { leaveRequests, addLeaveRequest } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();

  // For the leave request form
  const [reason, setReason] = useState('');
  const [contactNumber, setContactNumber] = useState('9876543210'); // Prefilled parent's number
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Redirect if not logged in or not a student
  React.useEffect(() => {
    if (!user) {
      navigate('/');
    } else if (user.role !== 'student') {
      navigate('/staff-dashboard');
    }
  }, [user, navigate]);

  if (!user) return null;

  // Filter leave requests for the current student
  const myLeaveRequests = leaveRequests.filter(
    (request) => request.studentId === user.id
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      toast({
        variant: "destructive",
        title: "Missing dates",
        description: "Please select both start and end dates",
      });
      return;
    }

    if (startDate > endDate) {
      toast({
        variant: "destructive",
        title: "Invalid date range",
        description: "End date should be after start date",
      });
      return;
    }

    const newRequest = {
      studentId: user.id,
      studentName: user.name,
      reason,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      contactNumber,
    };

    addLeaveRequest(newRequest);
    
    toast({
      title: "Leave request submitted",
      description: "Your request has been submitted for approval",
    });
    
    // Reset form
    setReason('');
    setStartDate(undefined);
    setEndDate(undefined);
    setIsFormOpen(false);
  };

  return (
    <Layout title="Student Dashboard">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Your Leave Requests</h2>
          <Button onClick={() => setIsFormOpen(!isFormOpen)}>
            {isFormOpen ? 'Cancel' : 'New Leave Request'}
          </Button>
        </div>

        {isFormOpen && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>New Leave Request</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Leave</Label>
                  <Textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Describe your reason"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Parent's Contact Number</Label>
                  <Input
                    id="contactNumber"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="Parent's phone number"
                    required
                  />
                  <p className="text-sm text-muted-foreground">This number will be used for verification</p>
                </div>

                <Button type="submit" className="w-full">Submit Request</Button>
              </form>
            </CardContent>
          </Card>
        )}

        {myLeaveRequests.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              You haven't made any leave requests yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {myLeaveRequests.map((request: LeaveRequest) => (
              <Card key={request.id} className="overflow-hidden">
                <div className={`h-2 ${
                  request.status === 'approved' ? 'bg-green-500' : 
                  request.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg">{request.reason}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(request.startDate).toLocaleDateString()} to {new Date(request.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Submitted on {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <StatusBadge status={request.status} />
                      <p className="text-sm mt-2">Contact: {request.contactNumber}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StudentDashboard;
