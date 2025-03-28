import { RoleTable } from "@/components/roles/RoleTable";
import * as React from "react";
import { RoleIndexProvider } from "@/components/roles/RoleIndexProvider";
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";
import { RoleSections } from "@/components/roles/lib/role_section";
import { pagePermissionCheck } from "@/lib/safePageRequest";

const breadcrumbItems = [{ title: `Roles`, url: "/roles" }];

export default async function RolesPage() {
  await pagePermissionCheck<RoleSections>("role_index");
  const permission = await checkPermission();

  return (
    <>
      <RoleIndexProvider permission={permission}>
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
            Roles
          </Typography>

          <Divider orientation="vertical" variant="middle" flexItem />

          {permission.role_create && (
            <Tooltip title="Tambah Hak Akses baru">
              <Button
                href="/roles/new"
                color="primary"
                startIcon={<AddCircleOutlineIcon />}
              >
                add
              </Button>
            </Tooltip>
          )}
        </div>
        <div className="flex w-full justify-center">
          <RoleTable />
        </div>
      </RoleIndexProvider>
    </>
  );
}
