import { ClientIndexProvider } from '@/components/clients/ClientIndexProvider';
import { ClientTable } from '@/components/clients/ClientTable';
import { checkPermission } from './action';
import { Button, Link, Tooltip } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";


export default async function ClientsPage() {
  const permission = await checkPermission();
  
  return (
    <>
    <ClientIndexProvider permission={permission}>
    <div className="text-3xl font-bold mb-8">Client</div>
        <div
          style={{
            display: "flex flex-col",
            alignItems: "center",
          }}
        >
          {permission.client_create && (
            <Tooltip title="Tambah client baru">
              <Link
                href="/clients/new"
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
        <div className="flex flex-col row-start-2 items-center">
          <ClientTable />
        </div>
      </div>
    </ClientIndexProvider>
    </>
  );
}