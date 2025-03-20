import { IconButton, Link } from "@mui/material";
import { checkPermission } from "../action";
import { ProblemCategoryIndexProvider } from "@/components/problem_categories/ProblemCategoryIndexProvider";
import ProblemCategoryForm from "@/components/problem_categories/ProblemCategoryForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";

const breadcrumbItems = [
  { title: `Problem Category`, url: "/problem_categories" },
  { title: `Baru`, url: "/problem_categories/new" },
];

export default async function ProblemCategoryNewPage() {
  const permission = await checkPermission();

  return (
    <>
      <ProblemCategoryIndexProvider permission={permission}>
        <div className="flex gap-2 items-center mb-2">
          <Link href="/problem_categories">
            <IconButton color="primary" aria-label="kembali">
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <BreadcrumbCustom items={breadcrumbItems} />
        </div>
        <br />
        <div className="text-3xl font-medium">Tambah Problem Category</div>
        <div className="mt-5">
          Silahkan lengkapi data di bawah untuk menambahkan Problem Category
          Baru
        </div>
        {permission.problem_category_create ? (
          <main>
            <ProblemCategoryForm />
          </main>
        ) : (
          <div>
            Kamu tidak memiliki akses. Silahkan kembali ke laman sebelumnya.
          </div>
        )}
      </ProblemCategoryIndexProvider>
    </>
  );
}
