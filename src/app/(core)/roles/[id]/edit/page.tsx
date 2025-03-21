import { checkPermission, getRole, getSectionTree } from "../../action";
import RoleForm from "@/components/roles/RoleForm";
import { RoleDetailEntity } from "../../../../../../types/entities/roles";
import { IconButton } from "@mui/material";
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
      <div className="w-full p-4 px-6 lg:px-20">
        <div className="flex gap-2 items-center mb-2">
          <Link href="/roles">
            <IconButton color="primary" aria-label="kembali">
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <BreadcrumbCustom items={breadcrumbItems(role)} />
        </div>
        <h1 className="text-3xl font-bold mb-4">Edit Role</h1>
        <div className="mb-5">
          Silahkan perbaiki data di bawah untuk update data Role
        </div>
        {permission.role_update ? (
          <RoleForm sectionTree={sectionTree} role={role} />
        ) : (
          <div>
            Kamu tidak memiliki akses. Silahkan kembali ke laman sebelumnya.
          </div>
        )}
      </div>
    </RoleIndexProvider>
  );
}
