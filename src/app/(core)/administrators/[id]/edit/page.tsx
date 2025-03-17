import { AdministratorEntity } from "../../../../../../types/entities/administrators";
import {
  checkPermission,
  getAdministrator,
  getRoleDropdown,
} from "../../action";
import { IconButton, Link } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AdministratorIndexProvider } from "@/components/administrator/AdministratorIndexProvider";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";
import AdministratorForm from "@/components/administrator/AdministratorForm";
import { RoleEntity } from "../../../../../../types/entities/roles";

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
      <div className="w-full p-4 px-6 lg:px-20">
        <div className="container mx-auto">
          <Link href="/administrators">
            <IconButton color="primary" aria-label="kembali">
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <BreadcrumbCustom items={breadcrumbItems(administrator)} />
        </div>
        <h1 className="text-3xl font-bold mb-4">Edit Administrator</h1>
        <div className="mb-5">
          Silahkan perbaiki data di bawah untuk update data Administrator
        </div>
        <AdministratorForm roles={roles} administrator={administrator} />
      </div>
    </AdministratorIndexProvider>
  );
}
