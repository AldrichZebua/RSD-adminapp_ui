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

async function getData(id: string): Promise<ProblemCategoryEntity | undefined> {
  const result = await getProblemCategory(id);
  return result.success ? result.data.problem_category : undefined;
}

export default async function ProblemCategoryEditPage({
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
    <ProblemCategoryIndexProvider permission={permission}>
      <div className="mx-auto w-full max-w-4xl p-4">
        <div className="flex gap-2 items-center mb-2">
          <Link href="/problem_categories">
            <IconButton color="primary" aria-label="kembali">
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <BreadcrumbCustom items={breadcrumbItems(data)} />
        </div>
        <h1 className="text-3xl font-bold mb-4">Tambahkan Problem Category</h1>
        <ProblemCategoryForm />
      </div>
    </ProblemCategoryIndexProvider>
  );
}
