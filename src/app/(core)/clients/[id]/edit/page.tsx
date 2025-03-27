import { checkPermission, getClient } from "../../action";
import ClientForm from "@/components/clients/ClientForm";
import { ClientEntity } from "../../../../../../types/entities/client";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";
import { ClientIndexProvider } from "@/components/clients/ClientIndexProvider";
import { pagePermissionCheck } from "@/lib/safePageRequest";
import { ClientSections } from "@/components/clients/lib/client_section";

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
    });
  });

  await pagePermissionCheck<ClientSections>("client_update");

  const [client, permission] = await Promise.all([
    pageDetail,
    checkPermission(),
  ]);

  return (
    <ClientIndexProvider permission={permission}>
      <div className="flex flex-row gap-2 items-center">
        <Link href="/clients">
          <IconButton color="primary" aria-label="kembali">
            <ArrowBackIcon />
          </IconButton>
        </Link>
        <BreadcrumbCustom items={breadcrumbItems(client)} />
      </div>
      <div className="w-full p-4 px-6 lg:px-20">
        <Box
          sx={{
            backgroundColor: "white",
            border: "1px solid #ccc",
            boxShadow: 1,
            borderRadius: 1,
            padding: { xs: 2, sm: 3 },
            width: "100%",
            textAlign: "left",
            height: { xs: "auto", sm: "60px" },
            mb: 3,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "20px", sm: "25px", md: "30px" },
            }}
            color="text.primary"
          >
            Edit Client
          </Typography>
        </Box>
        <div className="mb-3">
          Silahkan perbaiki data di bawah untuk update data Client
        </div>
        <ClientForm client={client} />
      </div>
    </ClientIndexProvider>
  );
}
