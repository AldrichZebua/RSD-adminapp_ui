import { ProblemIndexProvider } from "@/components/problems/ProblemIndexProvider";
import { checkPermission, getProblem } from "../action";
import {
  Button,
  Card,
  CardContent,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
} from "@mui/material";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { ProblemEntity } from "../../../../../types/entities/problem";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ProblemSections } from "@/components/problems/lib/problem_section";
import { pagePermissionCheck } from "@/lib/safePageRequest";

const breadcrumbItems = (data: ProblemEntity) => [
  { title: `Problem`, url: "/problem" },
  { title: `Detail - ${data.title}`, url: `/problem/${data.id}` },
];

async function getData(id: string): Promise<ProblemEntity | undefined> {
  const result = await getProblem(id);
  return result.success ? result.data.problem : undefined;
}

export default async function ProblemShowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const data = await getData((await params).id);
  const permission = await checkPermission();

  if (!data) {
    return <h1>Error fetching data...</h1>;
  }
  await pagePermissionCheck<ProblemSections>("problem_show");

  return (
    <>
      <ProblemIndexProvider permission={permission}>
        <div className="flex gap-2 items-center mb-2">
          <Link href="/problems">
            <IconButton color="primary" aria-label="kembali">
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <BreadcrumbCustom items={breadcrumbItems(data)} />
        </div>
        <div className="text-3xl font-medium mb-8">Detail Problem</div>
        {permission.problem_update && (
          <div className="mb-5">
            <Tooltip title="Edit Client">
              <Link
                href={`/problems/${data.id}/edit`}
                style={{ textDecoration: "none" }}
              >
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  startIcon={<DriveFileRenameOutlineIcon />}
                >
                  Edit
                </Button>
              </Link>
            </Tooltip>
          </div>
        )}

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium w-40">Topik</TableCell>
                  <TableCell>: {data.title}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium w-40">Detail</TableCell>
                  <TableCell>: {data.description}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium w-40">Category</TableCell>
                  <TableCell>: {data?.problem_category?.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium w-40">Create at</TableCell>
                  <TableCell>: {data.created_at}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium w-40">Update at</TableCell>
                  <TableCell>: {data.updated_at}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium w-40">Status</TableCell>
                  <TableCell>: {data.status_label}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
{/* 
        <div className="flex mt-5 justify-end">
          <Tooltip title="Kembali">
            <Link href="/problem" style={{ textDecoration: "none" }}>
              <Button variant="outlined" startIcon={<FirstPageIcon />}>
                Kembali
              </Button>
            </Link>
          </Tooltip>
        </div> */}
      </ProblemIndexProvider>
    </>
  );
}
