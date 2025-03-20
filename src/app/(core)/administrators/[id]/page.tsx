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
import { checkPermission, getAdministrator } from "../action";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { AdministratorsShowResponse } from "../../../../../types/responses/administrators";
import { AdministratorIndexProvider } from "@/components/administrator/AdministratorIndexProvider";
import { Role } from "../../../../../types/entities/roles";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";
import { AdministratorEntity } from "../../../../../types/entities/administrators";

const breadcrumbItems = (data: AdministratorEntity) => [
  { title: `Administrators`, url: '/administrators' },
  { title: `Detail - ${data.username}`, url: `/administrators/${data.id}` },
];


async function getData(
  id: string
): Promise<AdministratorsShowResponse | undefined> {
  const result = await getAdministrator(id);
  return result.success ? result.data : undefined;
}

const AdministratorShowPage = async ({ params } : { params: Promise<{ id: string }> }) => {
  const data = await getData((await params).id);
  const permission = await checkPermission();


  if (!data) {
    return <h1>Error fetching data...</h1>;
  }

  return (
    <>
      <AdministratorIndexProvider permission={permission}>
        <div className="flex gap-2 items-center mb-2">
          <Link href="/administrators">
            <IconButton color="primary" aria-label="kembali">
              <ArrowBackIcon/>
            </IconButton>
          </Link>
          <BreadcrumbCustom items={breadcrumbItems(data.administrator)} />
        </div>
        <div className="text-3xl font-medium mb-8">Detail Administrator</div>
        {permission.administrator_update && (
          <div className="mb-5">
            <Tooltip title="Edit Administrator">
              <Link
                href={`/administrators/${data.administrator.id}/edit`}
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
                  <TableCell className="font-medium w-40">
                    Administrator
                  </TableCell>
                  <TableCell>: {data.administrator.username}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium w-40">Email</TableCell>
                  <TableCell>: {data.administrator.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium w-40">Created at</TableCell>
                  <TableCell>: {data.administrator.created_at}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium w-40">
                    Last update at
                  </TableCell>
                  <TableCell>: {data.administrator.updated_at}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium w-40">Hak Akses</TableCell>
                  <TableCell>
                    {data.roles.map((role: Role) => (
                      <div key={role.id} className="block">
                        : {role.name}
                      </div>
                    ))}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* <div className="flex mt-5 justify-end">
          <Tooltip title="Kembali">
            <Link
              href="/administrators"
              style={{ textDecoration: "none" }}
            >
              <Button variant="outlined" startIcon={<FirstPageIcon />}>
                Kembali
              </Button>
            </Link>
          </Tooltip>
        </div> */}
      </AdministratorIndexProvider>
    </>
  );
}
export default AdministratorShowPage;