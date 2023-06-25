import LayoutA from "@components/layout/Admin";

export const metadata = {
  title: "Admin",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutA>{children}</LayoutA>;
}
