import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupPage() {
  return (
    <Card className="w-full shadow-2xl border-border/50 bg-background/60 backdrop-blur-xl">
      <CardHeader className="space-y-2 text-center pb-6">
        <CardTitle className="text-2xl font-semibold tracking-tight">Create an account</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Enter your details to get started with JobOS
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AuthForm type="signup" />
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:text-primary/90 transition-colors">
            Log in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
