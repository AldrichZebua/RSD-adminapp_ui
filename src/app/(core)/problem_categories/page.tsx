import {
  Button,
  Divider,
  IconButton,
  Link,
  Tooltip,
  Typography,
} from "@mui/material";
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
        <div className="flex flex-row gap-2 items-center">
          <Link href="/dashboard">
            <IconButton color="primary" aria-label="kembali">
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <BreadcrumbCustom items={breadcrumbItems} />
        </div>
        <div className="flex gap-3 items-center">
          <Typography
            sx={{
              fontSize: { xs: "20px", sm: "25px", md: "30px" },
            }}
            color="text.primary"
          >
            Problem Category
          </Typography>

          <Divider orientation="vertical" variant="middle" flexItem />

          {permission.problem_category_create && (
            <Tooltip title="Tambah Problem Category baru">
              <Button
                href="/problem_categories/new"
                color="primary"
                startIcon={<AddCircleOutlineIcon />}
              >
                add
              </Button>
            </Tooltip>
          )}
        </div>
        <div className="flex w-full justify-center">
          <ProblemCategoryTable />
        </div>
      </ProblemCategoryIndexProvider>
    </>
  );
}
