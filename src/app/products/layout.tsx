import Layout from "@components/layout";

export const metadata = {
  title: "Delorand | Online Shopping. Fashion and Electronics",
  description: "Delorand | Elctronics and fashion",
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
