import { ProblemIndexProvider } from "@/components/problems/ProblemIndexProvider";
import { checkPermission } from "../action";
import ProblemForm from "@/components/problems/ProblemForm";
import { Box, IconButton, Link, Typography } from "@mui/material";
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
            Tambah Problem
          </Typography>
        </Box>
        <div className="mb-3">
          Silahkan lengkapi data di bawah untuk menambahkan Problem baru
        </div>
        <ProblemForm />
      </ProblemIndexProvider>
    </>
  );
}
