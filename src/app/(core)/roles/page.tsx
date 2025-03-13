import { RoleTable } from "@/components/roles/RoleTable";
import * as React from "react";
import { RoleIndexProvider } from "@/components/roles/RoleIndexProvider";
import { checkPermission } from "./action";
import { Button, Link, Tooltip } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import NextLink from "next/link";



export default async function RolesPage() {
  const permission = await checkPermission();

  return (
    <>
      <RoleIndexProvider permission={permission}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
        {
          permission.role_create
          &&
          <Tooltip title="Tambah Hak Akses baru">
            <Link component={NextLink} href="/dashboard/roles/new" style={{ textDecoration: "none" }}>
              <Button variant="contained" color="primary" startIcon={<AddCircleOutlineIcon />}>Tambah</Button>
            </Link>
          </Tooltip>
        }
      </div>
          <div className="flex flex-col row-start-2 items-center">
            <RoleTable />
          </div>
      </RoleIndexProvider>
    </>
  );
}
