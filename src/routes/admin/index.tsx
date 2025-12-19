import {
  Bell,
  Building2,
  Eye,
  FileText,
  Image,
  MessageSquare,
  Stethoscope,
  Users,
  X,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { toast } from "sonner";
import { z } from "zod";

import { useEffect, useState } from "react";

import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { AdminPageWrapper } from "@/components/admin-page-wrapper";
import {
  FileIcon,
  FileList,
  FileName,
  FileUpload,
  FileUploader,
  useFileUploader,
} from "@/components/file-upload";
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
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppForm } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  adminStatsOptions,
  pinnedNoticesOptions,
} from "@/features/admin/admin.queries";
import {
  addPinnedNoticeFn,
  removePinnedNoticeFn,
} from "@/features/admin/server/functions/admin-stats";

const addPinnedNoticeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  fileId: z.number({
    required_error: "Please upload an image",
  }),
});

type AddPinnedNoticeInput = z.infer<typeof addPinnedNoticeSchema>;

interface PinnedNoticeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notice: {
    title: string;
    file?: {
      name: string;
      url: string;
    };
  } | null;
}

function PreviewModal({ open, onOpenChange, notice }: PreviewModalProps) {
  if (!notice) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{notice.title}</DialogTitle>
          <DialogDescription>Notice preview</DialogDescription>
        </DialogHeader>
        {notice.file && (
          <div className="flex justify-center">
            <img
              src={notice.file.url}
              alt={notice.title}
              className="max-h-[70vh] w-auto rounded-lg object-contain"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function PinnedNoticeModal({ open, onOpenChange }: PinnedNoticeModalProps) {
  const queryClient = useQueryClient();

  const addNotice = useMutation({
    mutationFn: addPinnedNoticeFn,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(pinnedNoticesOptions());
      queryClient.invalidateQueries(adminStatsOptions());
      onOpenChange(false);
      form.reset();
    },
    onError: () => {
      toast.error("Failed to pin notice");
    },
  });

  const form = useAppForm({
    defaultValues: {
      title: "",
      fileId: undefined as unknown as number,
    } satisfies AddPinnedNoticeInput,
    validators: {
      onChange: addPinnedNoticeSchema,
    },
    onSubmit: async ({ value }) => {
      await addNotice.mutateAsync({ data: value });
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Pinned Notice</DialogTitle>
          <DialogDescription>
            Upload an image to pin on the homepage
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.AppField
            name="title"
            children={(field) => (
              <field.FormItem>
                <field.FormLabel>Notice Title</field.FormLabel>
                <Input
                  placeholder="Important Announcement"
                  autoFocus
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <field.FormMessage />
              </field.FormItem>
            )}
          />

          <form.AppField
            name="fileId"
            children={(field) => (
              <field.FormItem>
                <field.FormLabel>Upload Image</field.FormLabel>
                <FileUploader
                  maxFilesCount={1}
                  maxFileSize="10mb"
                  accept={["image/*"]}
                  onChange={(files) => field.handleChange(files[0]?.id)}
                >
                  <FileUpload />
                  <UploadingFilesList />
                  <UploadedFilesList />
                </FileUploader>
                <field.FormMessage />
              </field.FormItem>
            )}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={addNotice.isPending}>
              {addNotice.isPending ? "Adding..." : "Pin Notice"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function UploadingFilesList() {
  const { uploadingFiles, cancelUpload } = useFileUploader();

  if (uploadingFiles.length === 0) return null;

  return (
    <div className="mt-2 space-y-2">
      {uploadingFiles.map(({ file, preview, progress }) => (
        <FileList key={file.name}>
          <FileIcon fileType={file.type} name={file.name} preview={preview} />
          <FileName name={file.name} progress={progress} />
          <Button
            onClick={() => cancelUpload(file)}
            size="icon"
            variant="ghost"
            type="button"
          >
            <X className="h-4 w-4" />
          </Button>
        </FileList>
      ))}
    </div>
  );
}

function UploadedFilesList() {
  const { uploadedFiles, deleteFile } = useFileUploader();

  if (uploadedFiles.length === 0) return null;

  return (
    <div className="mt-2 space-y-2">
      {uploadedFiles.map(({ name, url, fileType, id }) => (
        <FileList key={id}>
          <FileIcon fileType={fileType} name={name} preview={url} />
          <FileName name={name} />
          <Button
            onClick={() => deleteFile(url)}
            size="icon"
            variant="ghost"
            type="button"
          >
            <X className="h-4 w-4" />
          </Button>
        </FileList>
      ))}
    </div>
  );
}

export const Route = createFileRoute("/admin/")({
  component: RouteComponent,
  loader: async ({ context }: { context: { queryClient: QueryClient } }) => {
    context.queryClient.prefetchQuery(adminStatsOptions());
    context.queryClient.prefetchQuery(pinnedNoticesOptions());
  },
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const { data: stats } = useQuery(adminStatsOptions());
  const { data: pinnedNotices } = useQuery(pinnedNoticesOptions());

  const removeNotice = useMutation({
    mutationFn: removePinnedNoticeFn,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(pinnedNoticesOptions());
      queryClient.invalidateQueries(adminStatsOptions());
    },
    onError: () => {
      toast.error("Failed to remove notice");
    },
  });

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<{
    title: string;
    file?:
      | {
          name: string;
          url: string;
        }
      | null
      | undefined;
  } | null>(null);

  const adminCount =
    stats?.usersByRole.find((r) => r.role === "admin")?.count ?? 0;
  const userCount =
    stats?.usersByRole.find((r) => r.role === "user")?.count ?? 0;

  const blogChartData =
    stats?.blogsByDay.map((d) => ({
      date: new Date(d.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      blogs: d.count,
    })) ?? [];

  const contactChartData =
    stats?.contactEntriesByDay.map((d) => ({
      date: new Date(d.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      contacts: d.count,
    })) ?? [];

  const blogChartConfig = {
    blogs: {
      label: "Blog Posts",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  const contactChartConfig = {
    contacts: {
      label: "Contact Queries",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const handlePreviewNotice = (notice: typeof selectedNotice) => {
    setSelectedNotice(notice);
    setPreviewModalOpen(true);
  };

  return (
    <AdminPageWrapper pageTitle="Dashboard">
      <div className="space-y-8">
        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.counts.users}</div>
              <p className="text-muted-foreground text-xs">
                {adminCount} admins, {userCount} users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Doctors</CardTitle>
              <Stethoscope className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.counts.doctors}</div>
              <p className="text-muted-foreground text-xs">
                Medical professionals
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <Building2 className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.counts.departments}
              </div>
              <p className="text-muted-foreground text-xs">
                Medical departments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Contact Queries
              </CardTitle>
              <MessageSquare className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.counts.contactEntries}
              </div>
              <p className="text-muted-foreground text-xs">
                Total queries received
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
              <FileText className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.counts.blogs}</div>
              <p className="text-muted-foreground text-xs">
                Published and draft posts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Galleries</CardTitle>
              <Image className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.counts.galleries}
              </div>
              <p className="text-muted-foreground text-xs">Photo galleries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pinned Notices
              </CardTitle>
              <Bell className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.counts.pinnedNotices}
              </div>
              <p className="text-muted-foreground text-xs">Active notices</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Blog Posts</CardTitle>
              <CardDescription>
                Daily blog posts over the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={blogChartConfig}>
                <BarChart
                  accessibilityLayer
                  data={blogChartData}
                  margin={{ left: 12, right: 12 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="blogs" fill="var(--color-blogs)" radius={8} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Queries</CardTitle>
              <CardDescription>
                Daily contact queries over the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={contactChartConfig}>
                <BarChart
                  accessibilityLayer
                  data={contactChartData}
                  margin={{ left: 12, right: 12 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar
                    dataKey="contacts"
                    fill="var(--color-contacts)"
                    radius={8}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Pinned Notices */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pinned Notices</CardTitle>
                <CardDescription>
                  Manage notices that appear on the homepage
                </CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() => setAddModalOpen(true)}
                className="gap-2"
              >
                <Bell className="h-4 w-4" />
                Add Notice
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {pinnedNotices && pinnedNotices.length > 0 ? (
              <div className="space-y-3">
                {pinnedNotices.map((notice) => (
                  <div
                    key={notice.id}
                    className="hover:bg-accent/50 flex items-start justify-between rounded-lg border p-4 transition-colors"
                  >
                    <div className="mr-4 min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="truncate font-semibold">
                          {notice.title}
                        </h4>
                        <Badge variant="secondary" className="shrink-0">
                          <Bell className="mr-1 h-3 w-3" />
                          Pinned
                        </Badge>
                      </div>
                      {notice.file && (
                        <p className="text-muted-foreground truncate text-sm">
                          {notice.file.name}
                        </p>
                      )}
                      <p className="text-muted-foreground text-xs">
                        Added {new Date(notice.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreviewNotice(notice)}
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Preview
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeNotice.mutate({ data: notice.id })}
                        disabled={removeNotice.isPending}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="text-muted-foreground mb-3 h-12 w-12" />
                <p className="text-muted-foreground mb-1 font-medium">
                  No pinned notices yet
                </p>
                <p className="text-muted-foreground text-sm">
                  Click the button above to add notices to your homepage
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <PinnedNoticeModal open={addModalOpen} onOpenChange={setAddModalOpen} />
        <PreviewModal
          open={previewModalOpen}
          onOpenChange={setPreviewModalOpen}
          notice={selectedNotice}
        />
      </div>
    </AdminPageWrapper>
  );
}
