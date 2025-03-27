import { AdministratorIndexProvider } from "@/components/administrator/AdministratorIndexProvider";
import { Box, IconButton, Link, Typography } from "@mui/material";
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
        <div className="flex flex-row gap-2 items-center">
          <Link href="/administrators">
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
            Tambah Administrator
          </Typography>
        </Box>
        <div className="mb-3">
          Silahkan lengkapi data di bawah untuk menambahkan Administrator baru
        </div>
        <AdministratorForm roles={roles ?? []} />
      </AdministratorIndexProvider>
    </>
  );
}
