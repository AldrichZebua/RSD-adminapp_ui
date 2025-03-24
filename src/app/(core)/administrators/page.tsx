import { AdministratorIndexProvider } from "@/components/administrator/AdministratorIndexProvider";
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
import { AdministratorsTable } from "@/components/administrator/AdministratorsTable";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";
import { pagePermissionCheck } from "@/lib/safePageRequest";
import { AdministratorSections } from "@/components/administrator/lib/administrators_section";

const breadcrumbItems = [{ title: `Administrators`, url: "/administrators" }];

export default async function AdministratorIndexPage() {
  await pagePermissionCheck<AdministratorSections>("administrator_index");
  const permission = await checkPermission();

  return (
    <>
      <AdministratorIndexProvider permission={permission}>
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
            padding: 3,
            width: "100%",
            textAlign: "left",
            paddingX: 3,
            paddingY: 1,
            height: "60px",
            mb: 3,
          }}
        >
          <Typography
            sx={{ fontSize: "30px", fontWeight: "bold" }}
            color="text.primary"
          >
            Administrator
          </Typography>
        </Box>

          {permission.administrator_create && (
            <Tooltip title="Add New Administrator">
              <Button
                href="/administrators/new"
                color="primary"
                startIcon={<AddCircleOutlineIcon />}
              >
                add
              </Button>
            </Tooltip>
          )}
          <div className="flex justify-center">
            <AdministratorsTable />
          </div>
      </AdministratorIndexProvider>
    </>
  );
}
