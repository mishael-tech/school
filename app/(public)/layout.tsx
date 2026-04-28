import { PublicHeader } from "@/components/PublicHeader";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicHeader />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</div>
    </>
  );
}
