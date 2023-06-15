import Layout from "@components/layout";

export const metadata = {
  title: "Notifications",
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
