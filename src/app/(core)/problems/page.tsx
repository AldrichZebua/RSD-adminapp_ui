import { ProblemIndexProvider } from "@/components/problems/ProblemIndexProvider";
import { checkPermission } from "./action";
import { ProblemTable } from "@/components/problems/ProblemTable";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { ProblemSections } from "@/components/problems/lib/problem_section";
import { pagePermissionCheck } from "@/lib/safePageRequest";

const breadcrumbItems = [{ title: `Problems`, url: "/" }];

export default async function ProblemPage() {
  await pagePermissionCheck<ProblemSections>("problem_index");
  const permission = await checkPermission();

  return (
    <>
      <ProblemIndexProvider permission={permission}>
        <div className="flex flex-row gap-2 items-center">
          <Link href="/dashboard">
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
            Problem
          </Typography>
        </Box>
        {permission.problem_create && (
          <Tooltip title="Tambah Problem Category baru">
            <Button
              href="/problems/new"
              color="primary"
              startIcon={<AddCircleOutlineIcon />}
            >
              add
            </Button>
          </Tooltip>
        )}
        <div className="flex w-full justify-center">
            <ProblemTable />
          </div>
      </ProblemIndexProvider>
    </>
  );
}
