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
  Clock, 
  AlertCircle, 
  CheckCircle, 
  User, 
  Calendar,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Filter,
  Bell
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';

interface CommunicationReminder {
  id: number;
  customer_id: string;
  plan_id?: number;
  record_id?: number;
  reminder_type: string;
  title: string;
  description?: string;
  due_date: string;
  priority: string;
  status: string;
  assigned_to?: string;
  completed_at?: string;
  created_at: string;
  customer_name: string;
}

export function CommunicationReminders() {
  const [reminders, setReminders] = useState<CommunicationReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<CommunicationReminder | null>(null);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Form state
  const [formData, setFormData] = useState({
    customer_id: '',
    plan_id: '',
    record_id: '',
    reminder_type: '',
    title: '',
    description: '',
    due_date: '',
    priority: 'medium',
    status: 'pending',
    assigned_to: ''
  });

  useEffect(() => {
    fetchReminders();
  }, [statusFilter]);

  const fetchReminders = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      
      const response = await fetch(`/api/communications/reminders?${params}`);
      const data = await response.json();
      if (data.success) {
        setReminders(data.data);
      }
    } catch (error) {
      console.error('Error fetching reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingReminder 
        ? `/api/communications/reminders/${editingReminder.id}`
        : '/api/communications/reminders';
      
      const method = editingReminder ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchReminders();
        setIsCreateDialogOpen(false);
        setEditingReminder(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving reminder:', error);
    }
  };

  const handleEdit = (reminder: CommunicationReminder) => {
    setEditingReminder(reminder);
    setFormData({
      customer_id: reminder.customer_id,
      plan_id: reminder.plan_id?.toString() || '',
      record_id: reminder.record_id?.toString() || '',
      reminder_type: reminder.reminder_type,
      title: reminder.title,
      description: reminder.description || '',
      due_date: reminder.due_date,
      priority: reminder.priority,
      status: reminder.status,
      assigned_to: reminder.assigned_to || ''
    });
    setIsCreateDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this reminder?')) {
      try {
        const response = await fetch(`/api/communications/reminders/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          await fetchReminders();
        }
      } catch (error) {
        console.error('Error deleting reminder:', error);
      }
    }
  };

  const handleStatusChange = async (reminder: CommunicationReminder, newStatus: string) => {
    try {
      const response = await fetch(`/api/communications/reminders/${reminder.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        await fetchReminders();
      }
    } catch (error) {
      console.error('Error updating reminder status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      customer_id: '',
      plan_id: '',
      record_id: '',
      reminder_type: '',
      title: '',
      description: '',
      due_date: '',
      priority: 'medium',
      status: 'pending',
      assigned_to: ''
    });
  };

  const handleCloseDialog = () => {
    setIsCreateDialogOpen(false);
    setEditingReminder(null);
    resetForm();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: string) => {
    const labels: { [key: string]: string } = {
      'high': 'High Priority',
      'medium': 'Medium Priority',
      'low': 'Low Priority'
    };
    return labels[priority] || priority;
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      'pending': 'Pending',
      'in_progress': 'In Progress',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    };
    return labels[status] || status;
  };

  const getReminderTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'follow_up': 'Follow-up',
      'meeting': 'Meeting Reminder',
      'call': 'Call Reminder',
      'document': 'Document Preparation',
      'review': 'Review Reminder',
      'deadline': 'Deadline',
      'birthday': 'Birthday Reminder',
      'anniversary': 'Anniversary',
      'custom': 'Custom'
    };
    return labels[type] || type;
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && statusFilter === 'pending';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredReminders = reminders.filter(reminder => {
    const matchesPriority = priorityFilter === 'all' || reminder.priority === priorityFilter;
    return matchesPriority;
  });

  // Sort reminders by due date and priority
  const sortedReminders = [...filteredReminders].sort((a, b) => {
    // Overdue items first
    const aOverdue = isOverdue(a.due_date);
    const bOverdue = isOverdue(b.due_date);
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;
    
    // Then by priority
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
    const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
    if (aPriority !== bPriority) return bPriority - aPriority;
    
    // Then by due date
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
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
      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Priority Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High Priority</SelectItem>
            <SelectItem value="medium">Medium Priority</SelectItem>
            <SelectItem value="low">Low Priority</SelectItem>
          </SelectContent>
        </Select>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Reminder
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingReminder ? 'Edit Reminder' : 'New Reminder'}
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
                  <Label htmlFor="reminder_type">Reminder Type</Label>
                  <Select value={formData.reminder_type} onValueChange={(value) => setFormData({ ...formData, reminder_type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reminder type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="follow_up">Follow-up</SelectItem>
                      <SelectItem value="meeting">Meeting Reminder</SelectItem>
                      <SelectItem value="call">Call Reminder</SelectItem>
                      <SelectItem value="document">Document Preparation</SelectItem>
                      <SelectItem value="review">Review Reminder</SelectItem>
                      <SelectItem value="deadline">Deadline</SelectItem>
                      <SelectItem value="birthday">Birthday Reminder</SelectItem>
                      <SelectItem value="anniversary">Anniversary</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Reminder Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g.: Quarterly Portfolio Review"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of the reminder content and requirements..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="due_date">Due Date *</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="assigned_to">Assigned To</Label>
                  <Input
                    id="assigned_to"
                    value={formData.assigned_to}
                    onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                    placeholder="Assignee name or ID"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingReminder ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Reminders List */}
      <div className="grid gap-4">
        {sortedReminders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Reminders</h3>
              <p className="text-muted-foreground text-center">
                {statusFilter === 'all' ? 'Start creating your first reminder' : `No ${getStatusLabel(statusFilter)} reminders`}
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedReminders.map((reminder) => (
            <Card key={reminder.id} className={`hover:shadow-md transition-shadow ${isOverdue(reminder.due_date) ? 'border-red-200 bg-red-50' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className={`h-5 w-5 ${isOverdue(reminder.due_date) ? 'text-red-500' : ''}`} />
                    {reminder.title}
                    {isOverdue(reminder.due_date) && (
                      <Badge variant="destructive" className="ml-2">
                        Overdue
                      </Badge>
                    )}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(reminder.priority)}>
                      {getPriorityLabel(reminder.priority)}
                    </Badge>
                    <Badge className={getStatusColor(reminder.status)}>
                      {getStatusLabel(reminder.status)}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleEdit(reminder)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        {reminder.status !== 'completed' && (
                          <DropdownMenuItem onClick={() => handleStatusChange(reminder, 'completed')}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Complete
                          </DropdownMenuItem>
                        )}
                        {reminder.status !== 'in_progress' && reminder.status !== 'completed' && (
                          <DropdownMenuItem onClick={() => handleStatusChange(reminder, 'in_progress')}>
                            <Clock className="h-4 w-4 mr-2" />
                            Start Processing
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleDelete(reminder.id)} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{reminder.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className={isOverdue(reminder.due_date) ? 'text-red-600 font-medium' : ''}>
                      {formatDate(reminder.due_date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <span>{getReminderTypeLabel(reminder.reminder_type)}</span>
                  </div>
                </div>
                
                {reminder.description && (
                  <div className="mb-4">
                    <h4 className="font-medium text-sm">Description:</h4>
                    <p className="text-sm text-muted-foreground">{reminder.description}</p>
                  </div>
                )}
                
                {reminder.assigned_to && (
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Assigned to:</span> {reminder.assigned_to}
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