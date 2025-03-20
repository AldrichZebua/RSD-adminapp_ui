import { ProblemIndexProvider } from "@/components/problems/ProblemIndexProvider";
import { checkPermission } from "../action";
import ProblemForm from "@/components/problems/ProblemForm";
import { IconButton, Link } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";

const breadcrumbItems = [
  { title: `Problem`, url: "/problems" },
  { title: `Baru`, url: "/problems/new" },
];

export default async function ProblemNewPage() {
  const permission = await checkPermission();

  return (
    <>
      <ProblemIndexProvider permission={permission}>
        <div className="w-full p-4 px-6 lg:px-20">
          <div className="container mx-auto">
            <Link href="/problems">
              <IconButton color="primary" aria-label="kembali">
                <ArrowBackIcon />
              </IconButton>
            </Link>
            <BreadcrumbCustom items={breadcrumbItems} />
          </div>
          <br />
          <div className="text-3xl font-medium">Tambah Problem</div>
          <div className="mt-5">
            Silahkan lengkapi data di bawah untuk menambahkan Problem baru
          </div>
          {permission.problem_create ? (
            <main>
              <ProblemForm />
            </main>
          ) : (
            <div>
              Kamu tidak memiliki akses. Silahkan kembali ke laman sebelumnya.
            </div>
          )}
        </div>
      </ProblemIndexProvider>
    </>
  );
}
