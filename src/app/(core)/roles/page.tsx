import { RoleTable } from "@/components/roles/RoleTable";
import * as React from "react";
import { RoleIndexProvider } from "@/components/roles/RoleIndexProvider";
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
            Roles
          </Typography>
        </Box>

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

        <div className="flex w-full justify-center">
          <RoleTable />
        </div>
      </RoleIndexProvider>
    </>
  );
}
