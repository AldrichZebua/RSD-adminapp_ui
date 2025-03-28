import { ProblemIndexProvider } from "@/components/problems/ProblemIndexProvider";
import { checkPermission } from "../action";
import ProblemForm from "@/components/problems/ProblemForm";
import { IconButton, Link, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";
import { pagePermissionCheck } from "@/lib/safePageRequest";
import { ProblemSections } from "@/components/problems/lib/problem_section";

const breadcrumbItems = [
  { title: `Problem`, url: "/problems" },
  { title: `Baru`, url: "/problems/new" },
];

export default async function ProblemNewPage() {
  await pagePermissionCheck<ProblemSections>("problem_create");
  const permission = await checkPermission();

  return (
    <>
      <ProblemIndexProvider permission={permission}>
        <div className="flex flex-row gap-2 items-center">
          <Link href="/problems">
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
            Tambah Problem
          </Typography>
        </div>
        <div className="mt-4">
          Silahkan lengkapi data di bawah untuk menambahkan Problem baru
        </div>
        <ProblemForm />
      </ProblemIndexProvider>
    </>
  );
}
