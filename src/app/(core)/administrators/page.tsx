import { AdministratorIndexProvider } from "@/components/administrator/AdministratorIndexProvider";
import { checkPermission } from "./action";
import { Button, Link, Tooltip } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { AdministratorsTable } from "@/components/administrator/AdministratorsTable";

export default async function AdministratorPage() {
  const permission = await checkPermission();

  return (
    <>
      <AdministratorIndexProvider permission={permission}>
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
          <div className="flex flex-col items-center">
            <AdministratorsTable />
          </div>
        </div>
      </AdministratorIndexProvider>
    </>
  );
}
