"use server";

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
  Typography,
} from "@mui/material";
import { checkPermission, getProblemCategory } from "../action";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { ProblemCategoryIndexProvider } from "@/components/problem_categories/ProblemCategoryIndexProvider";
import { ProblemCategoryEntity } from "../../../../../types/entities/problem_category";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const breadcrumbItems = (data: ProblemCategoryEntity) => [
  { title: `Problem Categories`, url: '/problem_categories' },
  { title: `Detail - ${data.name}`, url: `/problem_categories/${data.id}` },
];

async function getData(id: string): Promise<ProblemCategoryEntity | undefined> {
  const result = await getProblemCategory(id);
  return result.success ? result.data.problem_category : undefined;
}

export default async function ProblemCategoryShowPage({
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
      <ProblemCategoryIndexProvider permission={permission}>
      <div className="flex gap-2 items-center mb-2">
          <Link href="/problem_categories">
            <IconButton color="primary" aria-label="kembali">
              <ArrowBackIcon/>
            </IconButton>
          </Link>
          <BreadcrumbCustom items={breadcrumbItems(data)} />
        </div>
        <div className="text-3xl font-medium mb-8">Detail Client</div>
        {permission.problemCategory_update && (
          <div className="mb-5">
            <Tooltip title="Edit Problem Category">
              <Link
                href={`/problem_categories/${data.id}/edit`}
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
                  <TableCell className="font-medium w-40">Name</TableCell>
                  <TableCell>: {data.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium w-40">Status</TableCell>
                  <TableCell>
                    :{" "}
                    <Typography
                      component="span"
                      sx={{
                        color: data.status_label === "ACTIVE" ? "green" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {data.status_label}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium w-40">Created at</TableCell>
                  <TableCell>: {data.created_at}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium w-40">
                    Last update at
                  </TableCell>
                  <TableCell>: {data.updated_at}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="flex mt-5 justify-end">
          <Tooltip title="Kembali">
            <Link href="/problem_categories" style={{ textDecoration: "none" }}>
              <Button variant="outlined" startIcon={<FirstPageIcon />}>
                Kembali
              </Button>
            </Link>
          </Tooltip>
        </div>
      </ProblemCategoryIndexProvider>
    </>
  );
}
