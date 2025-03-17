import { ProblemIndexProvider } from "@/components/problems/ProblemIndexProvider";
import { checkPermission } from "./action";
import { ProblemTable } from "@/components/problems/ProblemTable";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";
import { IconButton } from "@mui/material";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const breadcrumbItems = [{ title: `/Problems`, url: "/" }];

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
        ></div>
        <div className="grid grid-rows-[0px_1fr_0px] justify-items-center min-h-screen gap-16 font-[family-name:var(--font-geist-sans)]">
          <main className="flex flex-col row-start-2 items-center">
            <ProblemTable />
          </main>
        </div>
      </ProblemIndexProvider>
    </>
  );
}
