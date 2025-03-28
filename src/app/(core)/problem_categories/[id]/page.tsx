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
import { checkPermission, getProblemCategory } from "../action";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { ProblemCategoryIndexProvider } from "@/components/problem_categories/ProblemCategoryIndexProvider";
import { ProblemCategoryEntity } from "../../../../../types/entities/problem_category";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { pagePermissionCheck } from "@/lib/safePageRequest";
import { ProblemCategorySections } from "@/components/problem_categories/lib/problem_category_section";

const breadcrumbItems = (data: ProblemCategoryEntity) => [
  { title: `Problem Categories`, url: "/problem_categories" },
  { title: `Detail - ${data.name}`, url: `/problem_categories/${data.id}` },
];

async function getData(id: string): Promise<ProblemCategoryEntity | undefined> {
  const result = await getProblemCategory(id);
  return result.success ? result.data.problem_category : undefined;
}

export default async function ProblemCategoryShowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await pagePermissionCheck<ProblemCategorySections>("problem_category_show");
  const permission = await checkPermission();
  const data = await getData((await params).id);

  if (!data) {
    return <h1>Error fetching data...</h1>;
  }

  await pagePermissionCheck<ProblemCategorySections>("problem_category_show");

  return (
    <>
      <ProblemCategoryIndexProvider permission={permission}>
        <div className="flex flex-row gap-2 items-center">
          <Link href="/problem_categories">
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
            Detail Program Category
          </Typography>

          <Divider orientation="vertical" variant="middle" flexItem />

          {permission.problem_category_update && (
            <Tooltip title="Edit Problem Category">
              <Button
                href={`/problem_categories/${data.id}/edit`}
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
            mt: 3,
            width: "100%",
            border: 1,
            borderColor: "grey.300",
            borderRadius: 1,
            overflowX: "auto",
          }}
        >
          <CardContent className="p-0">
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
                    Name
                  </TableCell>
                  <TableCell sx={{ width: "70%" }}>{data.name}</TableCell>
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
                  <TableCell
                    sx={{
                      borderRight: 1,
                      borderColor: "grey.300",
                      width: "20%",
                      fontWeight: "bold",
                    }}
                  >
                    Created at
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
                    Last update at
                  </TableCell>
                  <TableCell sx={{ width: "70%" }}>{data.updated_at}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </ProblemCategoryIndexProvider>
    </>
  );
}
