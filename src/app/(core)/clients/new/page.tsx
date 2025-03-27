import ClientForm from "@/components/clients/ClientForm";
import { checkPermission } from "../action";
import { ClientIndexProvider } from "@/components/clients/ClientIndexProvider";
import Link from "@mui/material/Link";
import { Box, IconButton, Typography } from "@mui/material";
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
        <div className="flex flex-row gap-2 items-center">
          <Link href="/clients">
            <IconButton color="primary" aria-label="kembali">
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <BreadcrumbCustom items={breadcrumbItems} />
        </div>
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
            Tambah Client{" "}
          </Typography>
        </Box>
        <div className="mt-3">
          Silahkan lengkapi data di bawah untuk menambahkan Client baru
        </div>
        <ClientForm />
      </ClientIndexProvider>
    </>
  );
}
