import { AdministratorEntity } from "../../../../../../types/entities/administrators";
import {
  checkPermission,
  getAdministrator,
  getRoleDropdown,
} from "../../action";
import { IconButton, Link, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AdministratorIndexProvider } from "@/components/administrator/AdministratorIndexProvider";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";
import { RoleEntity } from "../../../../../../types/entities/roles";
import AdministratorForm from "@/components/administrator/AdministratorForm";
import { AdministratorSections } from "@/components/administrator/lib/administrators_section";
import { pagePermissionCheck } from "@/lib/safePageRequest";

const breadcrumbItems = (data: AdministratorEntity) => [
  { title: `Administrator`, url: "/administrators" },
  { title: `Detail - ${data.username}`, url: `/administrators/${data.id}` },
  { title: `Edit`, url: `/administrators/${data.id}/edit` },
];

export default async function AdministratorEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await pagePermissionCheck<AdministratorSections>("administrator_update");
  const pageParams = await params;

  const pageDetail: Promise<AdministratorEntity> = new Promise(
    (resolve, reject) => {
      getAdministrator(pageParams.id).then((result) => {
        if (result.success) {
          resolve(result.data.administrator);
        } else {
          reject(result.data.message);
        }
      });
    }
  );

  const rolesData: Promise<Pick<RoleEntity, "id" | "name">[]> = new Promise(
    (resolve, reject) => {
      getRoleDropdown().then((result) => {
        if (result.success) {
          resolve(result.data.roles);
        } else {
          reject(result.data.message);
        }
      });
    }
  );

  const [administrator, permission, roles] = await Promise.all([
    pageDetail,
    checkPermission(),
    rolesData,
  ]);

  return (
    <AdministratorIndexProvider permission={permission}>
      <div className="flex flex-row gap-2 items-center">
        <Link href="/administrators">
          <IconButton color="primary" aria-label="kembali">
            <ArrowBackIcon />
          </IconButton>
        </Link>
        <BreadcrumbCustom items={breadcrumbItems(administrator)} />
      </div>
      <Typography
        sx={{
          fontSize: { xs: "20px", sm: "25px", md: "30px" },
          mb: 2,
        }}
        color="text.primary"
      >
        Edit Administrator
      </Typography>
      <div className="mt-3">
        Silahkan perbaiki data di bawah untuk update data Administrator
      </div>
      <AdministratorForm roles={roles} administrator={administrator} />
    </AdministratorIndexProvider>
  );
}
