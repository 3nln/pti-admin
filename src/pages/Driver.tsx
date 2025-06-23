import { useState } from "react";
import DriverLayout from "@/components/layout/DriverLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ClipboardCheck,
  Clock,
  CheckCircle,
  AlertTriangle,
  Play,
  Camera,
  Truck,
  Calendar,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";

interface PTIChecklistItem {
  id: string;
  name: string;
  status: "pending" | "ok" | "not_ok";
  comment?: string;
  required: boolean;
}

interface PTISession {
  id: string;
  vehicleId: string;
  vehicleName: string;
  status: "pending" | "in_progress" | "completed" | "overdue";
  dueDate: Date;
  assignedAt: Date;
  location: string;
  checklist: PTIChecklistItem[];
  completedItems: number;
  totalItems: number;
}

// Mock PTI sessions for the driver
const mockDriverSessions: PTISession[] = [
  {
    id: "1",
    vehicleId: "TRK-101",
    vehicleName: "2022 Freightliner Cascadia",
    status: "pending",
    dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // Due in 2 hours
    assignedAt: new Date(Date.now() - 30 * 60 * 1000), // Assigned 30 min ago
    location: "Los Angeles Terminal",
    checklist: [
      { id: "1", name: "Brakes", status: "pending", required: true },
      { id: "2", name: "Tires", status: "pending", required: true },
      { id: "3", name: "Lights", status: "pending", required: true },
      { id: "4", name: "Fuel System", status: "pending", required: true },
      { id: "5", name: "Windshield Wipers", status: "pending", required: true },
      { id: "6", name: "Mirrors", status: "pending", required: true },
      { id: "7", name: "Horn", status: "pending", required: true },
      {
        id: "8",
        name: "Emergency Equipment",
        status: "pending",
        required: true,
      },
    ],
    completedItems: 0,
    totalItems: 8,
  },
  {
    id: "2",
    vehicleId: "TRK-103",
    vehicleName: "2021 Peterbilt 579",
    status: "pending",
    dueDate: new Date(Date.now() + 6 * 60 * 60 * 1000), // Due in 6 hours
    assignedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // Assigned 2 hours ago
    location: "San Francisco Depot",
    checklist: [
      { id: "1", name: "Brakes", status: "pending", required: true },
      { id: "2", name: "Tires", status: "pending", required: true },
      { id: "3", name: "Lights", status: "pending", required: true },
      { id: "4", name: "Fuel System", status: "pending", required: true },
      { id: "5", name: "Windshield Wipers", status: "pending", required: true },
      { id: "6", name: "Mirrors", status: "pending", required: true },
      { id: "7", name: "Horn", status: "pending", required: true },
      {
        id: "8",
        name: "Emergency Equipment",
        status: "pending",
        required: true,
      },
    ],
    completedItems: 0,
    totalItems: 8,
  },
];

