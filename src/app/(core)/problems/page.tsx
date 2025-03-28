import { ProblemIndexProvider } from "@/components/problems/ProblemIndexProvider";
import { checkPermission } from "./action";
import { ProblemTable } from "@/components/problems/ProblemTable";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";
import {
  Button,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
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
        <div className="flex gap-3 items-center">
          <Typography
            sx={{
              fontSize: { xs: "20px", sm: "25px", md: "30px" },
            }}
            color="text.primary"
          >
            Problem
          </Typography>

          <Divider orientation="vertical" variant="middle" flexItem />

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
        </div>
        <div className="flex w-full justify-center">
          <ProblemTable />
        </div>
      </ProblemIndexProvider>
    </>
  );
}
