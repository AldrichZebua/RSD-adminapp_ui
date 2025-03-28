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
import { checkPermission, getAdministrator } from "../action";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { AdministratorsShowResponse } from "../../../../../types/responses/administrators";
import { AdministratorIndexProvider } from "@/components/administrator/AdministratorIndexProvider";
import { Role } from "../../../../../types/entities/roles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";
import { AdministratorEntity } from "../../../../../types/entities/administrators";
import { pagePermissionCheck } from "@/lib/safePageRequest";
import { AdministratorSections } from "@/components/administrator/lib/administrators_section";

const breadcrumbItems = (data: AdministratorEntity) => [
  { title: `Administrators`, url: "/administrators" },
  { title: `Detail - ${data.username}`, url: `/administrators/${data.id}` },
];

async function getData(
  id: string
): Promise<AdministratorsShowResponse | undefined> {
  const result = await getAdministrator(id);
  return result.success ? result.data : undefined;
}

const AdministratorShowPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  await pagePermissionCheck<AdministratorSections>("administrator_show");
  const data = await getData((await params).id);
  const permission = await checkPermission();

  if (!data) {
    return <h1>Error fetching data...</h1>;
  }

  return (
    <>
      <AdministratorIndexProvider permission={permission}>
        <div className="flex flex-row gap-2 items-center">
          <Link href="/administrators">
            <IconButton color="primary" aria-label="kembali">
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <BreadcrumbCustom items={breadcrumbItems(data.administrator)} />
        </div>
        <div className="flex gap-3 items-center">
          <Typography
            sx={{
              fontSize: { xs: "20px", sm: "25px", md: "30px" },
            }}
            color="text.primary"
          >
            Detail Administrator
          </Typography>

          <Divider orientation="vertical" variant="middle" flexItem />

          {permission.administrator_update && (
            <Tooltip title="Edit Administrator">
              <Button
                href={`/administrators/${data.administrator.id}/edit`}
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
            width: "100%",
            border: 1,
            borderColor: "grey.300",
            borderRadius: 1,
            overflowX: "auto",
            mt: 2,
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
                    Username
                  </TableCell>
                  <TableCell sx={{ width: "70%" }}>
                    {data.administrator.username}
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
                    Email
                  </TableCell>
                  <TableCell sx={{ width: "70%" }}>
                    {data.administrator.email}
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
                    Hak Akses
                  </TableCell>
                  <TableCell sx={{ width: "70%" }}>
                    {data.roles.map((role: Role) => (
                      <div key={role.id} className="block">
                        {role.name}
                      </div>
                    ))}
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
                  <TableCell sx={{ width: "70%" }}>
                    {data.administrator.created_at}
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
                    Last update at
                  </TableCell>
                  <TableCell sx={{ width: "70%" }}>
                    {data.administrator.updated_at}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </AdministratorIndexProvider>
    </>
  );
};
export default AdministratorShowPage;
