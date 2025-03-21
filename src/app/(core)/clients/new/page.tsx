import ClientForm from "@/components/clients/ClientForm";
import { checkPermission } from "../action";
import { ClientIndexProvider } from "@/components/clients/ClientIndexProvider";
import Link from "@mui/material/Link";
import { IconButton } from "@mui/material";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { pagePermissionCheck } from "@/lib/safePageRequest";
import { ClientSections } from "@/components/clients/lib/client_section";

const breadcrumbItems = [
  { title: `Client`, url: "/clients" },
  { title: `Baru`, url: "/clients/new" },
];

export default async function ClientNewPage() {
  await pagePermissionCheck<ClientSections>("client_create");
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
          <br />
          <div className="text-3xl font-medium">Tambah Client</div>
          <div className="mt-5">
            Silahkan lengkapi data di bawah untuk menambahkan Client baru
          </div>
          <main>
            <ClientForm />
          </main>
        </div>
      </ClientIndexProvider>
    </>
  );
}
