import React, { Fragment, useEffect, useState } from 'react';

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  Skeleton
} from '@mui/material';
import FlexBox from 'components/flexBox';
import MuiSearch from 'components/mui/search';
import PaginationTable from 'components/table/pagination';
import { Paragraph, Span } from 'components/typography';
import Api from 'config/api';
import useAuth from 'hooks/useAuth';

import EditDialog from './components/editDialog';

export default function Users({ project }) {
  const { user } = useAuth();

  const [editUser, setEditUser] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [queryHistory, setQueryHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [backPage, setBackPage] = useState(false);
  const [loadingTable, setLoadingTable] = useState(true);
  const [filterQueries] = useState({ queries: [] });

  const [users, setUsers] = useState({
    list: [],
    lastId: null,
    nextPage: false
  });

  useEffect(() => {
    const body = document.body;
    body.style.overflow = 'scroll';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (user) {
      getUsers();
    }
  }, [user, pageSize, currentPage]);

  const getUsers = async () => {
    filterQueries.queries.push({
      filterKey: 'projectId',
      type: '==',
      value: user?.project?.id
    });

    let queryLastId = '';

    if (currentPage > 1) {
      queryLastId = `&lastId=${users.lastId}`;
    }

    let url = `/users/list?pageSize=${pageSize}&orderBy=createdAt${queryLastId}`;

    if (!backPage) {
      setQueryHistory([...queryHistory, url]);
    }

    if (backPage) {
      url = queryHistory[queryHistory.length - 1];
    }

    try {
      const { data } = await Api.post(url, { queries: filterQueries.queries });
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setLoadingTable(false);
    }
  };

  const handlePageSize = pageSize => {
    setLoading(true);
    setPageSize(pageSize);
    setQueryHistory([]);
  };

  const handlePage = type => {
    setLoading(true);

    if (type === 'next') {
      setCurrentPage(currentPage + 1);
    }

    if (type === 'back') {
      const newQueryList = queryHistory;
      newQueryList.pop();
      setQueryHistory(newQueryList);
      setCurrentPage(currentPage - 1);
      setBackPage(true);
    }

    if (type === 'first') {
      setCurrentPage(1);
    }

    setLoadingTable(true);
  };

  const clearFilters = () => {
    filterQueries.queries = [];
    setCurrentPage(1);

    setLoadingTable(true);
    getUsers();
  };

  const searchUsers = value => {
    filterQueries.queries = [];

    if (value) {
      filterQueries.queries.push({
        filterKey: project?.pages?.login?.field,
        type: '>=',
        value
      });

      filterQueries.queries.push({
        filterKey: project?.pages?.login?.field,
        type: '<=',
        value: value + '\uf8ff'
      });
    }

    setLoadingTable(true);
    getUsers();
  };

  return (
    <Box>
      {!loading ? (
        <Fragment>
          {editUser && (
            <EditDialog
              onClose={() => setEditUser(undefined)}
              project={project}
              user={editUser}
              users={users}
              setUsers={setUsers}
            />
          )}

          <Card>
            <CardContent>
              <FlexBox sx={{ mb: 5 }} justifyContent="space-between">
                <MuiSearch
                  width="30%"
                  clean={clearFilters}
                  search={searchUsers}
                  disabled={loadingTable}
                />
              </FlexBox>

              <PaginationTable
                data={users}
                currentPage={currentPage}
                pageSize={pageSize}
                handlePageSize={handlePageSize}
                handlePage={handlePage}
                loadingTable={loadingTable}
                columnShape={[
                  {
                    Header: '	Criado em',
                    accessor: 'createdAt',
                    maxWidth: 100,
                    Cell: ({ value }) => new Date(value).toLocaleDateString()
                  },
                  {
                    minWidth: 250,
                    Header: 'Contato',
                    Cell: ({ row }) => (
                      <Box
                        sx={{
                          whiteSpace: 'normal',
                          overflow: 'hidden',
                          width: 210,
                          textOverflow: 'ellipsis'
                        }}
                      >
                        <Span>{row.original.email || row.original.phone}</Span>
                        <Paragraph
                          sx={{
                            mt: 0.2,
                            fontSize: '10px',
                            background: '#0000001a',
                            width: 'fit-content',
                            borderRadius: '4px',
                            padding: '2px 6px'
                          }}
                        >
                          ID:{' '}
                          {row.original.stakbroker?.userId
                            ? '...' + row.original.stakbroker?.userId.slice(-5)
                            : ''}
                        </Paragraph>
                      </Box>
                    )
                  },
                  {
                    Header: 'Plano',
                    accessor: 'signature',
                    Cell: ({ value }) => (
                      <Span
                        fontWeight={600}
                        color={value === 'free' ? '#5564f8' : '#ffaa00'}
                      >
                        {user?.project?.plans[value].name}
                      </Span>
                    )
                  },
                  {
                    Header: 'Status',
                    accessor: 'actived',
                    Cell: ({ value }) => (
                      <Chip
                        label={value ? 'Ativo' : 'Inativo'}
                        size="small"
                        color={value ? 'success' : 'error'}
                        sx={{
                          height: 18,
                          fontSize: 11,
                          '& > .MuiChip-label ': { pt: 0.1, color: '#fff' }
                        }}
                      />
                    )
                  },
                  {
                    Header: 'Ações',
                    accessor: 'Action',
                    maxWidth: 70,

                    Cell: ({ row }) => (
                      <FlexBox justifyContent="center">
                        <IconButton onClick={() => setEditUser(row.original)}>
                          <i
                            className="fi fi-rr-user-pen"
                            style={{ fontSize: '16px', color: '#000' }}
                          />
                        </IconButton>
                      </FlexBox>
                    )
                  }
                ]}
              />
            </CardContent>
          </Card>
        </Fragment>
      ) : (
        <Card sx={{ height: 240 }}>
          <CardHeader
            title={<Skeleton variant="text" width="20%" animation="wave" />}
          />
          <CardContent>
            <Skeleton variant="text" width="50%" animation="wave" />
            <Skeleton variant="text" width="45%" animation="wave" />
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
