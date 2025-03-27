import { ClientIndexProvider } from "@/components/clients/ClientIndexProvider";
import { ClientTable } from "@/components/clients/ClientTable";
import { checkPermission } from "./action";
import {
  Box,
  Button,
  IconButton,
  Link,
  Tooltip,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { pagePermissionCheck } from "@/lib/safePageRequest";
import { ClientSections } from "@/components/clients/lib/client_section";

const breadcrumbItems = [{ title: `Client`, url: "/clients" }];

export default async function ClientsIndexPage() {
  await pagePermissionCheck<ClientSections>("client_index");
  const permission = await checkPermission();

  return (
    <>
      <ClientIndexProvider permission={permission}>
        <div className="flex flex-row gap-2 items-center">
          <Link href="/dashboard">
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
            Client
          </Typography>
        </Box>
        {permission.client_create && (
          <Tooltip title="Tambah client baru">
            <Button
              href="/clients/new"
              color="primary"
              startIcon={<AddCircleOutlineIcon />}
            >
              Add
            </Button>
          </Tooltip>
        )}
        <div className="flex w-full justify-center">
            <ClientTable />
          </div>
      </ClientIndexProvider>
    </>
  );
}
