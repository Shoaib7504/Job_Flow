import RequireAuth from "@/app/Components/RequireAuth";

export const metadata = {
  title: "Dashboard — JobFlow Career OS",
  description:
    "Your career command center: application momentum, live pipeline, interviews and career signals.",
  openGraph: {
    title: "Dashboard — JobFlow Career OS",
    description: "Application momentum, live pipeline and career signals in one calm view.",
  },
};

export default function DashboardLayout({ children }) {
  return <RequireAuth>{children}</RequireAuth>;
}