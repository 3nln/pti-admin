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
  Truck,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Calendar,
  User,
  Gauge,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Vehicle {
  id: string;
  vehicleId: string;
  type: "truck" | "van" | "trailer";
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  assignedDriver?: string;
  status: "active" | "maintenance" | "inactive";
  mileage: number;
  lastPTI: Date;
  nextPTI: Date;
  location: string;
  createdAt: Date;
}

// Mock data
const mockVehicles: Vehicle[] = [
  {
    id: "1",
    vehicleId: "TRK-101",
    type: "truck",
    make: "Freightliner",
    model: "Cascadia",
    year: 2022,
    licensePlate: "ABC-1234",
    assignedDriver: "John Doe",
    status: "active",
    mileage: 45000,
    lastPTI: new Date(Date.now() - 2 * 60 * 60 * 1000),
    nextPTI: new Date(Date.now() + 22 * 60 * 60 * 1000),
    location: "Los Angeles, CA",

    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    vehicleId: "VAN-205",
    type: "van",
    make: "Ford",
    model: "Transit",
    year: 2023,
    licensePlate: "XYZ-5678",
    assignedDriver: "Sarah Smith",
    status: "active",
    mileage: 23000,
    lastPTI: new Date(Date.now() - 15 * 60 * 1000),
    nextPTI: new Date(Date.now() + 8 * 60 * 60 * 1000),
    location: "San Francisco, CA",

    createdAt: new Date("2024-02-01"),
  },
  {
    id: "3",
    vehicleId: "TRK-103",
    type: "truck",
    make: "Peterbilt",
    model: "579",
    year: 2021,
    licensePlate: "DEF-9012",
    status: "maintenance",
    mileage: 67000,
    lastPTI: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    nextPTI: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    location: "Phoenix, AZ",

    createdAt: new Date("2024-01-10"),
  },
  {
    id: "4",
    vehicleId: "TRK-107",
    type: "truck",
    make: "Kenworth",
    model: "T680",
    year: 2023,
    licensePlate: "GHI-3456",
    assignedDriver: "Emily Davis",
    status: "active",
    mileage: 12000,
    lastPTI: new Date(Date.now() - 4 * 60 * 60 * 1000),
    nextPTI: new Date(Date.now() + 20 * 60 * 60 * 1000),
    location: "Denver, CO",

    createdAt: new Date("2024-03-01"),
  },
];

