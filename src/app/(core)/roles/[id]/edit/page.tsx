import { RoleDetailEntity } from "../../../../../../types/entities/roles";
import { getRole, getSectionTree } from "../../action";
import RoleFormEdit from "@/components/roles/RoleFormEdit";

async function getData(id: string): Promise<RoleDetailEntity> {
  const result = await getRole(id);
  if (result.success) {
    return result.data.role;
  } else {
    throw new Error(result.data.message || "Failed to fetch role data");
  }
}

const RoleEditPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const pagePayloads = await Promise.allSettled([
    getData((await params).id),
    getSectionTree(),
  ]);
  const errors = pagePayloads.filter((e) => e.status == "rejected");

  if (errors.length == 0) {
    const [pageData, sectionData] = pagePayloads;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sectionTree = (sectionData as PromiseFulfilledResult<any>).value;
    const data = (pageData as PromiseFulfilledResult<RoleDetailEntity>).value;
    return (
      <div className="mx-auto w-full max-w-full container">
        <RoleFormEdit sectionTree={sectionTree} role={data} />
      </div>
    );
  } else {
    return (
      <div>
        {errors.map((e) => (e as PromiseRejectedResult).reason).join(", ")}
      </div>
    );
  }
};

export default RoleEditPage;
