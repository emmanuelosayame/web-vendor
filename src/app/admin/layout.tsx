import LayoutA from "@components/layout/Admin";

export const metadata = {
  title: "Notifications",
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutA>{children}</LayoutA>;
}
