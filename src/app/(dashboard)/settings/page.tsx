import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Settings will store target roles, locations, preferred job sources, minimum
          match score, and approval requirements. The default will keep submissions manual.
        </p>
      </CardContent>
    </Card>
  );
}
