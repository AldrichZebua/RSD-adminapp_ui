import { checkPermission, getRole, getSectionTree } from "../../action";
import RoleForm from "@/components/roles/RoleForm";
import { RoleDetailEntity } from "../../../../../../types/entities/roles";
import { IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";
import { RoleIndexProvider } from "@/components/roles/RoleIndexProvider";
import { pagePermissionCheck } from "@/lib/safePageRequest";
import { RoleSections } from "@/components/roles/lib/role_section";

const breadcrumbItems = (data: RoleDetailEntity) => [
  { title: `Roles`, url: "/roles" },
  { title: `Detail - ${data.name}`, url: `/roles/${data.id}` },
  { title: `Edit`, url: `/roles/${data.id}/edit` },
];

export default async function RoleEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const pageParams = await params;

  const pageDetail: Promise<RoleDetailEntity> = new Promise(
    (resolve, reject) => {
      getRole(pageParams.id).then((result) => {
        if (result.success) {
          resolve(result.data.role);
        } else {
          reject(result.data.message);
        }
      });
    }
  );

  await pagePermissionCheck<RoleSections>("role_update");

  const [role, sectionTree, permission] = await Promise.all([
    pageDetail,
    getSectionTree(),
    checkPermission(),
  ]);

  return (
    <RoleIndexProvider permission={permission}>
      <div className="flex flex-row gap-2 items-center">
        <Link href="/roles">
          <IconButton color="primary" aria-label="kembali">
            <ArrowBackIcon />
          </IconButton>
        </Link>
        <BreadcrumbCustom items={breadcrumbItems(role)} />
      </div>
      <div className="flex gap-3 items-center">

        <Typography
          sx={{
            fontSize: { xs: "20px", sm: "25px", md: "30px" },
          }}
          color="text.primary"
        >
          Edit Role
        </Typography>
      </div>
      <div className="mb-3">
        Silahkan perbaiki data di bawah untuk update data Role
      </div>
      <RoleForm sectionTree={sectionTree} role={role} />
    </RoleIndexProvider>
  );
}