const mockDrivers = [
  "John Doe",
  "Sarah Smith",
  "Mike Johnson",
  "Emily Davis",
  "David Wilson",
  "Lisa Garcia",
  "Robert Brown",
];

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    vehicleId: "",
    type: "truck" as const,
    make: "",
    model: "",
    year: new Date().getFullYear(),
    licensePlate: "",
    assignedDriver: "",
    location: "",
    mileage: 0,
  });

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.assignedDriver?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreateVehicle = () => {
    if (!formData.vehicleId || !formData.make || !formData.model) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Check if vehicle ID already exists
    if (vehicles.some((v) => v.vehicleId === formData.vehicleId)) {
      toast.error("Vehicle ID already exists");
      return;
    }

    const newVehicle: Vehicle = {
      id: (vehicles.length + 1).toString(),
      vehicleId: formData.vehicleId,
      type: formData.type,
      make: formData.make,
      model: formData.model,
      year: formData.year,
      licensePlate: formData.licensePlate,
      assignedDriver: formData.assignedDriver || undefined,
      status: "active",
      mileage: formData.mileage,
      lastPTI: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      nextPTI: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
      location: formData.location,

      createdAt: new Date(),
    };

    setVehicles([...vehicles, newVehicle]);
    setIsCreateDialogOpen(false);
    resetFormData();
    toast.success("Vehicle created successfully!");
  };

  const handleEditVehicle = () => {
    if (
      !selectedVehicle ||
      !formData.vehicleId ||
      !formData.make ||
      !formData.model
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Check if vehicle ID already exists (excluding current vehicle)
    if (
      vehicles.some(
        (v) =>
          v.vehicleId === formData.vehicleId && v.id !== selectedVehicle.id,
      )
    ) {
      toast.error("Vehicle ID already exists");
      return;
    }

    const updatedVehicles = vehicles.map((vehicle) =>
      vehicle.id === selectedVehicle.id
        ? {
            ...vehicle,
            vehicleId: formData.vehicleId,
            type: formData.type,
            make: formData.make,
            model: formData.model,
            year: formData.year,
            licensePlate: formData.licensePlate,
            assignedDriver: formData.assignedDriver || undefined,
            location: formData.location,
            mileage: formData.mileage,
          }
        : vehicle,
    );

    setVehicles(updatedVehicles);
    setIsEditDialogOpen(false);
    setSelectedVehicle(null);
    resetFormData();
    toast.success("Vehicle updated successfully!");
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    setVehicles(vehicles.filter((vehicle) => vehicle.id !== vehicleId));
    toast.success("Vehicle deleted successfully!");
  };

  const openEditDialog = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setFormData({
      vehicleId: vehicle.vehicleId,
      type: vehicle.type,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      licensePlate: vehicle.licensePlate,
      assignedDriver: vehicle.assignedDriver || "",
      location: vehicle.location,
      mileage: vehicle.mileage,
    });
    setIsEditDialogOpen(true);
  };

  const resetFormData = () => {
    setFormData({
      vehicleId: "",
      type: "truck",
      make: "",
      model: "",
      year: new Date().getFullYear(),
      licensePlate: "",
      assignedDriver: "",
      location: "",
      mileage: 0,
    });
  };

  const getStatusBadge = (status: Vehicle["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-pti-green">Active</Badge>;
      case "maintenance":
        return <Badge className="bg-pti-orange text-white">Maintenance</Badge>;
      case "inactive":
        return (
          <Badge variant="outline" className="text-pti-gray-500">
            Inactive
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getTypeIcon = (type: Vehicle["type"]) => {
    switch (type) {
      case "truck":
        return <Truck className="h-4 w-4" />;
      case "van":
        return <Truck className="h-4 w-4" />;
      case "trailer":
        return <Truck className="h-4 w-4" />;
      default:
        return <Truck className="h-4 w-4" />;
    }
  };

  const formatMileage = (mileage: number) => {
    return mileage.toLocaleString() + " mi";
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-pti-gray-900">
              Vehicles
            </h1>
            <p className="text-pti-gray-600 mt-1">
              Manage your fleet vehicles and assignments.
            </p>
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-pti-green hover:bg-pti-green-600">
                <Plus className="h-4 w-4 mr-2" />
                Add Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-pti-green" />
                  Add New Vehicle
                </DialogTitle>
                <DialogDescription>
                  Register a new vehicle in your fleet management system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="vehicleId">Vehicle ID *</Label>
                    <Input
                      id="vehicleId"
                      value={formData.vehicleId}
                      onChange={(e) =>
                        setFormData({ ...formData, vehicleId: e.target.value })
                      }
                      placeholder="TRK-101"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: "truck" | "van" | "trailer") =>
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="truck">Truck</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                        <SelectItem value="trailer">Trailer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="make">Make *</Label>
                    <Input
                      id="make"
                      value={formData.make}
                      onChange={(e) =>
                        setFormData({ ...formData, make: e.target.value })
                      }
                      placeholder="Freightliner"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="model">Model *</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) =>
                        setFormData({ ...formData, model: e.target.value })
                      }
                      placeholder="Cascadia"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          year: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="2023"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="licensePlate">License Plate</Label>
                    <Input
                      id="licensePlate"
                      value={formData.licensePlate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          licensePlate: e.target.value,
                        })
                      }
                      placeholder="ABC-1234"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="assignedDriver">Assigned Driver</Label>
                    <Select
                      value={formData.assignedDriver}
                      onValueChange={(value) =>
                        setFormData({ ...formData, assignedDriver: value })
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
                    <Label htmlFor="mileage">Current Mileage</Label>
                    <Input
                      id="mileage"
                      type="number"
                      value={formData.mileage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mileage: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="50000"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Current Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="Los Angeles, CA"
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
                  onClick={handleCreateVehicle}
                  className="bg-pti-green hover:bg-pti-green-600"
                >
                  Add Vehicle
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pti-gray-600">
                Total Vehicles
              </CardTitle>
              <Truck className="h-4 w-4 text-pti-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pti-gray-900">
                {vehicles.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pti-gray-600">
                Active Vehicles
              </CardTitle>
              <Truck className="h-4 w-4 text-pti-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pti-gray-900">
                {vehicles.filter((v) => v.status === "active").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pti-gray-600">
                In Maintenance
              </CardTitle>
              <Gauge className="h-4 w-4 text-pti-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pti-gray-900">
                {vehicles.filter((v) => v.status === "maintenance").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pti-gray-600">
                Assigned Drivers
              </CardTitle>
              <User className="h-4 w-4 text-pti-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pti-gray-900">
                {vehicles.filter((v) => v.assignedDriver).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Vehicle Fleet</CardTitle>
                <CardDescription>
                  Manage and view all vehicles in your fleet.
                </CardDescription>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-pti-gray-400" />
                <Input
                  placeholder="Search vehicles..."
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
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Last PTI</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-pti-green-50">
                          {getTypeIcon(vehicle.type)}
                        </div>
                        <div>
                          <div className="font-medium">{vehicle.vehicleId}</div>
                          <div className="text-sm text-pti-gray-500">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </div>
                          <div className="text-xs text-pti-gray-400">
                            {formatMileage(vehicle.mileage)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {vehicle.assignedDriver ? (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{vehicle.assignedDriver}</span>
                        </div>
                      ) : (
                        <span className="text-pti-gray-400 text-sm">
                          Not assigned
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        <span>{vehicle.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-pti-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {formatDistanceToNow(vehicle.lastPTI, {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
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
                            onClick={() => openEditDialog(vehicle)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteVehicle(vehicle.id)}
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
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-pti-green" />
                Edit Vehicle
              </DialogTitle>
              <DialogDescription>
                Update vehicle information and assignments.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-vehicleId">Vehicle ID *</Label>
                  <Input
                    id="edit-vehicleId"
                    value={formData.vehicleId}
                    onChange={(e) =>
                      setFormData({ ...formData, vehicleId: e.target.value })
                    }
                    placeholder="TRK-101"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-type">Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "truck" | "van" | "trailer") =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="van">Van</SelectItem>
                      <SelectItem value="trailer">Trailer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-make">Make *</Label>
                  <Input
                    id="edit-make"
                    value={formData.make}
                    onChange={(e) =>
                      setFormData({ ...formData, make: e.target.value })
                    }
                    placeholder="Freightliner"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-model">Model *</Label>
                  <Input
                    id="edit-model"
                    value={formData.model}
                    onChange={(e) =>
                      setFormData({ ...formData, model: e.target.value })
                    }
                    placeholder="Cascadia"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-year">Year</Label>
                  <Input
                    id="edit-year"
                    type="number"
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        year: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="2023"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-licensePlate">License Plate</Label>
                  <Input
                    id="edit-licensePlate"
                    value={formData.licensePlate}
                    onChange={(e) =>
                      setFormData({ ...formData, licensePlate: e.target.value })
                    }
                    placeholder="ABC-1234"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-assignedDriver">Assigned Driver</Label>
                  <Select
                    value={formData.assignedDriver}
                    onValueChange={(value) =>
                      setFormData({ ...formData, assignedDriver: value })
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
                  <Label htmlFor="edit-mileage">Current Mileage</Label>
                  <Input
                    id="edit-mileage"
                    type="number"
                    value={formData.mileage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mileage: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="50000"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-location">Current Location</Label>
                <Input
                  id="edit-location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="Los Angeles, CA"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditVehicle}
                className="bg-pti-green hover:bg-pti-green-600"
              >
                Update Vehicle
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
