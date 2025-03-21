import { AdministratorIndexProvider } from "@/components/administrator/AdministratorIndexProvider";
import { IconButton, Link } from "@mui/material";
import { checkPermission, getRoleDropdown } from "../action";
import AdministratorForm from "@/components/administrator/AdministratorForm";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { RoleEntity } from "../../../../../types/entities/roles";
import { pagePermissionCheck } from "@/lib/safePageRequest";
import { AdministratorSections } from "@/components/administrator/lib/administrators_section";

const breadcrumbItems = [
  { title: `Administrator`, url: "/administrators" },
  { title: `Baru`, url: "/administrators/new" },
];

export default async function AdministratorNewPage() {
  await pagePermissionCheck<AdministratorSections>("administrator_create");
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

  const [permission, roles] = await Promise.all([checkPermission(), rolesData]);

  return (
    <>
      <AdministratorIndexProvider permission={permission}>
        <div className="w-full p-4 px-6 lg:px-20">
          <div className="container mx-auto">
            <Link href="/administrators">
              <IconButton color="primary" aria-label="kembali">
                <ArrowBackIcon />
              </IconButton>
            </Link>
            <BreadcrumbCustom items={breadcrumbItems} />
          </div>
          <main>
            <div className="text-3xl font-medium">Tambah Administrator</div>
            <div className="mb-5">
              Silahkan lengkapi data di bawah untuk menambahkan Administrator
              baru
            </div>
            <AdministratorForm roles={roles ?? []} />
          </main>
        </div>
      </AdministratorIndexProvider>
    </>
  );
}
