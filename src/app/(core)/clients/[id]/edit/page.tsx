import { checkPermission, getClient } from "../../action";
import ClientForm from "@/components/clients/ClientForm";
import { ClientEntity } from "../../../../../../types/entities/client";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";
import { ClientIndexProvider } from "@/components/clients/ClientIndexProvider";

const breadcrumbItems = (data: ClientEntity) => [
  { title: `Client`, url: "/clients" },
  { title: `Detail - ${data.name}`, url: `/clients/${data.id}` },
  { title: `Edit`, url: `/clients/${data.id}/edit` },
];

export default async function ClientEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const pageParams = await params;

  const pageDetail: Promise<ClientEntity> = new Promise((resolve, reject) => {
    getClient(pageParams.id).then((result) => {
      if (result.success) {
        resolve(result.data.client);
      } else {
        reject(result.data.message);
      }
    })
  })

  const [client, permission] = await Promise.all([
    pageDetail,
    checkPermission(),
  ]);


  return (
    <ClientIndexProvider permission={permission}>
    <div className="w-full p-4 px-6 lg:px-20">
      <div className="container mx-auto">
        <Link href="/clients">
          <IconButton color="primary" aria-label="kembali">
            <ArrowBackIcon />
          </IconButton>
        </Link>
        <BreadcrumbCustom items={breadcrumbItems(client)} />
      </div>
      <h1 className="text-3xl font-bold mb-4">Edit Client</h1>
      <div className="mb-5">
          Silahkan lengkapi data di bawah untuk menambahkan Client baru
        </div>
        <ClientForm client={client} />
    </div>
    </ClientIndexProvider>
  );
}
