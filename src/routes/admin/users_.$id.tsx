// import { MoreHorizontal, Trash2Icon } from "lucide-react";
// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { createFileRoute } from "@tanstack/react-router";
// import { AdminPageWrapper } from "@/components/admin-page-wrapper";
// import {
//   AlertDialog,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useSidebar } from "@/components/ui/sidebar";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { getUserOptions } from "@/features/auth/auth.queries";
// import { cn } from "@/util/cn";
// export const Route = createFileRoute("/admin/users_/$id")({
//   component: RouteComponent,
// });
// const sessions = [
//   {
//     id: "1",
//     ip: "192.168.1.1",
//     country: "United States",
//     browser: "Chrome / Windows",
//     lastActive: "2 minutes ago",
//     current: true,
//   },
//   {
//     id: "2",
//     ip: "86.75.30.9",
//     country: "United Kingdom",
//     browser: "Safari / macOS",
//     lastActive: "Yesterday at 2:30 PM",
//     current: false,
//   },
//   {
//     id: "3",
//     ip: "172.16.254.1",
//     country: "Canada",
//     browser: "Firefox / Linux",
//     lastActive: "3 days ago",
//     current: false,
//   },
// ];
// function RouteComponent() {
//   const sidebar = useSidebar();
//   const params = Route.useParams();
//   const { data, isLoading } = useQuery(getUserOptions(parseInt(params.id)));
//   const [formData, setFormData] = useState({});
//   const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [passwordError, setPasswordError] = useState("");
//   if (!isLoading && !data) return <div>Not found</div>;
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };
//   const handleRoleChange = (value: string) => {
//     setFormData({
//       ...formData,
//       role: value,
//     });
//   };
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//   };
//   const handlePasswordChange = () => {
//     if (password !== confirmPassword) {
//       setPasswordError("Passwords do not match");
//       return;
//     }
//     if (password.length < 8) {
//       setPasswordError("Password must be at least 8 characters");
//       return;
//     }
//     // In a real app, you would send this to your API
//     console.log("Password changed:", password);
//     setIsPasswordDialogOpen(false);
//     setPassword("");
//     setConfirmPassword("");
//     setPasswordError("");
//   };
//   return (
//     <AdminPageWrapper pageTitle="Edit User">
//       <Card className="container px-0">
//         <CardHeader>
//           <CardTitle>User Details</CardTitle>
//           <CardDescription>View and edit user information</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit}>
//             <div
//               className={cn(
//                 "grid gap-6 lg:grid-cols-[6rem_1fr_1fr_1fr]",
//                 sidebar.open
//                   ? "md:grid-cols-[6rem_1fr]"
//                   : "md:grid-cols-[6rem_1fr_1fr]",
//               )}
//             >
//               <Avatar
//                 className={cn(
//                   "h-24 w-24 justify-self-center",
//                   sidebar.open ? "md:row-span-3" : "md:row-span-2",
//                   "lg:row-span-1",
//                 )}
//               >
//                 <AvatarImage src={"/placeholder.svg"} />
//                 <AvatarFallback className="text-3xl">AB</AvatarFallback>
//               </Avatar>
//               <div className="space-y-2">
//                 <Label htmlFor="name">Full Name</Label>
//                 <Input id="name" name="name" onChange={handleChange} />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email Address</Label>
//                 <Input
//                   id="email"
//                   name="email"
//                   type="email"
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="role">User Role</Label>
//                 <Select onValueChange={handleRoleChange}>
//                   <SelectTrigger id="role" className="w-full">
//                     <SelectValue placeholder="Select role" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Normal User">Normal User</SelectItem>
//                     <SelectItem value="Administrator">Administrator</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="-col-start-2 flex gap-6 justify-self-end">
//                 <Dialog
//                   open={isPasswordDialogOpen}
//                   onOpenChange={setIsPasswordDialogOpen}
//                 >
//                   <DialogTrigger asChild>
//                     <Button variant="outline">Change Password</Button>
//                   </DialogTrigger>
//                   <DialogContent>
//                     <DialogHeader>
//                       <DialogTitle>Change Password</DialogTitle>
//                       <DialogDescription>
//                         Enter a new password for this user.
//                       </DialogDescription>
//                     </DialogHeader>
//                     <div className="space-y-4 py-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="new-password">New Password</Label>
//                         <Input
//                           id="new-password"
//                           type="password"
//                           value={password}
//                           onChange={(e) => setPassword(e.target.value)}
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="confirm-password">
//                           Confirm Password
//                         </Label>
//                         <Input
//                           id="confirm-password"
//                           type="password"
//                           value={confirmPassword}
//                           onChange={(e) => setConfirmPassword(e.target.value)}
//                         />
//                       </div>
//                       {passwordError && (
//                         <p className="text-sm text-red-500">{passwordError}</p>
//                       )}
//                     </div>
//                     <DialogFooter>
//                       <Button
//                         variant="outline"
//                         onClick={() => setIsPasswordDialogOpen(false)}
//                       >
//                         Cancel
//                       </Button>
//                       <Button onClick={handlePasswordChange}>
//                         Save Password
//                       </Button>
//                     </DialogFooter>
//                   </DialogContent>
//                 </Dialog>
//                 <Button type="submit">Save Changes</Button>
//               </div>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//       <Card className="container px-0">
//         <CardHeader>
//           <CardTitle>Active Sessions</CardTitle>
//           <CardDescription>
//             All devices where this user is currently logged in
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="rounded-md border">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="p-4">IP Address</TableHead>
//                   <TableHead className="p-4">Location</TableHead>
//                   <TableHead className="p-4">Browser</TableHead>
//                   <TableHead className="p-4">Last Active</TableHead>
//                   <TableHead className="w-4"></TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {sessions.map((session) => (
//                   <TableRow key={session.id}>
//                     <TableCell className="p-4 font-medium">
//                       {session.ip}
//                       {session.current && (
//                         <Badge variant="outline" className="ml-2">
//                           Current
//                         </Badge>
//                       )}
//                     </TableCell>
//                     <TableCell className="p-4">{session.country}</TableCell>
//                     <TableCell className="p-4">{session.browser}</TableCell>
//                     <TableCell className="p-4">{session.lastActive}</TableCell>
//                     <TableCell>
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button variant="ghost" size="icon">
//                             <span className="sr-only">Open menu</span>
//                             <MoreHorizontal />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                           <DropdownMenuItem
//                             className="text-destructive focus:text-destructive"
//                             disabled={session.current}
//                           >
//                             Terminate Session
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>
//       <Card className="border-destructive/20 container px-0">
//         <CardHeader className="text-destructive">
//           <CardTitle>Danger Zone</CardTitle>
//           <CardDescription className="text-destructive/80">
//             Destructive actions that cannot be undone
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             <div className="border-destructive/20 rounded-md border p-4">
//               <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//                 <div>
//                   <h3 className="text-sm font-medium">Delete User Account</h3>
//                   <p className="text-muted-foreground text-sm">
//                     Permanently delete this user and all of their data
//                   </p>
//                 </div>
//                 <AlertDialog>
//                   <AlertDialogTrigger asChild>
//                     <Button
//                       variant="destructive"
//                       size="sm"
//                       className="flex items-center gap-2"
//                     >
//                       <Trash2Icon className="h-4 w-4" />
//                       Delete User
//                     </Button>
//                   </AlertDialogTrigger>
//                   <AlertDialogContent>
//                     <AlertDialogHeader>
//                       <AlertDialogTitle>
//                         Are you absolutely sure?
//                       </AlertDialogTitle>
//                       <AlertDialogDescription>
//                         This action cannot be undone. This will permanently
//                         delete the user account and remove all associated data
//                         from our servers.
//                       </AlertDialogDescription>
//                     </AlertDialogHeader>
//                     <AlertDialogFooter>
//                       <AlertDialogCancel>Cancel</AlertDialogCancel>
//                       <Button variant="destructive">Delete</Button>
//                     </AlertDialogFooter>
//                   </AlertDialogContent>
//                 </AlertDialog>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </AdminPageWrapper>
//   );
// }
import { MoreHorizontal } from "lucide-react";
import { Trash2Icon } from "lucide-react";

