import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ClipboardCheck,
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Trash2,
  Calendar,
  User,
  Truck,
  AlertTriangle,
  CheckCircle,
  Clock,
  Camera,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";

interface PTIChecklistItem {
  id: string;
  name: string;
  status: "ok" | "not_ok" | "pending";
  comment?: string;
  photo?: string;
}

interface PTISession {
  id: string;
  vehicleId: string;
  driverId: string;
  status: "pending" | "in_progress" | "completed" | "overdue";
  dueDate: Date;
  createdAt: Date;
  completedAt?: Date;
  checklist: PTIChecklistItem[];
  issuesCount: number;
  priority: "low" | "medium" | "high";
}

// Standard PTI checklist items
const standardChecklist: Omit<PTIChecklistItem, "id">[] = [
  { name: "Brakes", status: "pending" },
  { name: "Tires", status: "pending" },
  { name: "Lights", status: "pending" },
  { name: "Fuel System", status: "pending" },
  { name: "Windshield Wipers", status: "pending" },
  { name: "Mirrors", status: "pending" },
  { name: "Horn", status: "pending" },
  { name: "Emergency Equipment", status: "pending" },
];

// Mock data
const mockSessions: PTISession[] = [
  {
    id: "1",
    vehicleId: "TRK-101",
    driverId: "John Doe",
    status: "completed",
    dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    checklist: [
      { id: "1", name: "Brakes", status: "ok" },
      { id: "2", name: "Tires", status: "ok" },
      { id: "3", name: "Lights", status: "ok" },
      { id: "4", name: "Fuel System", status: "ok" },
      { id: "5", name: "Windshield Wipers", status: "ok" },
      { id: "6", name: "Mirrors", status: "ok" },
      { id: "7", name: "Horn", status: "ok" },
      { id: "8", name: "Emergency Equipment", status: "ok" },
    ],
    issuesCount: 0,
    priority: "medium",
  },
  {
    id: "2",
    vehicleId: "VAN-205",
    driverId: "Sarah Smith",
    status: "completed",
    dueDate: new Date(Date.now() + 8 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 30 * 60 * 1000),
    checklist: [
      {
        id: "1",
        name: "Brakes",
        status: "not_ok",
        comment: "Brake pads worn, need replacement",
      },
      { id: "2", name: "Tires", status: "ok" },
      { id: "3", name: "Lights", status: "ok" },
      { id: "4", name: "Fuel System", status: "ok" },
      {
        id: "5",
        name: "Windshield Wipers",
        status: "not_ok",
        comment: "Wipers leaving streaks",
      },
      { id: "6", name: "Mirrors", status: "ok" },
      { id: "7", name: "Horn", status: "ok" },
      { id: "8", name: "Emergency Equipment", status: "ok" },
    ],
    issuesCount: 2,
    priority: "high",
  },
  {
    id: "3",
    vehicleId: "TRK-103",
    driverId: "Mike Johnson",
    status: "pending",
    dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    checklist: standardChecklist.map((item, index) => ({
      ...item,
      id: (index + 1).toString(),
    })),
    issuesCount: 0,
    priority: "medium",
  },
  {
    id: "4",
    vehicleId: "TRK-107",
    driverId: "Emily Davis",
    status: "overdue",
    dueDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    checklist: standardChecklist.map((item, index) => ({
      ...item,
      id: (index + 1).toString(),
    })),
    issuesCount: 0,
    priority: "high",
  },
];

const mockVehicles = [
  "TRK-101",
  "TRK-102",
  "TRK-103",
  "VAN-201",
  "VAN-202",
  "VAN-205",
  "TRK-107",
];
const mockDrivers = [
  "John Doe",
  "Sarah Smith",
  "Mike Johnson",
  "Emily Davis",
  "David Wilson",
];

