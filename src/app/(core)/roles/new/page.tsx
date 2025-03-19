import { checkPermission } from "../action";
import Link from "@mui/material/Link";
import NextLink from "next/link";
import { RoleIndexProvider } from "@/components/roles/RoleIndexProvider";
import RoleForm from "@/components/roles/RoleForm";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";
import { IconButton } from "@mui/material";


const breadcrumbItems = [
  { title: `Roles`, url: '/roles' },
  { title: `Baru`, url: '/roles/new' },
];

export default async function RoleNewPage() {
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
        {permission.role_create ? (
          <div>
            <RoleForm sectionTree={[]} />
          </div>
        ) : (
          <Link
            component={NextLink}
            href={`/roles`}
            underline="none"
            color="dark"
          />
        )}
      </RoleIndexProvider>
    </>
  );
}
