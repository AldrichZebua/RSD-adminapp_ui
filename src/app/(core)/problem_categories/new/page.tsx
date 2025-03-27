import { Box, IconButton, Link, Typography } from "@mui/material";
import { checkPermission } from "../action";
import { ProblemCategoryIndexProvider } from "@/components/problem_categories/ProblemCategoryIndexProvider";
import ProblemCategoryForm from "@/components/problem_categories/ProblemCategoryForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";
import { pagePermissionCheck } from "@/lib/safePageRequest";
import { ProblemCategorySections } from "@/components/problem_categories/lib/problem_category_section";

const breadcrumbItems = [
  { title: `Problem Category`, url: "/problem_categories" },
  { title: `Baru`, url: "/problem_categories/new" },
];

export default async function ProblemCategoryNewPage() {
  await pagePermissionCheck<ProblemCategorySections>("problem_category_create");
  const permission = await checkPermission();

  return (
    <>
      <ProblemCategoryIndexProvider permission={permission}>
        <div className="flex flex-row gap-2 items-center">
          <Link href="/problem_categories">
            <IconButton color="primary" aria-label="kembali">
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <BreadcrumbCustom items={breadcrumbItems} />
        </div>
        <Box
          sx={{
            backgroundColor: "white",
            border: "1px solid #ccc",
            boxShadow: 1,
            borderRadius: 1,
            padding: { xs: 2, sm: 3 },
            width: "100%",
            textAlign: "left",
            height: { xs: "auto", sm: "60px" },
            mb: 3,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "20px", sm: "25px", md: "30px" },
            }}
            color="text.primary"
          >
            Tambah Problem Category
          </Typography>
        </Box>
        <div>
          Silahkan lengkapi data di bawah untuk menambahkan Problem Category
          Baru
        </div>
        <ProblemCategoryForm />
      </ProblemCategoryIndexProvider>
    </>
  );
}
