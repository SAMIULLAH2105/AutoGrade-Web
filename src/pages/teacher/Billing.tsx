import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAppData, useAuth } from "@/state/AppContext";
import { DoodleBackground } from "@/components/decor/DoodleBackground";
import { FadeIn } from "@/components/ui/motion";

type TeacherPlan = {
  planName: string;
  priceMonthly: string;
  monthlyLimit: number;
};

function getDemoTeacherPlan(): TeacherPlan {
  return {
    planName: "Teacher Pro",
    priceMonthly: "$19 / month",
    monthlyLimit: 200,
  };
}

export default function TeacherBillingPage() {
  const { user } = useAuth();
  const { history } = useAppData();

  const plan = getDemoTeacherPlan();
  const usedChecks = history
    .filter((h) => h.user_id === user?.id)
    .reduce((sum, h) => sum + (h.file_names?.length ?? 0), 0);

  const remainingChecks = Math.max(0, plan.monthlyLimit - usedChecks);
  const progressValue =
    plan.monthlyLimit > 0
      ? Math.min(100, Math.round((usedChecks / plan.monthlyLimit) * 100))
      : 0;

  return (
    <Layout>
      <div className="container-custom section-padding max-w-3xl mx-auto relative">
        <DoodleBackground />
        <FadeIn className="relative">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <Badge variant="secondary" className="px-4 py-1 text-sm">
              Teacher
            </Badge>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">
            Payment & <span className="gradient-text">Plan</span>
          </h1>
          <p className="text-muted-foreground">
            View your current plan and remaining paper-check limit.
          </p>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Current plan</CardTitle>
            <CardDescription>
              {plan.planName} • {plan.priceMonthly}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-muted/50 p-4">
                <div className="text-sm text-muted-foreground">Monthly limit</div>
                <div className="font-display text-2xl font-bold">
                  {plan.monthlyLimit}
                </div>
              </div>
              <div className="rounded-xl bg-muted/50 p-4">
                <div className="text-sm text-muted-foreground">Used</div>
                <div className="font-display text-2xl font-bold">{usedChecks}</div>
              </div>
              <div className="rounded-xl bg-muted/50 p-4">
                <div className="text-sm text-muted-foreground">Remaining</div>
                <div className="font-display text-2xl font-bold">
                  {remainingChecks}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">This billing cycle</span>
                <span className="text-muted-foreground">
                  {usedChecks} / {plan.monthlyLimit}
                </span>
              </div>
              <Progress value={progressValue} />
            </div>

            <div className="text-sm text-muted-foreground">
              Note: This is demo billing data. Your usage is estimated from your
              uploaded batch history.
            </div>
          </CardContent>
        </Card>
        </FadeIn>
      </div>
    </Layout>
  );
}