export default function PTISessions() {
  const [sessions, setSessions] = useState<PTISession[]>(mockSessions);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<PTISession | null>(
    null,
  );
  const [formData, setFormData] = useState({
    vehicleId: "",
    driverId: "",
    dueDate: format(
      new Date(Date.now() + 24 * 60 * 60 * 1000),
      "yyyy-MM-dd'T'HH:mm",
    ),
    priority: "medium" as const,
    notes: "",
  });

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.driverId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || session.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCreateSession = () => {
    if (!formData.vehicleId || !formData.driverId || !formData.dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newSession: PTISession = {
      id: (sessions.length + 1).toString(),
      vehicleId: formData.vehicleId,
      driverId: formData.driverId,
      status: "pending",
      dueDate: new Date(formData.dueDate),
      createdAt: new Date(),
      checklist: standardChecklist.map((item, index) => ({
        ...item,
        id: (index + 1).toString(),
      })),
      issuesCount: 0,
      priority: formData.priority,
    };

    setSessions([newSession, ...sessions]);
    setIsCreateDialogOpen(false);
    resetFormData();
    toast.success("PTI session created successfully!");
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions(sessions.filter((session) => session.id !== sessionId));
    toast.success("PTI session deleted successfully!");
  };

  const openViewDialog = (session: PTISession) => {
    setSelectedSession(session);
    setIsViewDialogOpen(true);
  };

  const resetFormData = () => {
    setFormData({
      vehicleId: "",
      driverId: "",
      dueDate: format(
        new Date(Date.now() + 24 * 60 * 60 * 1000),
        "yyyy-MM-dd'T'HH:mm",
      ),
      priority: "medium",
      notes: "",
    });
  };

  const getStatusBadge = (status: PTISession["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-pti-green">Completed</Badge>;
      case "pending":
        return (
          <Badge variant="outline" className="text-pti-blue border-pti-blue">
            Pending
          </Badge>
        );
      case "in_progress":
        return <Badge className="bg-pti-orange text-white">In Progress</Badge>;
      case "overdue":
        return (
          <Badge variant="destructive" className="bg-pti-red">
            Overdue
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority: PTISession["priority"]) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="destructive" className="bg-pti-red text-xs">
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-pti-orange text-white text-xs">Medium</Badge>
        );
      case "low":
        return (
          <Badge variant="outline" className="text-pti-gray-600 text-xs">
            Low
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            Unknown
          </Badge>
        );
    }
  };

  const getChecklistItemIcon = (status: PTIChecklistItem["status"]) => {
    switch (status) {
      case "ok":
        return <CheckCircle className="h-4 w-4 text-pti-green" />;
      case "not_ok":
        return <AlertTriangle className="h-4 w-4 text-pti-red" />;
      case "pending":
        return <Clock className="h-4 w-4 text-pti-gray-400" />;
      default:
        return <Clock className="h-4 w-4 text-pti-gray-400" />;
    }
  };

  const getStatusStats = () => {
    return {
      total: sessions.length,
      pending: sessions.filter((s) => s.status === "pending").length,
      completed: sessions.filter((s) => s.status === "completed").length,
      overdue: sessions.filter((s) => s.status === "overdue").length,
      issues: sessions.filter((s) => s.issuesCount > 0).length,
    };
  };

  const stats = getStatusStats();

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-pti-gray-900">
              PTI Sessions
            </h1>
            <p className="text-pti-gray-600 mt-1">
              Manage pre-trip inspection sessions and assignments.
            </p>
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-pti-orange hover:bg-pti-orange-600">
                <Plus className="h-4 w-4 mr-2" />
                Create PTI Session
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-pti-orange" />
                  Create PTI Session
                </DialogTitle>
                <DialogDescription>
                  Assign a new pre-trip inspection to a driver and vehicle.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="vehicleId">Vehicle *</Label>
                  <Select
                    value={formData.vehicleId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, vehicleId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockVehicles.map((vehicle) => (
                        <SelectItem key={vehicle} value={vehicle}>
                          {vehicle}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="driverId">Driver *</Label>
                  <Select
                    value={formData.driverId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, driverId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a driver" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockDrivers.map((driver) => (
                        <SelectItem key={driver} value={driver}>
                          {driver}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dueDate">Due Date & Time *</Label>
                  <Input
                    id="dueDate"
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: "low" | "medium" | "high") =>
                      setFormData({ ...formData, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Any special instructions or notes..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateSession}
                  className="bg-pti-orange hover:bg-pti-orange-600"
                >
                  Create Session
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pti-gray-600">
                Total Sessions
              </CardTitle>
              <ClipboardCheck className="h-4 w-4 text-pti-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pti-gray-900">
                {stats.total}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pti-gray-600">
                Pending
              </CardTitle>
              <Clock className="h-4 w-4 text-pti-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pti-gray-900">
                {stats.pending}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pti-gray-600">
                Completed
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-pti-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pti-gray-900">
                {stats.completed}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pti-gray-600">
                Overdue
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-pti-red" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pti-gray-900">
                {stats.overdue}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pti-gray-600">
                With Issues
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-pti-red" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pti-gray-900">
                {stats.issues}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>PTI Sessions</CardTitle>
                <CardDescription>
                  Manage and monitor all pre-trip inspection sessions.
                </CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-pti-gray-400" />
                  <Input
                    placeholder="Search sessions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Issues</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-pti-blue" />
                        <span className="font-medium">{session.vehicleId}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-pti-gray-500" />
                        <span>{session.driverId}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(session.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {formatDistanceToNow(session.dueDate, {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <div className="text-xs text-pti-gray-500">
                        {format(session.dueDate, "MMM d, h:mm a")}
                      </div>
                    </TableCell>
                    <TableCell>{getPriorityBadge(session.priority)}</TableCell>
                    <TableCell>
                      {session.issuesCount > 0 ? (
                        <div className="flex items-center gap-1 text-pti-red">
                          <AlertTriangle className="h-3 w-3" />
                          <span className="text-sm">{session.issuesCount}</span>
                        </div>
                      ) : (
                        <span className="text-pti-gray-400 text-sm">None</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-pti-gray-500">
                      {formatDistanceToNow(session.createdAt, {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => openViewDialog(session)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteSession(session.id)}
                            className="text-pti-red"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-pti-orange" />
                PTI Session Details
              </DialogTitle>
              <DialogDescription>
                {selectedSession && (
                  <>
                    {selectedSession.vehicleId} • {selectedSession.driverId} •{" "}
                    {format(selectedSession.dueDate, "MMM d, yyyy h:mm a")}
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            {selectedSession && (
              <div className="space-y-6">
                {/* Session Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-pti-gray-500">Status</Label>
                    <div className="mt-1">
                      {getStatusBadge(selectedSession.status)}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-pti-gray-500">
                      Priority
                    </Label>
                    <div className="mt-1">
                      {getPriorityBadge(selectedSession.priority)}
                    </div>
                  </div>
                </div>

                {/* Checklist */}
                <div>
                  <h4 className="font-semibold text-pti-gray-900 mb-3">
                    Inspection Checklist
                  </h4>
                  <div className="space-y-3">
                    {selectedSession.checklist.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 p-3 rounded-lg border"
                      >
                        {getChecklistItemIcon(item.status)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{item.name}</span>
                            <Badge
                              variant={
                                item.status === "ok"
                                  ? "default"
                                  : item.status === "not_ok"
                                    ? "destructive"
                                    : "outline"
                              }
                              className={
                                item.status === "ok"
                                  ? "bg-pti-green"
                                  : item.status === "not_ok"
                                    ? "bg-pti-red"
                                    : ""
                              }
                            >
                              {item.status === "ok"
                                ? "OK"
                                : item.status === "not_ok"
                                  ? "Not OK"
                                  : "Pending"}
                            </Badge>
                          </div>
                          {item.comment && (
                            <div className="mt-2 p-2 bg-pti-gray-50 rounded text-sm">
                              <div className="flex items-center gap-1 text-pti-gray-600 mb-1">
                                <FileText className="h-3 w-3" />
                                <span className="text-xs">Comment</span>
                              </div>
                              {item.comment}
                            </div>
                          )}
                          {item.photo && (
                            <div className="mt-2 flex items-center gap-1 text-pti-blue text-sm">
                              <Camera className="h-3 w-3" />
                              <span>Photo attached</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                {selectedSession.status === "completed" && (
                  <div className="bg-pti-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-pti-gray-900 mb-2">
                      Completion Summary
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-pti-gray-600">Completed:</span>
                        <div className="font-medium">
                          {selectedSession.completedAt &&
                            format(
                              selectedSession.completedAt,
                              "MMM d, yyyy h:mm a",
                            )}
                        </div>
                      </div>
                      <div>
                        <span className="text-pti-gray-600">Issues Found:</span>
                        <div className="font-medium">
                          {selectedSession.issuesCount > 0 ? (
                            <span className="text-pti-red">
                              {selectedSession.issuesCount} issue
                              {selectedSession.issuesCount > 1 ? "s" : ""}
                            </span>
                          ) : (
                            <span className="text-pti-green">No issues</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsViewDialogOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
