"use server";

import { checkPermission, getRole } from "../action";
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
import FirstPageIcon from "@mui/icons-material/FirstPage";
import {
  RoleDetailEntity,
  RoleEntity,
} from "../../../../../types/entities/roles";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { RoleIndexProvider } from "@/components/roles/RoleIndexProvider";


const breadcrumbItems = (data: RoleEntity) => [
  { title: `Roles`, url: "/roles" },
  { title: `Detail - ${data.name}`, url: `/roles/${data.id}` },
];

async function getData(id: string): Promise<RoleDetailEntity | undefined> {
  const result = await getRole(id);
  return result.success ? result.data.role : undefined;
}

const permission = await checkPermission();

const RoleShowPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const data = await getData((await params).id);

  if (!data) {
    return <h1>Error fetching data...</h1>;
  }

  return (
    <>
    <RoleIndexProvider permission={permission}>
      <div className="flex gap-2 items-center mb-2">
        <Link href="/roles">
          <IconButton color="primary" aria-label="kembali">
            <ArrowBackIcon />
          </IconButton>
        </Link>
        <BreadcrumbCustom items={breadcrumbItems(data)} />
      </div>
      <div className="text-3xl font-medium mb-8">Detail Hak Akses</div>
      {permission.role_update && (
      <div className="mb-5">
        <Tooltip title="Edit Hak Akses">
          <Link
            href={`/roles/${data.id}/edit`}
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
        <CardContent className="flex p-0 flex-col gap-3">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium w-40 text-base">
                  Name
                </TableCell>
                <TableCell className="font-medium w-40 text-base">
                  : {data.name}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-base">
                  Description
                </TableCell>
                <TableCell>: {data.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-base">
                  Created at
                </TableCell>
                <TableCell className="font-medium w-40 text-base">
                  : {data.created_at}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-base">
                  Last update at
                </TableCell>
                <TableCell className="font-medium w-40 text-base">
                  : {data.updated_at}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  className="font-medium text-base"
                  style={{ verticalAlign: "top" }}
                >
                  Section
                </TableCell>
                <TableCell>
                  <div className="flex">
                    {" "}
                    :
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

      <div className="flex mt-5 justify-end">
        <Tooltip title="Kembali">
          <Link href="/roles" style={{ textDecoration: "none" }}>
            <Button variant="outlined" startIcon={<FirstPageIcon />}>
              Kembali
            </Button>
          </Link>
        </Tooltip>
      </div>
      </RoleIndexProvider>
    </>
  );
};

export default RoleShowPage;
