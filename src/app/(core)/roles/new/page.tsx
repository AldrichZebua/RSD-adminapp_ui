"use server";

import { checkPermission } from "../action";
import Link from "@mui/material/Link";
import NextLink from "next/link";
import { RoleIndexProvider } from "@/components/roles/RoleIndexProvider";
import RoleFormEdit from "@/components/roles/RoleFormEdit";

export default async function RoleNewPage() {
  const permission = await checkPermission();

  return (
    <>
      <RoleIndexProvider permission={permission}>
        {permission.role_create ? (
          <div>
            <RoleFormEdit sectionTree={[]} />
          </div>
        ) : (
          <Link
            component={NextLink}
            href={`/dashboard/roles`}
            underline="none"
            color="dark"
          />
        )}
      </RoleIndexProvider>
    </>
  );
}
