import { RoleTable } from "@/components/roles/RoleTable";
import * as React from "react";
import { RoleIndexProvider } from "@/components/roles/RoleIndexProvider";
import { checkPermission } from "./action";
import { Button, IconButton, Link, Tooltip } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import NextLink from "next/link";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";
import { RoleSections } from "@/components/roles/lib/role_section";
import { pagePermissionCheck } from "@/lib/safePageRequest";

const breadcrumbItems = [
  { title: `Roles`, url: '/roles' },
];

export default async function RolesPage() {
    await pagePermissionCheck<RoleSections>("role_index");
  const permission = await checkPermission();

  return (
    <>
      <RoleIndexProvider permission={permission}>
      <div className="flex gap-2 items-center mb-2">
          <Link href="/dashboard">
            <IconButton color="primary" aria-label="kembali">
              <ArrowBackIcon/>
            </IconButton>
          </Link>
          <BreadcrumbCustom items={breadcrumbItems} />
        </div>
      <div className="text-3xl font-bold mb-8">Roles</div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
        {
          permission.role_create
          &&
          <Tooltip title="Tambah Hak Akses baru">
            <Link component={NextLink} href="/roles/new" style={{ textDecoration: "none" }}>
              <Button variant="contained" color="primary" startIcon={<AddCircleOutlineIcon />}>Tambah</Button>
            </Link>
          </Tooltip>
        }
      </div>
      <div className="flex justify-center">
        <RoleTable />
      </div>
      </RoleIndexProvider>
    </>
  );
}
