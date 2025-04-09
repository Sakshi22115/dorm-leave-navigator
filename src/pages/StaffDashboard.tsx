
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { useData, LeaveRequest } from '@/context/DataContext';
import Layout from '@/components/Layout';
import StatusBadge from '@/components/StatusBadge';
import { useToast } from '@/components/ui/use-toast';

const StaffDashboard: React.FC = () => {
  const { user } = useAuth();
  const { leaveRequests, updateLeaveStatus } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if not logged in or is a student
  React.useEffect(() => {
    if (!user) {
      navigate('/');
    } else if (user.role === 'student') {
      navigate('/student-dashboard');
    }
  }, [user, navigate]);

  if (!user) return null;

  const pendingRequests = leaveRequests.filter(
    (request) => request.status === 'pending'
  );

  const approvedRequests = leaveRequests.filter(
    (request) => request.status === 'approved'
  );

  const rejectedRequests = leaveRequests.filter(
    (request) => request.status === 'rejected'
  );

  const handleApprove = (id: string) => {
    updateLeaveStatus(id, 'approved');
    toast({
      title: "Request approved",
      description: "The leave request has been approved",
    });
  };

  const handleReject = (id: string) => {
    updateLeaveStatus(id, 'rejected');
    toast({
      title: "Request rejected",
      description: "The leave request has been rejected",
    });
  };

  const RequestCard: React.FC<{ request: LeaveRequest; showActions?: boolean }> = ({ request, showActions = false }) => (
    <Card key={request.id} className="mb-4">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">{request.studentName}</h3>
              <StatusBadge status={request.status} />
            </div>
            <p className="font-medium">{request.reason}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(request.startDate).toLocaleDateString()} to {new Date(request.endDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Contact: {request.contactNumber}
            </p>
            <p className="text-sm text-muted-foreground">
              Submitted on {new Date(request.createdAt).toLocaleDateString()}
            </p>
          </div>
          {showActions && (
            <div className="flex gap-2 self-end mt-2 md:mt-0">
              <Button 
                onClick={() => handleReject(request.id)}
                variant="destructive"
              >
                Reject
              </Button>
              <Button 
                onClick={() => handleApprove(request.id)}
                variant="default"
                className="bg-green-600 hover:bg-green-700"
              >
                Approve
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout title={`${user.role === 'warden' ? 'Warden' : 'Faculty'} Dashboard`}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Leave Request Management</CardTitle>
            <CardDescription>
              {user.role === 'warden' 
                ? 'Manage and approve hostel leave requests'
                : 'Review and process student leave requests'}
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending" className="relative">
              Pending
              {pendingRequests.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {pendingRequests.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No pending leave requests
              </div>
            ) : (
              pendingRequests.map((request) => (
                <RequestCard key={request.id} request={request} showActions={true} />
              ))
            )}
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            {approvedRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No approved leave requests
              </div>
            ) : (
              approvedRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            {rejectedRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No rejected leave requests
              </div>
            ) : (
              rejectedRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default StaffDashboard;
