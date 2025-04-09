
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<"student" | "faculty" | "warden">("student");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would validate credentials against a backend
    if (email && password) {
      // Mock login - in a real app this would verify against a database
      const userData = {
        id: email, // Using email as the ID for internal storage
        name: mockUsernames[role],
        role,
      };
      
      login(userData);
      toast({
        title: "Login successful",
        description: `Welcome, ${userData.name}`,
      });
      
      // Redirect based on role
      if (role === "student") {
        navigate("/student-dashboard");
      } else {
        navigate("/staff-dashboard");
      }
    } else {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Please enter valid credentials",
      });
    }
  };

  // Mock usernames for demonstration
  const mockUsernames: Record<string, string> = {
    student: "John Student",
    faculty: "Dr. Madhusudhan",
    warden: "Dr. Geetha",
  };

  // Email placeholders based on role
  const getEmailPlaceholder = () => {
    switch(role) {
      case "student":
        return "230701279@gmail.com or 230701300@gmail.com";
      case "faculty":
        return "madhusudhan@gmail.com";
      case "warden":
        return "geetha@gmail.com";
      default:
        return "email@example.com";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Hostel Leave Management</CardTitle>
          <CardDescription>Login to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Login As</Label>
              <RadioGroup
                value={role}
                onValueChange={(value) => setRole(value as "student" | "faculty" | "warden")}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student">Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="faculty" id="faculty" />
                  <Label htmlFor="faculty">Faculty</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="warden" id="warden" />
                  <Label htmlFor="warden">Warden</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={getEmailPlaceholder()}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
