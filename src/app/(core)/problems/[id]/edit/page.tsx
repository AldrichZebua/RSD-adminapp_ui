import { checkPermission, getProblem } from "../../action";
import { ProblemEntity } from "../../../../../../types/entities/problem";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { ProblemIndexProvider } from "@/components/problems/ProblemIndexProvider";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";
import ProblemForm from "@/components/problems/ProblemForm";

const breadcrumbItems = (data: ProblemEntity) => [
  { title: `Problem`, url: "/problems" },
  { title: `Detail - ${data.title}`, url: `/problems/${data.id}` },
  { title: `Edit`, url: `/problems/${data.id}/edit` },
];

export default async function ProblemEditPage({
  params,
}: {
  params: { id: string };
}) {
  const pageParams = await params;

  const pageDetail: Promise<ProblemEntity> = new Promise((resolve, reject) => {
    getProblem(pageParams.id).then((result) => {
      if (result.success) {
        resolve(result.data.problem);
      } else {
        reject(result.data.message);
      }
    });
  });

  const [problem, permission] = await Promise.all([
    pageDetail,
    checkPermission(),
  ]);

  return (
    <ProblemIndexProvider permission={permission}>
      <div className="mx-auto w-full max-w-4xl p-4">
        <div className="flex gap-2 items-center mb-2">
          <Link href="/problems">
            <IconButton color="primary" aria-label="kembali">
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <BreadcrumbCustom items={breadcrumbItems(problem)} />
        </div>
        <h1 className="text-3xl font-bold mb-4">Edit Problem</h1>
        <div className="mb-5">
          Silahkan lengkapi data di bawah untuk update Problem
        </div>
        <ProblemForm />
      </div>
    </ProblemIndexProvider>
  );
}
