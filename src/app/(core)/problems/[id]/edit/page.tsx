
import { checkPermission, getProblem } from "../../action";
import { ProblemEntity } from "../../../../../../types/entities/problem";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { ProblemForm } from "@/components/problems/ProblemForm";
import { ProblemIndexProvider } from "@/components/problems/ProblemIndexProvider";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";

const breadcrumbItems = (data: ProblemEntity) => [
  { title: `Problem`, url: "/problems" },
  { title: `Detail - ${data.title}`, url: `/problems/${data.id}` },
  { title: `Edit`, url: `/problems/${data.id}/edit` },
];

async function getData(id: string): Promise<ProblemEntity | undefined> {
  const result = await getProblem(id);
  return result.success ? result.data.problem : undefined;
}

export default async function ProblemEditPage({
  params,
}: {
  params: { id: string };
}) {
  const permission = await checkPermission();
  const data = await getData(params.id);

  if (!data) {
    return <h1>Error fetching data...</h1>;
  }

  return (
    <ProblemIndexProvider permission={permission}>
      <div className="mx-auto w-full max-w-4xl p-4">
        <div className="flex gap-2 items-center mb-2">
          <Link href="/problem">
            <IconButton color="primary" aria-label="kembali">
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <BreadcrumbCustom items={breadcrumbItems(data)} />
        </div>
        <h1 className="text-3xl font-bold mb-4">Edit Problem Category</h1>
        <ProblemForm />
        <div className="text-red-500">
          Data Problem Category tidak ditemukan.
        </div>
      </div>
    </ProblemIndexProvider>
  );
}
