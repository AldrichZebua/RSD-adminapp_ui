import { ProblemIndexProvider } from "@/components/problems/ProblemIndexProvider";
import { checkPermission, getProblem } from "../action";
import {
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { ProblemEntity } from "../../../../../types/entities/problem";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ProblemSections } from "@/components/problems/lib/problem_section";
import { pagePermissionCheck } from "@/lib/safePageRequest";

const breadcrumbItems = (data: ProblemEntity) => [
  { title: `Problem`, url: "/problems" },
  { title: `Detail - ${data.title}`, url: `/problems/${data.id}` },
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
  await pagePermissionCheck<ProblemSections>("problem_show");
  const data = await getData((await params).id);
  const permission = await checkPermission();

  if (!data) {
    return <h1>Error fetching data...</h1>;
  }

  return (
    <>
      <ProblemIndexProvider permission={permission}>
        <div className="flex gap-2 items-center">
          <Link href="/problems">
            <IconButton color="primary" aria-label="kembali">
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <BreadcrumbCustom items={breadcrumbItems(data)} />
        </div>
        <div className="flex gap-3 items-center">
          <Typography
            sx={{
              fontSize: { xs: "20px", sm: "25px", md: "30px" },
            }}
            color="text.primary"
          >
            Detail Problem
          </Typography>

          <Divider orientation="vertical" variant="middle" flexItem />

          {permission.problem_update && (
            <Tooltip title="Edit Client">
              <Button
                href={`/problems/${data.id}/edit`}
                color="primary"
                startIcon={<DriveFileRenameOutlineIcon />}
              >
                Edit
              </Button>
            </Tooltip>
          )}
        </div>
        <Card
          component={Paper}
          sx={{
            mt: 4,
            width: "100%",
            border: 1,
            borderColor: "grey.300",
            borderRadius: 1,
            overflowX: "auto",
          }}
        >
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell
                    sx={{
                      borderRight: 1,
                      borderColor: "grey.300",
                      width: "20%",
                      fontWeight: "bold",
                    }}
                  >
                    Topik
                  </TableCell>
                  <TableCell sx={{ width: "70%" }}>{data.title}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      borderRight: 1,
                      borderColor: "grey.300",
                      width: "20%",
                      fontWeight: "bold",
                    }}
                  >
                    Detail
                  </TableCell>
                  <TableCell sx={{ width: "70%" }}>
                    {data.description}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      borderRight: 1,
                      borderColor: "grey.300",
                      width: "20%",
                      fontWeight: "bold",
                    }}
                  >
                    Category
                  </TableCell>
                  <TableCell sx={{ width: "70%" }}>
                    {data?.problem_category?.name}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      borderRight: 1,
                      borderColor: "grey.300",
                      width: "20%",
                      fontWeight: "bold",
                    }}
                  >
                    Create at
                  </TableCell>
                  <TableCell sx={{ width: "70%" }}>{data.created_at}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      borderRight: 1,
                      borderColor: "grey.300",
                      width: "20%",
                      fontWeight: "bold",
                    }}
                  >
                    Update at
                  </TableCell>
                  <TableCell sx={{ width: "70%" }}>{data.updated_at}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      borderRight: 1,
                      borderColor: "grey.300",
                      width: "20%",
                      fontWeight: "bold",
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell sx={{ width: "70%" }}>
                    {data.status_label}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        ]{" "}
      </ProblemIndexProvider>
    </>
  );
}
