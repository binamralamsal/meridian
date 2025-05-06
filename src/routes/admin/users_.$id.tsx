import { MoreHorizontal, Trash2Icon } from "lucide-react";

import { useState } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { AdminPageWrapper } from "@/components/admin-page-wrapper";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { cn } from "@/util/cn";

export const Route = createFileRoute("/admin/users_/$id")({
  component: RouteComponent,
});

const sessions = [
  {
    id: "1",
    ip: "192.168.1.1",
    country: "United States",
    browser: "Chrome / Windows",
    lastActive: "2 minutes ago",
    current: true,
  },
  {
    id: "2",
    ip: "86.75.30.9",
    country: "United Kingdom",
    browser: "Safari / macOS",
    lastActive: "Yesterday at 2:30 PM",
    current: false,
  },
  {
    id: "3",
    ip: "172.16.254.1",
    country: "Canada",
    browser: "Firefox / Linux",
    lastActive: "3 days ago",
    current: false,
  },
];

function RouteComponent() {
  const sidebar = useSidebar();

  const [formData, setFormData] = useState({});
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handlePasswordChange = () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    // In a real app, you would send this to your API
    console.log("Password changed:", password);
    setIsPasswordDialogOpen(false);
    setPassword("");
    setConfirmPassword("");
    setPasswordError("");
  };

  return (
    <AdminPageWrapper pageTitle="Edit User">
      <Card className="container px-0">
        <CardHeader>
          <CardTitle>User Details</CardTitle>
          <CardDescription>View and edit user information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div
              className={cn(
                "grid gap-6 lg:grid-cols-[6rem_1fr_1fr_1fr]",
                sidebar.open
                  ? "md:grid-cols-[6rem_1fr]"
                  : "md:grid-cols-[6rem_1fr_1fr]",
              )}
            >
              <Avatar
                className={cn(
                  "h-24 w-24 justify-self-center",
                  sidebar.open ? "md:row-span-3" : "md:row-span-2",
                  "lg:row-span-1",
                )}
              >
                <AvatarImage src={"/placeholder.svg"} />
                <AvatarFallback className="text-3xl">AB</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">User Role</Label>
                <Select onValueChange={handleRoleChange}>
                  <SelectTrigger id="role" className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Normal User">Normal User</SelectItem>
                    <SelectItem value="Administrator">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="-col-start-2 flex gap-6 justify-self-end">
                <Dialog
                  open={isPasswordDialogOpen}
                  onOpenChange={setIsPasswordDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline">Change Password</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        Enter a new password for this user.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">
                          Confirm Password
                        </Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                      {passwordError && (
                        <p className="text-sm text-red-500">{passwordError}</p>
                      )}
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsPasswordDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handlePasswordChange}>
                        Save Password
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button type="submit">Save Changes</Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <Card className="container px-0">
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>
            All devices where this user is currently logged in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="p-4">IP Address</TableHead>
                  <TableHead className="p-4">Location</TableHead>
                  <TableHead className="p-4">Browser</TableHead>
                  <TableHead className="p-4">Last Active</TableHead>
                  <TableHead className="w-4"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="p-4 font-medium">
                      {session.ip}
                      {session.current && (
                        <Badge variant="outline" className="ml-2">
                          Current
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="p-4">{session.country}</TableCell>
                    <TableCell className="p-4">{session.browser}</TableCell>
                    <TableCell className="p-4">{session.lastActive}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            disabled={session.current}
                          >
                            Terminate Session
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <Card className="border-destructive/20 container px-0">
        <CardHeader className="text-destructive">
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription className="text-destructive/80">
            Destructive actions that cannot be undone
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-destructive/20 rounded-md border p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-sm font-medium">Delete User Account</h3>
                  <p className="text-muted-foreground text-sm">
                    Permanently delete this user and all of their data
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Trash2Icon className="h-4 w-4" />
                      Delete User
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the user account and remove all associated data
                        from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <Button variant="destructive">Delete</Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminPageWrapper>
  );
}
