
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useCRM } from '@/context/CRMContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { toast } from 'sonner';

const SupportHistory = () => {
  const { currentCustomer, addSupportRecord, getSupportHistory } = useCRM();
  const [newIssue, setNewIssue] = useState({
    type: 'inquiry' as const,
    description: '',
  });
  
  const supportHistory = currentCustomer 
    ? getSupportHistory(currentCustomer.id)
    : [];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentCustomer) {
      toast.error("Please create a customer profile first", {
        description: "You need to create a profile before submitting support issues.",
      });
      return;
    }
    
    if (!newIssue.description.trim()) {
      toast.error("Description required", {
        description: "Please provide details about your issue.",
      });
      return;
    }
    
    addSupportRecord({
      customerId: currentCustomer.id,
      type: newIssue.type,
      description: newIssue.description,
      status: 'open'
    });
    
    toast.success("Support request submitted", {
      description: "We'll get back to you as soon as possible.",
    });
    
    setNewIssue({
      type: 'inquiry',
      description: '',
    });
  };
  
  const statusColors = {
    open: "bg-blue-500",
    in_progress: "bg-yellow-500",
    resolved: "bg-green-500",
    closed: "bg-gray-500",
  };
  
  const typeLabels = {
    inquiry: "General Inquiry",
    complaint: "Complaint",
    feedback: "Feedback",
    order_issue: "Order Issue",
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Customer Support</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>New Support Request</CardTitle>
                <CardDescription>
                  Submit a new support request or provide feedback
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Issue Type</Label>
                    <Select
                      value={newIssue.type}
                      onValueChange={(value: any) => setNewIssue(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select issue type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inquiry">General Inquiry</SelectItem>
                        <SelectItem value="complaint">Complaint</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="order_issue">Order Issue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description"
                      placeholder="Please describe your issue or feedback in detail..."
                      rows={5}
                      value={newIssue.description}
                      onChange={(e) => setNewIssue(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button type="submit" className="w-full bg-[#CA3F3F] hover:bg-[#B02E2E] text-white">
                    Submit Request
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Support History</CardTitle>
                <CardDescription>
                  {supportHistory.length > 0 
                    ? `You have ${supportHistory.length} support record(s)` 
                    : "Your support history will appear here"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentCustomer ? (
                  supportHistory.length > 0 ? (
                    <div className="space-y-6">
                      {supportHistory.map((record, index) => (
                        <div key={record.id} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                            <div>
                              <Badge className={statusColors[record.status as keyof typeof statusColors]}>
                                {record.status.replace("_", " ").toUpperCase()}
                              </Badge>
                              <span className="ml-2 text-sm font-medium">
                                {typeLabels[record.type as keyof typeof typeLabels]}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {format(new Date(record.createdAt), "MMM d, yyyy h:mm a")}
                            </span>
                          </div>
                          
                          <p className="text-sm mt-2">{record.description}</p>
                          
                          {record.resolution && (
                            <>
                              <Separator className="my-3" />
                              <div>
                                <p className="text-xs font-semibold text-gray-600 mb-1">Resolution:</p>
                                <p className="text-sm">{record.resolution}</p>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-12 text-muted-foreground">No support requests yet.</p>
                  )
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">Please create a customer profile first</p>
                    <Button 
                      variant="outline" 
                      onClick={() => window.location.href = '/profile'}
                    >
                      Create Profile
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SupportHistory;
