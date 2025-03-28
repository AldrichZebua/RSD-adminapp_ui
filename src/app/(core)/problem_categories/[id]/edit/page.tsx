import { ProblemCategoryEntity } from "../../../../../../types/entities/problem_category";
import { checkPermission, getProblemCategory } from "../../action";
import ProblemCategoryForm from "@/components/problem_categories/ProblemCategoryForm";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";
import { IconButton, Typography } from "@mui/material";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ProblemCategoryIndexProvider } from "@/components/problem_categories/ProblemCategoryIndexProvider";
import { pagePermissionCheck } from "@/lib/safePageRequest";
import { ProblemCategorySections } from "@/components/problem_categories/lib/problem_category_section";

const breadcrumbItems = (data: ProblemCategoryEntity) => [
  { title: `Problem Categories`, url: "/problem_categories" },
  { title: `Detail - ${data.name}`, url: `/problem_categories/${data.id}` },
];

export default async function ProblemCategoryEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await pagePermissionCheck<ProblemCategorySections>("problem_category_update");
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

  const [problem_category, permission] = await Promise.all([
    pageDetail,
    checkPermission(),
  ]);

  return (
    <ProblemCategoryIndexProvider permission={permission}>
      <div className="flex flex-row gap-2 items-center">
        <Link href="/problem_categories">
          <IconButton color="primary" aria-label="kembali">
            <ArrowBackIcon />
          </IconButton>
        </Link>
        <BreadcrumbCustom items={breadcrumbItems(problem_category)} />
      </div>
      <div className="flex gap-3 items-center">
        <Typography
          sx={{
            fontSize: { xs: "20px", sm: "25px", md: "30px" },
          }}
          color="text.primary"
        >
          Edit Problem Category
        </Typography>
      </div>
      <div className="mt-5">Silahkan perbaiki data di bawah untuk update data Role</div>
      <ProblemCategoryForm problem_category={problem_category} />
    </ProblemCategoryIndexProvider>
  );
}
