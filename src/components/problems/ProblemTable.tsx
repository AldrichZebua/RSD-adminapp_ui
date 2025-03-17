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
  TableRow,
  Tooltip,
} from "@mui/material";
import NextLink from "next/link";
import { getIndexProblem, destroyProblem } from "@/app/(core)/problems/action";

export const ProblemTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { permission } = useProblemIndexContext();

  const fetcher = async (): Promise<ProblemIndexResponse> => {
    const result = await getIndexProblem("");npm 
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.data.message);
    }
  };

  const { data, isLoading, isValidating, mutate } =
    useSWR<ProblemIndexResponse>("Problem", fetcher, {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      keepPreviousData: true,
    });

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus Role ini?")) {
      try {
        const result = await destroyProblem(id);
        if (result.success) {
          mutate();
        } else {
          alert("Gagal menghapus Role");
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
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Container maxWidth="lg">
        <div>
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
                {data.data
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((problem, index) => (
                    <TableRow key={problem.id}>
                      <TableCell align="center">
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell
                        align="center"
                      >
                        <div className="flex flex-row justify-between">
                        <div className="flex justify-normal">
                          <Link
                            component={NextLink}
                            href={`/problem/${problem.id}`}
                            underline="none"
                            color="dark"
                          >
                            {problem.title}
                          </Link>
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
                                href={`/problem/${problem.id}/edit`}
                              >
                                <DriveFileRenameOutlineIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </div>
                        </div>
                      </TableCell>
                      <TableCell align="center">{problem.categoryName}</TableCell>
                      <TableCell align="center">{problem.created_at}</TableCell>
                      <TableCell align="center">{problem.updated_at}</TableCell>
                      <TableCell align="center">
                        {problem.status_label}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Container>
    </>
  );
};
