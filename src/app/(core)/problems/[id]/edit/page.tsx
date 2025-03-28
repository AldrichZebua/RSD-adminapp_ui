import { checkPermission, getProblem } from "../../action";
import { ProblemEntity } from "../../../../../../types/entities/problem";
import { IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { ProblemIndexProvider } from "@/components/problems/ProblemIndexProvider";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";
import ProblemForm from "@/components/problems/ProblemForm";
import { pagePermissionCheck } from "@/lib/safePageRequest";
import { ProblemSections } from "@/components/problems/lib/problem_section";

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

  await pagePermissionCheck<ProblemSections>("problem_update");

  const [problem, permission] = await Promise.all([
    pageDetail,
    checkPermission(),
  ]);

  return (
    <ProblemIndexProvider permission={permission}>
      <div className="flex flex-row gap-2 items-center">
        <Link href="/problems">
          <IconButton color="primary" aria-label="kembali">
            <ArrowBackIcon />
          </IconButton>
        </Link>
        <BreadcrumbCustom items={breadcrumbItems(problem)} />
      </div>
      <div className="flex gap-3 items-center">
          <Typography
            sx={{ fontSize: "30px", fontWeight: "bold" }}
            color="text.primary"
          >
            Edit Problem
          </Typography>
        </div>
        <div className="mt-5">
          Silahkan lengkapi data di bawah untuk update Problem
        </div>
        <ProblemForm />
    </ProblemIndexProvider>
  );
}
