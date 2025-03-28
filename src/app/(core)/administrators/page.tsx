import { AdministratorIndexProvider } from "@/components/administrator/AdministratorIndexProvider";
import { checkPermission } from "./action";
import {
  Button,
  Divider,
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
        <div className="flex gap-3 items-center">
          <Typography
            sx={{
              fontSize: { xs: "20px", sm: "25px", md: "30px" },
            }}
            color="text.primary"
          >
            Administrator
          </Typography>

          <Divider orientation="vertical" variant="middle" flexItem />

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
        </div>

        <div className="flex w-full justify-center">
          <AdministratorsTable />
        </div>
      </AdministratorIndexProvider>
    </>
  );
}
