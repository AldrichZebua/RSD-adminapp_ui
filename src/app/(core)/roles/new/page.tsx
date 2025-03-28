import { checkPermission } from "../action";
import Link from "@mui/material/Link";
import { RoleIndexProvider } from "@/components/roles/RoleIndexProvider";
import RoleForm from "@/components/roles/RoleForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";
import { IconButton, Typography } from "@mui/material";
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
        <div className="flex gap-3 items-center">
          <Typography
            sx={{
              fontSize: { xs: "20px", sm: "25px", md: "30px" },
            }}
            color="text.primary"
          >
            Create Roles
          </Typography>
        </div>
        <div className="mt-4 mb-3">
          Silahkan lengkapi data di bawah untuk update data Role
        </div>
        <RoleForm sectionTree={[]} />
      </RoleIndexProvider>
    </>
  );
}
