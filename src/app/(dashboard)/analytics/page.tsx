import { AppBreadcrumbs } from "@/components/common/breadcrumbs";
import { PageHeader } from "@/components/common/page-header";
import { AnalyticsPageContent } from "@/components/analytics/analytics-page-content";

export default function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AppBreadcrumbs />
      <PageHeader
        title="Analytics"
        description="Catalog performance, inventory exposure, and rating trends."
      />
      <AnalyticsPageContent />
    </div>
  );
}
