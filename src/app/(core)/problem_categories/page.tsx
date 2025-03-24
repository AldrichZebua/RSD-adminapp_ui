import { Button, IconButton, Link, Tooltip } from "@mui/material";
import { checkPermission } from "./action";
import { ProblemCategoryIndexProvider } from "@/components/problem_categories/ProblemCategoryIndexProvider";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { ProblemCategoryTable } from "@/components/problem_categories/ProblemCategoryTable";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ProblemCategorySections } from "@/components/problem_categories/lib/problem_category_section";
import { pagePermissionCheck } from "@/lib/safePageRequest";

const breadcrumbItems = [
  { title: `Problem Category`, url: "/problem_categories" },
];

export default async function ProblemCategoryPage() {
  await pagePermissionCheck<ProblemCategorySections>("problem_category_index");
  const permission = await checkPermission();
  return (
    <>
      <ProblemCategoryIndexProvider permission={permission}>
        <div className="flex gap-2 items-center mb-2">
          <Link href="/dashboard">
            <IconButton color="primary" aria-label="kembali">
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <BreadcrumbCustom items={breadcrumbItems} />
        </div>
        <div className="text-3xl font-bold mb-8">Problem Category</div>
        <div
          style={{
            display: "flex flex-col",
            alignItems: "center",
          }}
        >
          {permission.problem_category_create && (
            <Tooltip title="Tambah Problem Category baru">
              <Link
                href="/problem_categories/new"
                style={{ textDecoration: "none" }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddCircleOutlineIcon />}
                >
                  Tambah
                </Button>
              </Link>
            </Tooltip>
          )}
          <div className="flex justify-center">
            <ProblemCategoryTable />
          </div>
        </div>
      </ProblemCategoryIndexProvider>
    </>
  );
}
