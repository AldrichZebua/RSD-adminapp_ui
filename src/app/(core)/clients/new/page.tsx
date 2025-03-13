import ClientForm from "@/components/clients/ClientForm";
import { checkPermission } from "../action";
import { ClientIndexProvider } from "@/components/clients/ClientIndexProvider";
import Link from "@mui/material/Link";
import NextLink from "next/link";

export default async function ClientNewPage() {
  const permission = await checkPermission();

  return (
    <>
      <ClientIndexProvider permission={permission}>
        {permission.client_create ? (
          <main>
            <ClientForm />
          </main>
        ) : (
          <Link
            component={NextLink}
            href={`/dashboard/clients`}
            underline="none"
            color="dark"
          />
        )}
      </ClientIndexProvider>
    </>
  );
}
