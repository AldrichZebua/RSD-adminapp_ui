import { RoleDetailEntity } from "../../../../../../types/entities/roles";
import { getRole, getSectionTree } from "../../action";
import RoleFormEdit from "@/components/roles/RoleFormEdit";
import { IconButton, Link } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";

const breadcrumbItems = (data: RoleDetailEntity) => [
  { title: `Roles`, url: '/roles' },
  { title: `Detail - ${data.name}`, url: `/roles/${data.id}` },
  { title: `Edit`, url: `/roles/${data.id}/edit` },
];

async function getData(id: string): Promise<RoleDetailEntity> {
  const result = await getRole(id);
  if (result.success) {
    return result.data.role;
  } else {
    throw new Error(result.data.message || "Failed to fetch role data");
  }
}

export default async function RoleEditPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const [roleData, sectionTreeData] = await Promise.allSettled([
      getData(params.id),
      getSectionTree(),
    ]);

    // Handle errors if any of the promises were rejected
    if (roleData.status === "rejected" || sectionTreeData.status === "rejected") {
      const error = roleData.status === "rejected" ? roleData.reason : sectionTreeData.reason;
      console.error("Error fetching data:", error);
      return <h1>Error fetching data: {error.message}</h1>;
    }

    const role = roleData.value;
    const sectionTree = sectionTreeData.value;

    return (
      <div className="mx-auto w-full max-w-full container">
        <div className="flex gap-2 items-center mb-2">
          <Link href="/roles">
            <IconButton color="primary" aria-label="kembali">
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <BreadcrumbCustom items={breadcrumbItems(role)} />
        </div>
        <h1 className="text-3xl font-bold mb-4">Edit Role</h1>
        <RoleFormEdit sectionTree={sectionTree} role={role} />
      </div>
    );
  } catch (error) {
    console.error("Error in RoleEditPage:", error);
    return <h1>Error: {error.message}</h1>;
  }
}