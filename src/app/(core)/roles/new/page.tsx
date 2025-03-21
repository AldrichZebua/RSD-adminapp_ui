import { checkPermission } from "../action";
import Link from "@mui/material/Link";
import { RoleIndexProvider } from "@/components/roles/RoleIndexProvider";
import RoleForm from "@/components/roles/RoleForm";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";
import { IconButton } from "@mui/material";
import { RoleSections } from "@/components/roles/lib/role_section";
import { pagePermissionCheck } from "@/lib/safePageRequest";


const breadcrumbItems = [
  { title: `Roles`, url: '/roles' },
  { title: `Baru`, url: '/roles/new' },
];

export default async function RoleNewPage() {
      await pagePermissionCheck<RoleSections>("role_create");
  
  const permission = await checkPermission();

  return (
    <>
      <RoleIndexProvider permission={permission}>
      <div className="flex gap-2 items-center mb-2">
          <Link href="/roles">
            <IconButton color="primary" aria-label="kembali">
              <ArrowBackIcon/>
            </IconButton>
          </Link>
          <BreadcrumbCustom items={breadcrumbItems} />
        </div>
        <h1 className="text-3xl font-bold mb-4">Edit Role</h1>
        <div className="mb-5">
          Silahkan lengkapi data di bawah untuk update data Role
        </div>
        {permission.role_create ? (
          <div>
            <RoleForm sectionTree={[]} />
          </div>
        ) : (
          <div>
          Kamu tidak memiliki akses. Silahkan kembali ke laman sebelumnya.
        </div>
        )}
      </RoleIndexProvider>
    </>
  );
}
