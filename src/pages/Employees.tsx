import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  UserPlus,
  Mail,
  Phone,
  Truck,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

interface Employee {
  id: string;
  name: string;
  email: string;
  role: "driver" | "dispatcher";
  phone: string;
  assignedVehicle?: string;
  status: "active" | "inactive";
  createdAt: Date;
  lastActive: Date;
}

// Mock data
const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@company.com",
    role: "driver",
    phone: "+1 (555) 123-4567",
    assignedVehicle: "Truck #101",
    status: "active",
    createdAt: new Date("2024-01-15"),
    lastActive: new Date(Date.now() - 2 * 60 * 1000),
  },
  {
    id: "2",
    name: "Sarah Smith",
    email: "sarah.smith@company.com",
    role: "driver",
    phone: "+1 (555) 234-5678",
    assignedVehicle: "Van #205",
    status: "active",
    createdAt: new Date("2024-02-01"),
    lastActive: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    role: "dispatcher",
    phone: "+1 (555) 345-6789",
    status: "active",
    createdAt: new Date("2024-01-10"),
    lastActive: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@company.com",
    role: "driver",
    phone: "+1 (555) 456-7890",
    assignedVehicle: "Truck #107",
    status: "inactive",
    createdAt: new Date("2024-03-01"),
    lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
];

const mockVehicles = [
  "Truck #101",
  "Truck #102",
  "Truck #103",
  "Van #201",
  "Van #202",
  "Truck #107",
];

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "driver" as const,
    phone: "",
    assignedVehicle: "",
  });

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreateEmployee = () => {
    if (!formData.name || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newEmployee: Employee = {
      id: (employees.length + 1).toString(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      phone: formData.phone,
      assignedVehicle:
        formData.role === "driver" ? formData.assignedVehicle : undefined,
      status: "active",
      createdAt: new Date(),
      lastActive: new Date(),
    };

    setEmployees([...employees, newEmployee]);
    setIsCreateDialogOpen(false);
    setFormData({
      name: "",
      email: "",
      role: "driver",
      phone: "",
      assignedVehicle: "",
    });
    toast.success("Employee created successfully!");
  };

  const handleEditEmployee = () => {
    if (!selectedEmployee || !formData.name || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    const updatedEmployees = employees.map((emp) =>
      emp.id === selectedEmployee.id
        ? {
            ...emp,
            name: formData.name,
            email: formData.email,
            role: formData.role,
            phone: formData.phone,
            assignedVehicle:
              formData.role === "driver" ? formData.assignedVehicle : undefined,
          }
        : emp,
    );

    setEmployees(updatedEmployees);
    setIsEditDialogOpen(false);
    setSelectedEmployee(null);
    setFormData({
      name: "",
      email: "",
      role: "driver",
      phone: "",
      assignedVehicle: "",
    });
    toast.success("Employee updated successfully!");
  };

  const handleDeleteEmployee = (employeeId: string) => {
    setEmployees(employees.filter((emp) => emp.id !== employeeId));
    toast.success("Employee deleted successfully!");
  };

  const openEditDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      role: employee.role,
      phone: employee.phone,
      assignedVehicle: employee.assignedVehicle || "",
    });
    setIsEditDialogOpen(true);
  };

  const getRoleBadge = (role: string) => {
    return role === "driver" ? (
      <Badge variant="secondary" className="bg-pti-blue-50 text-pti-blue">
        <Truck className="h-3 w-3 mr-1" />
        Driver
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-pti-green-50 text-pti-green">
        <Shield className="h-3 w-3 mr-1" />
        Dispatcher
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-pti-green">Active</Badge>
    ) : (
      <Badge variant="outline" className="text-pti-gray-500">
        Inactive
      </Badge>
    );
  };

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-pti-gray-900">
              Employees
            </h1>
            <p className="text-pti-gray-600 mt-1">
              Manage your fleet drivers and dispatchers.
            </p>
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-pti-blue hover:bg-pti-blue-600">
                <Plus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-pti-blue" />
                  Create New Employee
                </DialogTitle>
                <DialogDescription>
                  Add a new driver or dispatcher to your fleet management
                  system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter employee name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="employee@company.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: "driver" | "dispatcher") =>
                      setFormData({ ...formData, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="driver">Driver</SelectItem>
                      <SelectItem value="dispatcher">Dispatcher</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                {formData.role === "driver" && (
                  <div className="grid gap-2">
                    <Label htmlFor="vehicle">Assigned Vehicle</Label>
                    <Select
                      value={formData.assignedVehicle}
                      onValueChange={(value) =>
                        setFormData({ ...formData, assignedVehicle: value })
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
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateEmployee}
                  className="bg-pti-blue hover:bg-pti-blue-600"
                >
                  Create Employee
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pti-gray-600">
                Total Employees
              </CardTitle>
              <Users className="h-4 w-4 text-pti-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pti-gray-900">
                {employees.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pti-gray-600">
                Active Drivers
              </CardTitle>
              <Truck className="h-4 w-4 text-pti-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pti-gray-900">
                {
                  employees.filter(
                    (emp) => emp.role === "driver" && emp.status === "active",
                  ).length
                }
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pti-gray-600">
                Dispatchers
              </CardTitle>
              <Shield className="h-4 w-4 text-pti-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pti-gray-900">
                {employees.filter((emp) => emp.role === "dispatcher").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Employee Directory</CardTitle>
                <CardDescription>
                  Manage and view all employees in your fleet.
                </CardDescription>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-pti-gray-400" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-sm text-pti-gray-500">
                        {employee.email}
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(employee.role)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        <span className="hidden sm:inline">
                          {employee.email}
                        </span>
                      </div>
                      {employee.phone && (
                        <div className="flex items-center gap-1 text-sm text-pti-gray-500">
                          <Phone className="h-3 w-3" />
                          <span>{employee.phone}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {employee.assignedVehicle ? (
                        <Badge
                          variant="outline"
                          className="text-pti-blue border-pti-blue"
                        >
                          <Truck className="h-3 w-3 mr-1" />
                          {employee.assignedVehicle}
                        </Badge>
                      ) : (
                        <span className="text-pti-gray-400 text-sm">
                          Not assigned
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(employee.status)}</TableCell>
                    <TableCell className="text-sm text-pti-gray-500">
                      {formatLastActive(employee.lastActive)}
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
                            onClick={() => openEditDialog(employee)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteEmployee(employee.id)}
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

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-pti-blue" />
                Edit Employee
              </DialogTitle>
              <DialogDescription>
                Update employee information and vehicle assignments.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter employee name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="employee@company.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Role *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: "driver" | "dispatcher") =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="driver">Driver</SelectItem>
                    <SelectItem value="dispatcher">Dispatcher</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              {formData.role === "driver" && (
                <div className="grid gap-2">
                  <Label htmlFor="edit-vehicle">Assigned Vehicle</Label>
                  <Select
                    value={formData.assignedVehicle}
                    onValueChange={(value) =>
                      setFormData({ ...formData, assignedVehicle: value })
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
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditEmployee}
                className="bg-pti-blue hover:bg-pti-blue-600"
              >
                Update Employee
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
