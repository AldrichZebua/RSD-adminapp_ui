import { Button, Link, Tooltip } from "@mui/material";
import { checkPermission } from "./action";
import { ProblemCategoryIndexProvider } from "@/components/problem_categories/ProblemCategoryIndexProvider";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { ProblemCategoryTable } from "@/components/problem_categories/ProblemCategoryTable";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";

const breadcrumbItems = [
  { title: `/Problem Category`, url: '/' },
];

export default async function ProblemCategoryPage() {
  const permission = await checkPermission();

  return (
    <>
      <ProblemCategoryIndexProvider permission={permission}>
        <div className="items-center mb-2">
        <BreadcrumbCustom items={breadcrumbItems} />
      </div>
        <div className="text-3xl font-bold mb-8">Problem Category</div>
        <div
          style={{
            display: "flex flex-col",
            alignItems: "center",
          }}
        >
          {permission.problemCategory_create && (
            <Tooltip title="Tambah client baru">
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
          <div className="flex flex-col row-start-2 items-center">
            <ProblemCategoryTable />
          </div>
        </div>
      </ProblemCategoryIndexProvider>
    </>
  );
}
