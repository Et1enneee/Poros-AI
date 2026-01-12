import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Clock, 
  User, 
  FileText, 
  Star,
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Calendar,
  Phone,
  Mail,
  Video,
  MapPin
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface CommunicationRecord {
  id: number;
  customer_id: string;
  plan_id?: number;
  contact_date: string;
  contact_type: string;
  duration_minutes?: number;
  location?: string;
  summary: string;
  key_discussions?: string;
  decisions_made?: string;
  commitments?: string;
  action_items?: string;
  satisfaction_rating?: number;
  follow_up_required: boolean;
  follow_up_date?: string;
  documents: string[];
  next_contact_scheduled: boolean;
  next_contact_date?: string;
  status: string;
  customer_name: string;
  plan_name?: string;
  created_at: string;
}

export function CommunicationRecords() {
  const [records, setRecords] = useState<CommunicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<CommunicationRecord | null>(null);
  const [activeTab, setActiveTab] = useState('list');

  // Form state
  const [formData, setFormData] = useState({
    customer_id: '',
    plan_id: '',
    contact_date: new Date().toISOString().split('T')[0],
    contact_type: '',
    duration_minutes: '',
    location: '',
    summary: '',
    key_discussions: '',
    decisions_made: '',
    commitments: '',
    action_items: '',
    satisfaction_rating: '',
    follow_up_required: false,
    follow_up_date: '',
    documents: [] as string[],
    next_contact_scheduled: false,
    next_contact_date: '',
    status: 'completed'
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await fetch('/api/communications/records?limit=100');
      const data = await response.json();
      if (data.success) {
        setRecords(data.data.map((record: any) => ({
          ...record,
          documents: record.documents ? JSON.parse(record.documents) : []
        })));
      }
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingRecord 
        ? `/api/communications/records/${editingRecord.id}`
        : '/api/communications/records';
      
      const method = editingRecord ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchRecords();
        setIsCreateDialogOpen(false);
        setEditingRecord(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving record:', error);
    }
  };

  const handleEdit = (record: CommunicationRecord) => {
    setEditingRecord(record);
    setFormData({
      customer_id: record.customer_id,
      plan_id: record.plan_id?.toString() || '',
      contact_date: record.contact_date.split('T')[0],
      contact_type: record.contact_type,
      duration_minutes: record.duration_minutes?.toString() || '',
      location: record.location || '',
      summary: record.summary,
      key_discussions: record.key_discussions || '',
      decisions_made: record.decisions_made || '',
      commitments: record.commitments || '',
      action_items: record.action_items || '',
      satisfaction_rating: record.satisfaction_rating?.toString() || '',
      follow_up_required: record.follow_up_required,
      follow_up_date: record.follow_up_date?.split('T')[0] || '',
      documents: record.documents,
      next_contact_scheduled: record.next_contact_scheduled,
      next_contact_date: record.next_contact_date?.split('T')[0] || '',
      status: record.status
    });
    setIsCreateDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this communication record?')) {
      try {
        const response = await fetch(`/api/communications/records/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          await fetchRecords();
        }
      } catch (error) {
        console.error('Error deleting record:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      customer_id: '',
      plan_id: '',
      contact_date: new Date().toISOString().split('T')[0],
      contact_type: '',
      duration_minutes: '',
      location: '',
      summary: '',
      key_discussions: '',
      decisions_made: '',
      commitments: '',
      action_items: '',
      satisfaction_rating: '',
      follow_up_required: false,
      follow_up_date: '',
      documents: [],
      next_contact_scheduled: false,
      next_contact_date: '',
      status: 'completed'
    });
  };

  const handleCloseDialog = () => {
    setIsCreateDialogOpen(false);
    setEditingRecord(null);
    resetForm();
  };

  const getContactTypeIcon = (type: string) => {
    switch (type) {
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'video_call': return <Video className="h-4 w-4" />;
      case 'in_person': return <MapPin className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getContactTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'phone': 'Phone',
      'email': 'Email',
      'video_call': 'Video Call',
      'in_person': 'In Person',
      'meeting': 'Meeting',
      'chat': 'Chat'
    };
    return labels[type] || type;
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-2">{rating}/5</span>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Create Record Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Communication Record
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRecord ? 'Edit Communication Record' : 'New Communication Record'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
                <TabsTrigger value="followup">Follow-up</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
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
                    <Label htmlFor="plan_id">Associated Plan ID (Optional)</Label>
                    <Input
                      id="plan_id"
                      value={formData.plan_id}
                      onChange={(e) => setFormData({ ...formData, plan_id: e.target.value })}
                      placeholder="Plan ID"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_date">Communication Date</Label>
                    <Input
                      id="contact_date"
                      type="datetime-local"
                      value={formData.contact_date}
                      onChange={(e) => setFormData({ ...formData, contact_date: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contact_type">Communication Type</Label>
                    <Select value={formData.contact_type} onValueChange={(value) => setFormData({ ...formData, contact_type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select communication type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="video_call">Video Call</SelectItem>
                        <SelectItem value="in_person">In Person</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="chat">Chat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration_minutes">Duration (Minutes)</Label>
                    <Input
                      id="duration_minutes"
                      type="number"
                      value={formData.duration_minutes}
                      onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                      placeholder="30"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location/Platform</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g.: Zoom, Office, Phone"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="summary">Communication Summary *</Label>
                  <Textarea
                    id="summary"
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    placeholder="Briefly summarize the main content of this communication..."
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="key_discussions">Key Discussions</Label>
                  <Textarea
                    id="key_discussions"
                    value={formData.key_discussions}
                    onChange={(e) => setFormData({ ...formData, key_discussions: e.target.value })}
                    placeholder="Record detailed content of important discussions..."
                    rows={4}
                  />
                </div>
              </TabsContent>

              <TabsContent value="outcomes" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="decisions_made">Decisions Made</Label>
                  <Textarea
                    id="decisions_made"
                    value={formData.decisions_made}
                    onChange={(e) => setFormData({ ...formData, decisions_made: e.target.value })}
                    placeholder="Record important decisions made by both parties..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commitments">Commitments</Label>
                  <Textarea
                    id="commitments"
                    value={formData.commitments}
                    onChange={(e) => setFormData({ ...formData, commitments: e.target.value })}
                    placeholder="Record commitments and agreements made by both parties..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="satisfaction_rating">Satisfaction Rating</Label>
                  <Select value={formData.satisfaction_rating} onValueChange={(value) => setFormData({ ...formData, satisfaction_rating: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select satisfaction rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Star - Very Dissatisfied</SelectItem>
                      <SelectItem value="2">2 Stars - Dissatisfied</SelectItem>
                      <SelectItem value="3">3 Stars - Neutral</SelectItem>
                      <SelectItem value="4">4 Stars - Satisfied</SelectItem>
                      <SelectItem value="5">5 Stars - Very Satisfied</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="followup" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="action_items">Action Items</Label>
                  <Textarea
                    id="action_items"
                    value={formData.action_items}
                    onChange={(e) => setFormData({ ...formData, action_items: e.target.value })}
                    placeholder="List action items that need follow-up..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="follow_up_required"
                    checked={formData.follow_up_required}
                    onChange={(e) => setFormData({ ...formData, follow_up_required: e.target.checked })}
                  />
                  <Label htmlFor="follow_up_required">Follow-up Required</Label>
                </div>

                {formData.follow_up_required && (
                  <div className="space-y-2">
                    <Label htmlFor="follow_up_date">Follow-up Date</Label>
                    <Input
                      id="follow_up_date"
                      type="date"
                      value={formData.follow_up_date}
                      onChange={(e) => setFormData({ ...formData, follow_up_date: e.target.value })}
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="next_contact_scheduled"
                    checked={formData.next_contact_scheduled}
                    onChange={(e) => setFormData({ ...formData, next_contact_scheduled: e.target.checked })}
                  />
                  <Label htmlFor="next_contact_scheduled">Next Communication Scheduled</Label>
                </div>

                {formData.next_contact_scheduled && (
                  <div className="space-y-2">
                    <Label htmlFor="next_contact_date">Next Communication Date</Label>
                    <Input
                      id="next_contact_date"
                      type="date"
                      value={formData.next_contact_date}
                      onChange={(e) => setFormData({ ...formData, next_contact_date: e.target.value })}
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit">
                {editingRecord ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Records Display */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="grid gap-4">
            {records.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Communication Records</h3>
                  <p className="text-muted-foreground text-center">
                    Start recording your customer communication history
                  </p>
                </CardContent>
              </Card>
            ) : (
              records.map((record) => (
                <Card key={record.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        {getContactTypeIcon(record.contact_type)}
                        {getContactTypeLabel(record.contact_type)} - {record.customer_name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {renderStars(record.satisfaction_rating)}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleEdit(record)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(record.id)} className="text-red-600">
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
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(record.contact_date)}</span>
                      </div>
                      {record.duration_minutes && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{record.duration_minutes} minutes</span>
                        </div>
                      )}
                      {record.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{record.location}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <h4 className="font-medium text-sm">Summary:</h4>
                        <p className="text-sm text-muted-foreground">{record.summary}</p>
                      </div>
                      
                      {record.key_discussions && (
                        <div>
                          <h4 className="font-medium text-sm">Key Discussions:</h4>
                          <p className="text-sm text-muted-foreground">{record.key_discussions}</p>
                        </div>
                      )}
                      
                      {record.action_items && (
                        <div>
                          <h4 className="font-medium text-sm">Action Items:</h4>
                          <p className="text-sm text-muted-foreground">{record.action_items}</p>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm">
                        {record.follow_up_required && (
                          <Badge variant="outline">
                            Follow-up Required: {record.follow_up_date}
                          </Badge>
                        )}
                        {record.next_contact_scheduled && (
                          <Badge variant="outline">
                            Next Communication: {record.next_contact_date}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <div className="relative">
            {records.map((record, index) => (
              <div key={record.id} className="relative flex items-start gap-4 pb-8">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    {getContactTypeIcon(record.contact_type)}
                  </div>
                  {index < records.length - 1 && (
                    <div className="h-full w-px bg-border" />
                  )}
                </div>
                <Card className="flex-1">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{record.customer_name}</h3>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(record.contact_date)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {getContactTypeLabel(record.contact_type)}
                    </p>
                    <p className="text-sm">{record.summary}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}