"use server";


import { ProblemCategoryEntity } from "../../../../../../types/entities/problem_category";
import { checkPermission, getProblemCategory } from "../../action";
import ProblemCategoryForm from "@/components/problem_categories/ProblemCategoryForm";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";
import { IconButton } from "@mui/material";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ProblemCategoryIndexProvider } from "@/components/problem_categories/ProblemCategoryIndexProvider";

const breadcrumbItems = (data: ProblemCategoryEntity) => [
  { title: `Problem`, url: "/problem" },
  { title: `Detail - ${data.name}`, url: `/problem/${data.id}` },
];


export default async function ProblemCategoryEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const pageParams = await params;
  
  const pageDetail: Promise<ProblemCategoryEntity> = new Promise(
    (resolve, reject) => {
      getProblemCategory(pageParams.id).then((result) => {
        if (result.success) {
          resolve(result.data.problem_category);
        } else {
          reject(result.data.message);
        }
      });
    }
  );

    const [problem_category, permission ] = await Promise.all([
      pageDetail,
      checkPermission(),

    ]);

  return (
    <ProblemCategoryIndexProvider permission={permission}>
      <div className="mx-auto w-full max-w-4xl p-4">
        <div className="flex gap-2 items-center mb-2">
          <Link href="/problem_categories">
            <IconButton color="primary" aria-label="kembali">
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <BreadcrumbCustom items={breadcrumbItems(problem_category)} />
        </div>
        <h1 className="text-3xl font-bold mb-4">Tambahkan Problem Category</h1>
        <ProblemCategoryForm />
      </div>
    </ProblemCategoryIndexProvider>
  );
}
