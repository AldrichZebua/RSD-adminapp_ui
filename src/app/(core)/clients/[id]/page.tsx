"use server";

import {
  Button,
  Card,
  CardContent,
  Link,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
} from "@mui/material";
import { checkPermission, getClient } from "../action";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { ClientIndexProvider } from "@/components/clients/ClientIndexProvider";
import { ClientEntity } from "../../../../../types/entities/client";

async function getData(id: string): Promise<ClientEntity | undefined> {
  const result = await getClient(id);
  return result.success ? result.data.client : undefined;
}

export default async function ClientShowPage({
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
      <ClientIndexProvider permission={permission}>
        <div className="text-3xl font-medium mb-8">Detail Client</div>
        {permission.client_update && (
          <div className="mb-5">
            <Tooltip title="Edit Client">
              <Link
                href={`/clients/${data.id}/edit`}
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
                  <TableCell className="font-medium w-40">Remark</TableCell>
                  <TableCell>: {data.remark}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium w-40">Email</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      {data.emails.map((email, index) => (
                        <span key={index}>: {email}</span>
                      ))}
                    </div>
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
            <Link href="/clients" style={{ textDecoration: "none" }}>
              <Button variant="outlined" startIcon={<FirstPageIcon />}>
                Kembali
              </Button>
            </Link>
          </Tooltip>
        </div>
      </ClientIndexProvider>
    </>
  );
}
