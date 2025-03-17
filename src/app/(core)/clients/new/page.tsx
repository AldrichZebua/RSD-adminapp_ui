import ClientForm from "@/components/clients/ClientForm";
import { checkPermission } from "../action";
import { ClientIndexProvider } from "@/components/clients/ClientIndexProvider";
import Link from "@mui/material/Link";
import NextLink from "next/link";
import { IconButton } from "@mui/material";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const breadcrumbItems = [
  { title: `Client`, url: "/clients" },
  { title: `Baru`, url: "/clients/new" },
];

export default async function ClientNewPage() {
  const permission = await checkPermission();

  return (
    <>
      <ClientIndexProvider permission={permission}>
        <div className="w-full p-4 px-6 lg:px-20">
          <div className="container mx-auto">
            <Link href="/clients">
              <IconButton color="primary" aria-label="kembali">
                <ArrowBackIcon />
              </IconButton>
            </Link>
            <BreadcrumbCustom items={breadcrumbItems} />
          </div>
          <div className="text-3xl font-medium">Tambah Client</div>
          <div className="mb-5">
            Silahkan lengkapi data di bawah untuk menambahkan Client baru
          </div>
          {permission.client_create ? (
            <main>
              <ClientForm />
            </main>
          ) : (
            <Link
              component={NextLink}
              href={`/clients`}
              underline="none"
              color="dark"
            />
          )}
        </div>
      </ClientIndexProvider>
    </>
  );
}
