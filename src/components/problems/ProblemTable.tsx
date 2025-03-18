"use client";

import { useState } from "react";
import { useProblemIndexContext } from "./ProblemIndexProvider";
import { ProblemIndexResponse } from "../../../types/responses/problem";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteIcon from "@mui/icons-material/Delete";
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
import { getIndexProblem, destroyProblem } from "@/app/(core)/problems/action";

export const ProblemTable = () => {
  const [pagination, setPagination] = useState<{
    page: number;
    pageSize: number;
  }>({ page: 0, pageSize: 5 });
  const { permission } = useProblemIndexContext();

  const fetcher = async (): Promise<ProblemIndexResponse> => {
    const result = await getIndexProblem(
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

  const { data, isLoading, isValidating, mutate } =
    useSWR<ProblemIndexResponse>(
      `problems_${JSON.stringify({
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
    if (confirm("Apakah Anda yakin ingin menghapus Role ini?")) {
      try {
        const result = await destroyProblem(id);
        if (result.success) {
          mutate();
        } else {
          alert("Gagal menghapus Role" + result.message);
        }
      } catch (error) {
        console.error("Gagal menghapus Role", error);
      }
    }
  };

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
    setPagination({ ...pagination, page: newPage });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPagination({ pageSize: parseInt(event.target.value, 10), page: 1 });
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ width: "100%", mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">No</TableCell>
              <TableCell align="center">Title</TableCell>
              {/* <TableCell align="center">Problem Category</TableCell> */}
              <TableCell align="center">Create At</TableCell>
              <TableCell align="center">Update At</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.data.map((problem, index) => (
              <TableRow key={problem.id}>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">
                  <div className="flex flex-row justify-between">
                    <div className="flex justify-normal">
                      {permission.problem_show ? (
                        <Link
                          component={NextLink}
                          href={`/problems/${problem.id}`}
                          underline="none"
                          color="dark"
                        >
                          {problem.title}
                        </Link>
                      ) : (
                        problem.title
                      )}
                    </div>
                    <div className="flex flex-row">
                      {permission.problem_destroy && (
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(problem.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                      {permission.problem_update && (
                        <Tooltip title="Edit Administrator">
                          <IconButton
                            color="info"
                            component={NextLink}
                            href={`/problems/${problem.id}/edit`}
                          >
                            <DriveFileRenameOutlineIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell align="center">
                  {problem.problem_category?.name}
                </TableCell>
                <TableCell align="center">{problem.created_at}</TableCell>
                <TableCell align="center">{problem.updated_at}</TableCell>
                <TableCell align="center">
                  <Typography
                    sx={{
                      color:
                        problem.status_label === "ACTIVE" ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {problem.status_label}{" "}
                  </Typography>
                </TableCell>
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
    </>
  );
};
