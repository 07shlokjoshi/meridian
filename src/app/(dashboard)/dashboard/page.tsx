import { AppBreadcrumbs } from "@/components/common/breadcrumbs";
import { PageHeader } from "@/components/common/page-header";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AppBreadcrumbs />
      <PageHeader
        title="Good afternoon"
        description="Here's what's happening across your product catalog today."
      />
      <DashboardOverview />
    </div>
  );
}
