import { checkPermission } from "../action";
import Link from "@mui/material/Link";
import { RoleIndexProvider } from "@/components/roles/RoleIndexProvider";
import RoleForm from "@/components/roles/RoleForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";
import { Box, IconButton, Typography } from "@mui/material";
import { RoleSections } from "@/components/roles/lib/role_section";
import { pagePermissionCheck } from "@/lib/safePageRequest";

const breadcrumbItems = [
  { title: `Roles`, url: "/roles" },
  { title: `Baru`, url: "/roles/new" },
];

export default async function RoleNewPage() {
  await pagePermissionCheck<RoleSections>("role_create");
  const [permission] = await Promise.all([checkPermission()]);

  return (
    <>
      <RoleIndexProvider permission={permission}>
        <div className="flex flex-row gap-2 items-center">
          <Link href="/roles">
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
            Create Roles
          </Typography>
        </Box>
        <div className="mb-3">
          Silahkan lengkapi data di bawah untuk update data Role
        </div>
        <RoleForm sectionTree={[]} />
      </RoleIndexProvider>
    </>
  );
}
