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
import { useState } from "react";
import { ClientIndexResponse } from "../../../types/responses/client";
import { useClientIndexContext } from "./ClientIndexProvider";
import { destroyClient, getIndexClient } from "@/app/(core)/clients/action";

export const ClientTable = () => {
  const [pagination, setPagination] = useState<{
    page: number;
    pageSize: number;
  }>({ page: 0, pageSize: 5 });
  const { permission } = useClientIndexContext();

  const fetcher = async (): Promise<ClientIndexResponse> => {
    const result = await getIndexClient(
      `pagination[current]=${pagination.page + 1}&pagination[pageSize]=${
        pagination.pageSize
      }`
    );
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.data.message);
    }
  };

  const { data, isLoading, isValidating, mutate } = useSWR<ClientIndexResponse>(
    `client_${JSON.stringify({
      ...pagination,
      page: pagination.page + 1,
    })}`,
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
          alert("Gagal menghapus client: " + result.message);
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
    setPagination({ ...pagination, page: newPage });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPagination({ pageSize: parseInt(event.target.value, 10), page: 1 });
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
        rowsPerPage={pagination.pageSize}
        page={pagination.page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};
