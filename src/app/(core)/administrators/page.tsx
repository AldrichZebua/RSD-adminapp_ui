import { AdministratorIndexProvider } from "@/components/administrator/AdministratorIndexProvider";
import { checkPermission } from "./action";
import { Button, IconButton, Link, Tooltip } from "@mui/material";
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
        <div className="flex flex-row gap-2 items-center mb-2">
          <Link href="/dashboard">
            <IconButton color="primary" aria-label="kembali">
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <BreadcrumbCustom items={breadcrumbItems} />
        </div>
        <div className="text-3xl font-bold mb-8">Administrator</div>
        <div
          style={{
            display: "flex flex-col",
            alignItems: "center",
          }}
        >
          {permission.administrator_create && (
            <Tooltip title="Tambah administrator baru">
              <Link
                href="/administrators/new"
                style={{ textDecoration: "none" }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddCircleOutlineIcon />}
                >
                  Tambah
                </Button>
              </Link>
            </Tooltip>
          )}
          <AdministratorsTable />
        </div>
      </AdministratorIndexProvider>
    </>
  );
}
