import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Calendar, 
  Clock, 
  User, 
  Target, 
  FileText, 
  Plus,
  Edit,
  Trash2,
  MoreHorizontal
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface CommunicationPlan {
  id: number;
  customer_id: string;
  plan_name: string;
  plan_type: string;
  frequency: string;
  next_contact_date: string;
  target_date?: string;
  status: string;
  agenda?: string;
  objectives?: string;
  notes?: string;
  customer_name: string;
  customer_email: string;
  created_at: string;
  updated_at: string;
}

interface CommunicationPlansProps {
  searchTerm: string;
  statusFilter: string;
}

export function CommunicationPlans({ searchTerm, statusFilter }: CommunicationPlansProps) {
  const [plans, setPlans] = useState<CommunicationPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<CommunicationPlan | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    customer_id: '',
    plan_name: '',
    plan_type: '',
    frequency: '',
    next_contact_date: '',
    target_date: '',
    status: 'active',
    agenda: '',
    objectives: '',
    notes: ''
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/communications/plans');
      const data = await response.json();
      if (data.success) {
        setPlans(data.data);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingPlan 
        ? `/api/communications/plans/${editingPlan.id}`
        : '/api/communications/plans';
      
      const method = editingPlan ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchPlans();
        setIsCreateDialogOpen(false);
        setEditingPlan(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving plan:', error);
    }
  };

  const handleEdit = (plan: CommunicationPlan) => {
    setEditingPlan(plan);
    setFormData({
      customer_id: plan.customer_id,
      plan_name: plan.plan_name,
      plan_type: plan.plan_type,
      frequency: plan.frequency,
      next_contact_date: plan.next_contact_date,
      target_date: plan.target_date || '',
      status: plan.status,
      agenda: plan.agenda || '',
      objectives: plan.objectives || '',
      notes: plan.notes || ''
    });
    setIsCreateDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this communication plan?')) {
      try {
        const response = await fetch(`/api/communications/plans/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          await fetchPlans();
        }
      } catch (error) {
        console.error('Error deleting plan:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      customer_id: '',
      plan_name: '',
      plan_type: '',
      frequency: '',
      next_contact_date: '',
      target_date: '',
      status: 'active',
      agenda: '',
      objectives: '',
      notes: ''
    });
  };

  const handleCloseDialog = () => {
    setIsCreateDialogOpen(false);
    setEditingPlan(null);
    resetForm();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels: { [key: string]: string } = {
      'weekly': 'Weekly',
      'biweekly': 'Bi-weekly',
      'monthly': 'Monthly',
      'quarterly': 'Quarterly',
      'annually': 'Annually',
      'custom': 'Custom'
    };
    return labels[frequency] || frequency;
  };

  // Filter plans based on search term and status
  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.plan_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.plan_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || plan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Create Plan Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Communication Plan
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPlan ? 'Edit Communication Plan' : 'New Communication Plan'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer_id">Customer ID</Label>
                <Input
                  id="customer_id"
                  value={formData.customer_id}
                  onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                  placeholder="e.g.: CUST_0001"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="plan_name">Plan Name</Label>
                <Input
                  id="plan_name"
                  value={formData.plan_name}
                  onChange={(e) => setFormData({ ...formData, plan_name: e.target.value })}
                  placeholder="e.g.: Quarterly Investment Review"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plan_type">Plan Type</Label>
                <Select value={formData.plan_type} onValueChange={(value) => setFormData({ ...formData, plan_type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="investment_review">Investment Review</SelectItem>
                    <SelectItem value="portfolio_consultation">Portfolio Consultation</SelectItem>
                    <SelectItem value="goal_setting">Goal Setting</SelectItem>
                    <SelectItem value="risk_assessment">Risk Assessment</SelectItem>
                    <SelectItem value="regular_checkup">Regular Checkup</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="frequency">Communication Frequency</Label>
                <Select value={formData.frequency} onValueChange={(value) => setFormData({ ...formData, frequency: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="next_contact_date">Next Contact Date</Label>
                <Input
                  id="next_contact_date"
                  type="date"
                  value={formData.next_contact_date}
                  onChange={(e) => setFormData({ ...formData, next_contact_date: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="target_date">Target Completion Date</Label>
                <Input
                  id="target_date"
                  type="date"
                  value={formData.target_date}
                  onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="agenda">Agenda</Label>
              <Textarea
                id="agenda"
                value={formData.agenda}
                onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
                placeholder="List the main topics for communication..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="objectives">Objectives</Label>
              <Textarea
                id="objectives"
                value={formData.objectives}
                onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                placeholder="Describe the objectives of this communication..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Other information to record..."
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit">
                {editingPlan ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Plans List */}
      <div className="grid gap-4">
        {filteredPlans.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Communication Plans</h3>
              <p className="text-muted-foreground text-center">
                Start creating your first customer communication plan
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredPlans.map((plan) => (
            <Card key={plan.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    {plan.plan_name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(plan.status)}>
                      {plan.status === 'active' ? 'Active' : 
                       plan.status === 'paused' ? 'Paused' : 'Completed'}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleEdit(plan)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(plan.id)} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{plan.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{getFrequencyLabel(plan.frequency)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{plan.next_contact_date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{plan.plan_type}</span>
                  </div>
                </div>
                
                {(plan.agenda || plan.objectives) && (
                  <div className="mt-4 space-y-2">
                    {plan.agenda && (
                      <div>
                        <h4 className="font-medium text-sm">Agenda:</h4>
                        <p className="text-sm text-muted-foreground">{plan.agenda}</p>
                      </div>
                    )}
                    {plan.objectives && (
                      <div>
                        <h4 className="font-medium text-sm">Objectives:</h4>
                        <p className="text-sm text-muted-foreground">{plan.objectives}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}