export default function Driver() {
  const [sessions, setSessions] = useState<PTISession[]>(mockDriverSessions);
  const [selectedSession, setSelectedSession] = useState<PTISession | null>(
    null,
  );
  const [isPTIDialogOpen, setIsPTIDialogOpen] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [itemComment, setItemComment] = useState("");

  const getStatusBadge = (status: PTISession["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-pti-blue border-pti-blue">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-pti-orange text-white">
            <Play className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-pti-green">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "overdue":
        return (
          <Badge variant="destructive" className="bg-pti-red">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Overdue
          </Badge>
        );
    }
  };

  const getDueDateColor = (dueDate: Date, status: string) => {
    if (status === "completed") return "text-pti-green";
    const now = new Date();
    const hoursUntilDue =
      (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilDue < 0) return "text-pti-red"; // Overdue
    if (hoursUntilDue < 2) return "text-pti-orange"; // Due soon
    return "text-pti-gray-600"; // Normal
  };

  const startPTI = (session: PTISession) => {
    setSelectedSession({ ...session, status: "in_progress" });
    setCurrentItemIndex(0);
    setItemComment("");
    setIsPTIDialogOpen(true);
  };

  const handleItemResponse = (status: "ok" | "not_ok") => {
    if (!selectedSession) return;

    const updatedChecklist = [...selectedSession.checklist];
    updatedChecklist[currentItemIndex] = {
      ...updatedChecklist[currentItemIndex],
      status,
      comment: status === "not_ok" ? itemComment : undefined,
    };

    const updatedSession = {
      ...selectedSession,
      checklist: updatedChecklist,
      completedItems: updatedChecklist.filter(
        (item) => item.status !== "pending",
      ).length,
    };

    setSelectedSession(updatedSession);

    // Move to next item or complete
    if (currentItemIndex < selectedSession.checklist.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
      setItemComment("");
    } else {
      // PTI completed
      const finalSession = { ...updatedSession, status: "completed" as const };
      setSessions(
        sessions.map((s) => (s.id === finalSession.id ? finalSession : s)),
      );
      setIsPTIDialogOpen(false);
      toast.success("PTI completed successfully!");
    }
  };

  const currentItem = selectedSession?.checklist[currentItemIndex];
  const progress = selectedSession
    ? (currentItemIndex / selectedSession.checklist.length) * 100
    : 0;

  const pendingSessions = sessions.filter((s) => s.status === "pending").length;
  const completedToday = sessions.filter(
    (s) => s.status === "completed",
  ).length;

  return (
    <DriverLayout>
      <div className="p-4 space-y-6">
        {/* Welcome Section */}
        <div className="text-center py-6">
          <h1 className="text-2xl font-bold text-pti-gray-900 mb-2">
            Good Morning, John! 👋
          </h1>
          <p className="text-pti-gray-600">
            You have {pendingSessions} pending PTI session
            {pendingSessions !== 1 ? "s" : ""} today
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-pti-blue mb-1">
                {pendingSessions}
              </div>
              <div className="text-sm text-pti-gray-600">Pending PTIs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-pti-green mb-1">
                {completedToday}
              </div>
              <div className="text-sm text-pti-gray-600">Completed Today</div>
            </CardContent>
          </Card>
        </div>

        {/* PTI Sessions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-pti-gray-900">
            Your PTI Sessions
          </h2>

          {sessions.map((session) => (
            <Card key={session.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-pti-blue-50">
                        <Truck className="h-5 w-5 text-pti-blue" />
                      </div>
                      <div>
                        <div className="font-semibold text-pti-gray-900">
                          {session.vehicleId}
                        </div>
                        <div className="text-sm text-pti-gray-600">
                          {session.vehicleName}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(session.status)}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-pti-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Due{" "}
                        <span
                          className={getDueDateColor(
                            session.dueDate,
                            session.status,
                          )}
                        >
                          {formatDistanceToNow(session.dueDate, {
                            addSuffix: true,
                          })}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-pti-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{session.location}</span>
                    </div>
                  </div>

                  {session.status === "in_progress" && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>
                          {session.completedItems}/{session.totalItems}
                        </span>
                      </div>
                      <Progress
                        value={
                          (session.completedItems / session.totalItems) * 100
                        }
                        className="h-2"
                      />
                    </div>
                  )}

                  {session.status === "pending" && (
                    <Button
                      onClick={() => startPTI(session)}
                      className="w-full bg-pti-blue hover:bg-pti-blue-600"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start PTI
                    </Button>
                  )}

                  {session.status === "completed" && (
                    <div className="text-center py-2">
                      <CheckCircle className="h-8 w-8 text-pti-green mx-auto mb-2" />
                      <div className="text-sm text-pti-green font-medium">
                        Completed Successfully
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* PTI Dialog */}
        <Dialog open={isPTIDialogOpen} onOpenChange={setIsPTIDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-pti-blue" />
                PTI Inspection
              </DialogTitle>
              <DialogDescription>
                {selectedSession && (
                  <>
                    {selectedSession.vehicleId} • Item {currentItemIndex + 1} of{" "}
                    {selectedSession.checklist.length}
                  </>
                )}
              </DialogDescription>
            </DialogHeader>

            {currentItem && (
              <div className="space-y-6">
                {/* Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Current Item */}
                <div className="text-center py-8">
                  <div className="text-2xl font-semibold text-pti-gray-900 mb-3">
                    {currentItem.name}
                  </div>
                  <div className="text-pti-gray-600 mb-6">
                    Inspect the {currentItem.name.toLowerCase()} and report the
                    condition
                  </div>

                  {/* Visual instruction */}
                  <div className="bg-pti-blue-50 rounded-lg p-4 mb-6">
                    <div className="text-sm text-pti-blue-700 font-medium mb-2">
                      Choose one option:
                    </div>
                    <div className="space-y-2 text-sm text-pti-gray-600">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-pti-green" />
                        <span>OK - No issues found</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-pti-red" />
                        <span>Not OK - Issue found (add comment below)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comment Section */}
                <div className="space-y-2">
                  <Label
                    htmlFor="comment"
                    className="text-pti-gray-700 font-medium"
                  >
                    Comments (required for "Not OK" items)
                  </Label>
                  <Textarea
                    id="comment"
                    value={itemComment}
                    onChange={(e) => setItemComment(e.target.value)}
                    placeholder="Describe any issues or observations..."
                    rows={3}
                    className="resize-none"
                  />
                </div>

                {/* Photo Option */}
                <Button
                  variant="outline"
                  className="w-full border-dashed"
                  onClick={() => toast.info("Camera feature coming soon!")}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Add Photo (Optional)
                </Button>
              </div>
            )}

            <DialogFooter className="flex flex-col space-y-3 sm:flex-col sm:space-x-0">
              {/* Main Action Buttons */}
              <div className="grid grid-cols-2 gap-3 w-full">
                <Button
                  onClick={() => handleItemResponse("ok")}
                  className="h-12 bg-pti-green hover:bg-pti-green-600 text-white font-medium"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  OK
                </Button>
                <Button
                  onClick={() => handleItemResponse("not_ok")}
                  variant="outline"
                  className="h-12 border-2 border-pti-red text-pti-red hover:bg-pti-red hover:text-white font-medium"
                >
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Not OK
                </Button>
              </div>

              {/* Cancel Button */}
              <Button
                variant="ghost"
                onClick={() => setIsPTIDialogOpen(false)}
                className="w-full text-pti-gray-500 hover:text-pti-gray-700"
              >
                Cancel Inspection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DriverLayout>
  );
}