import { useState } from "react";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

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
import { useAppForm } from "@/components/ui/form";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getUserOptions } from "@/features/auth/auth.queries";
import { cn } from "@/util/cn";

export const Route = createFileRoute("/admin/users_/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const { data, isLoading } = useQuery(getUserOptions(parseInt(params.id)));

  if (!isLoading && !data) {
    return <NotFoundState />;
  }

  return (
    <AdminPageWrapper pageTitle="Edit User">
      {isLoading ? (
        <UserDetailsLoading />
      ) : (
        <>
          <UserDetailsForm />
          <ActiveSessionsTable />
          <DangerZoneCard />
        </>
      )}

      {/* <UserDetailsLoading /> */}
    </AdminPageWrapper>
  );
}

function NotFoundState() {
  return (
    <AdminPageWrapper pageTitle="User Not Found">
      <div className="container flex flex-col items-center justify-center py-12">
        <h2 className="text-3xl font-bold tracking-tight">User not found</h2>
        <p className="text-muted-foreground mt-4 text-center">
          The user you&apos;re looking for doesn&apos;t exist or you don&apos;t
          have permission to view it.
        </p>
        <Link
          to="/admin/users"
          className="bg-primary text-primary-foreground mt-8 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium"
        >
          Go Back
        </Link>
      </div>
    </AdminPageWrapper>
  );
}

