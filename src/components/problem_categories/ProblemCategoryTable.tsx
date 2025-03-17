"use client";

import { ChangeEvent, useState } from "react";
import { useProblemCategoryIndexContext } from "./ProblemCategoryIndexProvider";
import { ProblemCategoryIndexResponse } from "../../../types/responses/problem_category";
import {
  destroyProblemCategory,
  getIndexProblemCategory,
} from "@/app/(core)/problem_categories/action";
import useSWR from "swr";
import {
  CircularProgress,
  Container,
  IconButton,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";

export const ProblemCategoryTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { permission } = useProblemCategoryIndexContext();

  const fetcher = async (): Promise<ProblemCategoryIndexResponse> => {
    const result = await getIndexProblemCategory("");
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.data.message);
    }
  };

  const { data, isLoading, isValidating, error, mutate } =
    useSWR<ProblemCategoryIndexResponse>("Problem_Category", fetcher, {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      keepPreviousData: true,
    });

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus client ini?")) {
      try {
        const result = await destroyProblemCategory(id);
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

  if (error) {
    return (
      <Container
        maxWidth="lg"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <span>{error.message}</span>
      </Container>
    );
  }

  if (isLoading || isValidating || data == undefined) {
    return (
      <Container
        maxWidth="lg"
        style={{
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
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer
      component={Paper}
      sx={{ width: "100%", mt: 4, overflowX: "auto" }}
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell align="center">No</TableCell>
            <TableCell align="center">Name</TableCell>
            <TableCell align="center">Created At</TableCell>
            <TableCell align="center">Updated At</TableCell>
            <TableCell align="center">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.data
            ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((problem_category, index) => (
              <TableRow key={problem_category.id}>
                <TableCell align="center">
                  {page * rowsPerPage + index + 1}
                </TableCell>
                <TableCell align="center">
                  <div className="flex justify-between items-center">
                    <div>
                      {permission.problemCategory_show ? (
                        <Link
                          component={NextLink}
                          href={`/problem_categories/${problem_category.id}`}
                          underline="none"
                          color="primary"
                        >
                          {problem_category.name}
                        </Link>
                      ) : (
                        problem_category.name
                      )}
                    </div>
                    <div className="flex gap-2">
                      {permission.problemCategory_destroy && (
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(problem_category.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                      {permission.problemCategory_update && (
                        <Tooltip title="Edit Problem Categories">
                          <IconButton
                            color="info"
                            component={NextLink}
                            href={`/problem_categories/${problem_category.id}/edit`}
                          >
                            <DriveFileRenameOutlineIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell align="center">
                  {problem_category.created_at}
                </TableCell>
                <TableCell align="center">
                  {problem_category.updated_at}
                </TableCell>
                <TableCell align="center">
                  <Typography
                    sx={{
                      color:
                        problem_category.status_label === "ACTIVE"
                          ? "green"
                          : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {problem_category.status_label}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15, 25]}
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
