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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const {permission} = useClientIndexContext();

  const fetcher = async (): Promise<ClientIndexResponse> => {
    const result = await getIndexClient("");
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.data.message);
    }
  };

  const { data, isLoading, isValidating, mutate } = useSWR<ClientIndexResponse>(
    "Client",
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
      <Container maxWidth="lg" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Container>
    );
  }

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (

      <TableContainer component={Paper} sx={{ width: "100%", mt: 4, overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">No</TableCell>
              <TableCell align="center">Name</TableCell>
              {
                (permission.client_destroy || permission.client_update)
                &&
                <TableCell align="center">Aksi</TableCell>
              }
              <TableCell align="center">Remark</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Created At</TableCell>
              <TableCell align="center">Updated At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.data?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((client, index) => (
              <TableRow key={client.id}>
                <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                <TableCell align="center">
                  {
                    permission.client_show
                    ?
                    <Link component={NextLink} href={`/clients/${client.id}`} underline="none" color="dark">
                      {client.name}
                    </Link>
                    :
                    client.name
                  }
                  
                </TableCell>
                <TableCell align="center">
                  <div className="flex">
                  {
                    permission.client_destroy
                    &&
                      <IconButton color="error" onClick={() => handleDelete(client.id)}>
                        <DeleteIcon />
                      </IconButton>
                  }
                  {
                    permission.client_update
                    &&
                    <Tooltip title="Edit Client">
                    <IconButton color="info" component={NextLink} href={`/clients/${client.id}/edit`}>
                      <DriveFileRenameOutlineIcon />
                    </IconButton>
                  </Tooltip>
                  }
                    </div>
                </TableCell>
                <TableCell align="center">{client.remark}</TableCell>
                <TableCell align="center">
                  <div className={client.emails.length > 1 ? "flex flex-col" : "flex flex-row"}>
                    {client.emails.map((email, idx) => (
                      <span key={idx}>{email}</span>
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
          rowsPerPageOptions={[10, 15, 25]}
          component="div"
          count={data.data?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
  );
};
