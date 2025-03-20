import { ProblemIndexProvider } from "@/components/problems/ProblemIndexProvider";
import { checkPermission } from "./action";
import { ProblemTable } from "@/components/problems/ProblemTable";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";
import { Button, IconButton, Tooltip } from "@mui/material";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const breadcrumbItems = [{ title: `Problems`, url: "/" }];

export default async function ProblemPage() {
  const permission = await checkPermission();

  return (
    <>
      <ProblemIndexProvider permission={permission}>
        <div className="flex gap-2 items-center mb-2">
          <Link href="/dashboard">
            <IconButton color="primary" aria-label="kembali">
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <BreadcrumbCustom items={breadcrumbItems} />
        </div>
        <div className="text-3xl font-bold mb-8">Problem</div>
        <div
          style={{
            display: "flex flex-col",
            alignItems: "center",
          }}
        >
          {permission.problem_create && (
            <Tooltip title="Tambah Problem Category baru">
              <Link href="/problems/new" style={{ textDecoration: "none" }}>
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
            <ProblemTable />
          </div>
        </div>
      </ProblemIndexProvider>
    </>
  );
}
