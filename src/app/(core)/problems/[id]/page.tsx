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
import FirstPageIcon from "@mui/icons-material/FirstPage";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { ProblemEntity } from "../../../../../types/entities/problem";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const breadcrumbItems = (data: ProblemEntity) => [
  { title: `Problem`, url: '/problem' },
  { title: `Detail - ${data.title}`, url: `/problem/${data.id}` },
];

async function getData(id: string): Promise<ProblemEntity | undefined> {
  const result = await getProblem(id);
  return result.success ? result.data.problem : undefined;
}

export default async function ProblemShowPage({
  params,
}: {
  params: { id: string };
}) {
  const permission = await checkPermission();
  const data = await getData(params.id);

  if (!data) {
    return <h1>Error fetching data...</h1>;
  }

  return (
    <>
      <ProblemIndexProvider permission={permission}>
      <div className="flex gap-2 items-center mb-2">
          <Link href="/administrators">
            <IconButton color="primary" aria-label="kembali">
              <ArrowBackIcon/>
            </IconButton>
          </Link>
          <BreadcrumbCustom items={breadcrumbItems(data)} />
        </div>
        <div className="text-3xl font-medium mb-8">Detail Problem</div>
        {permission.problem_update && (
          <div className="mb-5">
            <Tooltip title="Edit Client">
              <Link
                href={`/problem/${data.id}/edit`}
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
                {/* <TableRow>
                  <TableCell className="font-medium w-40">Category</TableCell>
                  <TableCell>: {data.problem_category}</TableCell>
                </TableRow> */}
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

        <div className="flex mt-5 justify-end">
          <Tooltip title="Kembali">
            <Link href="/problem" style={{ textDecoration: "none" }}>
              <Button variant="outlined" startIcon={<FirstPageIcon />}>
                Kembali
              </Button>
            </Link>
          </Tooltip>
        </div>
      </ProblemIndexProvider>
    </>
  );
}
