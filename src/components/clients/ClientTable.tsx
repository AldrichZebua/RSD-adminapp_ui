"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import useSWR from "swr";
import {
  Container,
  Tooltip,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Link,
  IconButton,
  TablePagination,
} from "@mui/material";
import NextLink from "next/link";
import { ClientIndexResponse } from "../../../types/responses/client";
import { useClientIndexContext } from "./ClientIndexProvider";
import { destroyClient, getIndexClient } from "@/app/(core)/clients/action";
import { useSearchParams } from "next/navigation";
import qs from "qs";
import { useRouter } from "@bprogress/next/app";

export const ClientTable = () => {

  const searchParams = useSearchParams();
  const { permission } = useClientIndexContext();
  const router = useRouter();

  const fetcher = async (): Promise<ClientIndexResponse> => {
    const result = await getIndexClient(searchParams.toString());
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.data.message);
    }
  };

  const { data, isLoading, isValidating, mutate } = useSWR<ClientIndexResponse>(
    `client_${searchParams.toString()}`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      keepPreviousData: true,
    }
  );

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus client ini?")) {
      try {
        const result = await destroyClient(id);
        if (result.success) {
          mutate();
        } else {
          alert("Gagal menghapus client: " + result);
        }
      } catch (error) {
        console.error("Gagal menghapus client", error);
      }
    }
  };

  if (isLoading || isValidating || data == undefined) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  const handleChangePage = (_: unknown, newPage: number) => {
    const currentParams = qs.parse(searchParams.toString());
    const newParams = {
      ...currentParams,
      pagination: { pageSize: 10, current: newPage + 1 },
    };
    router.replace(`/clients?${qs.stringify(newParams)}`);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const currentParams = qs.parse(searchParams.toString());
    const newParams ={
      ...currentParams,
      pagination: {pageSize: parseInt(event.target.value, 10), Page : 1},
    };
    router.replace(`/clients?${qs.stringify(newParams)}`)
  };

  return (
    <TableContainer
      component={Paper}
      sx={{ width: "100%", mt: 4, overflowX: "auto" }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">No</TableCell>
            <TableCell align="center">Name</TableCell>
            <TableCell align="center">Remark</TableCell>
            <TableCell align="center">Email</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Created At</TableCell>
            <TableCell align="center">Updated At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.data.map((client, index) => (
            <TableRow key={client.id}>
              <TableCell align="center">{index + 1}</TableCell>
              <TableCell align="center">
                <div className="flex justify-between items-center">
                  <div>
                    {permission.client_show ? (
                      <Link
                        component={NextLink}
                        href={`/clients/${client.id}`}
                        underline="none"
                        color="dark"
                      >
                        {client.name}
                      </Link>
                    ) : (
                      client.name
                    )}
                  </div>
                  <div className="flex gap-2">
                    {permission.client_destroy && (
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(client.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                    {permission.client_update && (
                      <Tooltip title="Edit Client">
                        <IconButton
                          color="info"
                          component={NextLink}
                          href={`/clients/${client.id}/edit`}
                        >
                          <DriveFileRenameOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell align="center">{client.remark}</TableCell>
              <TableCell align="center">
                <div
                  className="flex items-center justify-center"
                  style={{
                    flexDirection: client.emails.length > 1 ? "column" : "row",
                  }}
                >
                  {client.emails.map((email, idx) => (
                    <span key={idx} className="text-center">
                      {email}
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell align="center">{client.status_label}</TableCell>
              <TableCell align="center">{client.created_at}</TableCell>
              <TableCell align="center">{client.updated_at}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15, 25]}
        component="div"
        count={data.total || 0}
        rowsPerPage={parseInt(searchParams.get("pagination[pageSize]") ?? "10")}
        page={parseInt(searchParams.get("pagination[current]") ?? "1") - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};