function UserDetailsLoading() {
  const sidebar = useSidebar();

  return (
    <>
      <div className="bg-card text-card-foreground container rounded-lg border px-0 shadow">
        <div className="flex flex-col space-y-1.5 p-6">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="p-6">
          <div
            className={cn(
              "grid grid-cols-1 gap-6 lg:grid-cols-[6rem_1fr_1fr_1fr]",
              sidebar.open
                ? "md:grid-cols-[6rem_1fr]"
                : "md:grid-cols-[6rem_1fr_1fr]",
            )}
          >
            <Skeleton
              className={cn(
                "h-24 w-24 justify-self-center rounded-full",
                sidebar.open ? "md:row-span-3" : "md:row-span-2",
                "lg:row-span-1",
              )}
            />
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="-col-start-2 flex gap-6 justify-self-end">
              <Skeleton className="h-10 w-36" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card text-card-foreground container rounded-lg border px-0 shadow">
        <div className="flex flex-col space-y-1.5 p-6">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="p-6">
          <div className="rounded-md border">
            <div className="p-4">
              <div className="grid grid-cols-4">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-4 w-[90%]" />
                  ))}
              </div>
            </div>
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="border-t p-4">
                  <div className="grid grid-cols-4 gap-4">
                    {Array(4)
                      .fill(0)
                      .map((_, j) => (
                        <Skeleton key={j} className="h-4 w-[90%]" />
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="border-destructive/20 bg-card text-card-foreground container rounded-lg border px-0 shadow">
        <div className="flex flex-col space-y-1.5 p-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="p-6">
          <div className="border-destructive/20 rounded-md border p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-2 h-4 w-64" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function UserDetailsForm() {
  const sidebar = useSidebar();

  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const params = Route.useParams();

  const { data } = useSuspenseQuery(getUserOptions(parseInt(params.id)));

  const form = useAppForm({
    defaultValues: {
      name: data?.name ?? "",
      email: data?.email ?? "",
      role: data?.role ?? "",
    },
    onSubmit: ({ value }) => {
      console.log(value);
    },
  });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

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
    <Card className="container px-0">
      <CardHeader>
        <CardTitle>User Details</CardTitle>
        <CardDescription>View and edit user information</CardDescription>
      </CardHeader>
      <CardContent>
        <form.AppForm>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <div
              className={cn(
                "grid items-start gap-6 lg:grid-cols-[6rem_1fr_1fr_1fr]",
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
              <form.AppField
                name="name"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Name</field.FormLabel>
                    <field.FormControl>
                      <Input
                        type="text"
                        placeholder="John Smith"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />
              <form.AppField
                name="email"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Email</field.FormLabel>
                    <field.FormControl>
                      <Input
                        type="email"
                        placeholder="email@website.com"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />
              <form.AppField
                name="role"
                children={(field) => (
                  <field.FormItem className="md:col-span-2 lg:col-auto">
                    <field.FormLabel>Role</field.FormLabel>

                    <Select
                      value={field.state.value}
                      onValueChange={(value) => field.handleChange(value)}
                    >
                      <field.FormControl>
                        <SelectTrigger
                          aria-label="Select a role suitable for this user"
                          className="w-full"
                        >
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </field.FormControl>
                      <SelectContent>
                        <SelectItem value="user">Normal User</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                    <field.FormMessage />
                    <field.FormDescription>
                      Admins can access the admin panel, and do whatever they
                      want.
                    </field.FormDescription>
                  </field.FormItem>
                )}
              />
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
        </form.AppForm>
      </CardContent>
    </Card>
  );
}

export function ActiveSessionsTable() {
  const handleTerminateSession = (sessionId: string) => {
    console.log(`Terminate session: ${sessionId}`);
  };

  const params = Route.useParams();
  const { data: user } = useSuspenseQuery(getUserOptions(parseInt(params.id)));

  return (
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
              {user?.sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="p-4 font-medium">
                    {session.ip}
                    {session.isCurrent && (
                      <Badge variant="outline" className="ml-2">
                        Current
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="p-4">Unknown</TableCell>
                  <TableCell className="p-4">
                    {[session.browser, session.os].filter(Boolean).join(" / ")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          disabled={session.isCurrent}
                          onClick={() => handleTerminateSession(session.id)}
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
  );
}

export function DangerZoneCard() {
  const handleDeleteUser = () => {
    // In a real app, you would send this to your API and redirect
    console.log("User deleted");
  };

  return (
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
                      This action cannot be undone. This will permanently delete
                      the user account and remove all associated data from our
                      servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button variant="destructive" onClick={handleDeleteUser}>
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
