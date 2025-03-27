import { checkPermission, getRole } from "../action";
import {
  Box,
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
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import {
  RoleDetailEntity,
  RoleEntity,
} from "../../../../../types/entities/roles";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { RoleIndexProvider } from "@/components/roles/RoleIndexProvider";
import { RoleSections } from "@/components/roles/lib/role_section";
import { pagePermissionCheck } from "@/lib/safePageRequest";

const breadcrumbItems = (data: RoleEntity) => [
  { title: `Roles`, url: "/roles" },
  { title: `Detail - ${data.name}`, url: `/roles/${data.id}` },
];

async function getData(id: string): Promise<RoleDetailEntity | undefined> {
  const result = await getRole(id);
  return result.success ? result.data.role : undefined;
}

export default async function RoleShowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const data = await getData((await params).id);
  const permission = await checkPermission();

  if (!data) {
    return <h1>Error fetching data...</h1>;
  }

  await pagePermissionCheck<RoleSections>("role_show");

  return (
    <>
      <RoleIndexProvider permission={permission}>
        <div className="flex flex-row gap-2 items-center">
          <Link href="/roles">
            <IconButton color="primary" aria-label="kembali">
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <BreadcrumbCustom items={breadcrumbItems(data)} />
        </div>
        <Box
          sx={{
            backgroundColor: "white",
            border: "1px solid #ccc",
            boxShadow: 1,
            borderRadius: 1,
            padding: 3,
            width: "100%",
            textAlign: "left",
            paddingX: 3,
            paddingY: 1,
            height: "60px",
            mb: 3,
          }}
        >
          <Typography
            sx={{ fontSize: "30px", fontWeight: "bold" }}
            color="text.primary"
          >
            Detail Hak Akses
          </Typography>
        </Box>
        {permission.role_update && (
          <Tooltip title="Edit Hak Akses">
            <Button
              href={`/roles/${data.id}/edit`}
              color="primary"
              startIcon={<DriveFileRenameOutlineIcon />}
            >
              Edit
            </Button>
          </Tooltip>
        )}

        <Card>
          <CardContent className="flex p-0 flex-col gap-3">
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
                    {" "}
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
                    {" "}
                    Description
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
                    {" "}
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
                    {" "}
                    Last update at
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
                    Section
                  </TableCell>
                  <TableCell sx={{ width: "70%" }}>
                    <div className="flex">
                      <div className="flex flex-col ml-1 font-medium text-base">
                        {data.rule_set.map((rule: string) => {
                          return <label key={rule}>{rule}</label>;
                        })}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* <div className="flex mt-5 justify-end">
        <Tooltip title="Kembali">
          <Link href="/roles" style={{ textDecoration: "none" }}>
            <Button variant="outlined" startIcon={<FirstPageIcon />}>
              Kembali
            </Button>
          </Link>
        </Tooltip>
      </div> */}
      </RoleIndexProvider>
    </>
  );
}
