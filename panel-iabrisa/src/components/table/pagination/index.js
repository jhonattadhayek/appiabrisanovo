import React, { Fragment, useEffect, useMemo } from 'react';
import {
  useExpanded,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable
} from 'react-table';

import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
  Box,
  CircularProgress,
  IconButton,
  MenuItem,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useMediaQuery
} from '@mui/material';
import EmptyData from 'components/emptyData';
import FlexBox from 'components/flexBox';
import { Paragraph } from 'components/typography';
import ScrollBar from 'simplebar-react';

export default function PaginationTable({
  data,
  columnShape,
  currentPage,
  loadingTable,
  loadingPage,
  pageSize,
  handlePage,
  handlePageSize,
  currentTab = true,
  maxPage = 0
}) {
  const downSm = useMediaQuery(theme => theme.breakpoints.down('sm'));

  const tableData = useMemo(() => data?.list, [data?.list]);
  const columns = useMemo(() => columnShape, [columnShape]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    setPageSize
  } = useTable(
    { columns, data: tableData },
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );

  useEffect(() => {
    setPageSize(Number(pageSize));
  }, [pageSize]);

  return (
    <Box sx={{ width: '100%' }}>
      <ScrollBar>
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup, index) => {
              const { key, ...rest } = headerGroup.getHeaderGroupProps({
                index
              });

              return (
                <TableRow key={key} {...rest}>
                  {headerGroup.headers.map((column, index) => {
                    const { key, ...rest } = column.getHeaderProps(
                      column.getSortByToggleProps()
                    );

                    return (
                      <TableCell
                        key={key}
                        {...rest}
                        column={column}
                        sx={{
                          paddingY: 0,
                          fontSize: 14,
                          fontWeight: 600,
                          color: '#232833',
                          width: column.width,
                          minWidth: column.minWidth,
                          maxWidth: column.maxWidth,
                          paddingBottom: '12px',
                          borderBottom: '1px solid #e5eaf2',
                          fontFamily:
                            "Open Sans,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol' !important",
                          '&:last-child': {
                            textAlign: 'center'
                          }
                        }}
                      >
                        {column.render('Header')}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableHead>

          {loadingTable ? (
            <TableBody {...getTableBodyProps()}>
              {page.map((row, index) => {
                return (
                  <Fragment key={index}>
                    {prepareRow(row)}

                    <TableRow
                      {...row.getRowProps()}
                      sx={{ backgroundColor: 'background.paper' }}
                    >
                      {row.cells.map((cell, index) => (
                        <TableCell
                          key={index}
                          {...cell.getCellProps()}
                          sx={{
                            fontSize: '13px',
                            fontWeight: '500px',
                            color: '#ffffffdb',
                            borderBottom: '1px solid #ffffff26',
                            fontFamily:
                              "Open Sans,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol' !important",

                            p: '16px'
                          }}
                        >
                          <Skeleton />
                        </TableCell>
                      ))}
                    </TableRow>
                  </Fragment>
                );
              })}
            </TableBody>
          ) : page.length === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={columns.length} sx={{ color: 'black' }}>
                  <EmptyData label="Sem dados encontrados." />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody {...getTableBodyProps()}>
              {page.map(row => {
                prepareRow(row);
                const { key, ...props } = row.getRowProps();

                return (
                  <TableRow
                    key={key}
                    {...props}
                    sx={{ backgroundColor: 'background.paper' }}
                  >
                    {row.cells.map(cell => {
                      const { key, ...props } = cell.getCellProps();

                      return (
                        <TableCell
                          key={key}
                          {...props}
                          sx={{
                            fontSize: '14px',
                            fontWeight: '500px',
                            color: theme => theme.palette.text.primary,
                            borderBottom: '1px solid #ffffff26',
                            p: '16px',
                            fontFamily:
                              "Open Sans,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol' !important"
                          }}
                        >
                          {cell.render('Cell')}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          )}
        </Table>
      </ScrollBar>

      <FlexBox
        sx={{ mt: 2 }}
        flexDirection={downSm ? 'column' : 'row'}
        alignItems={downSm ? 'stretch' : 'center'}
        justifyContent="space-between"
      >
        <FlexBox justifyContent="space-between" gap={0.5}>
          <Box>
            <Paragraph>Linhas por página:</Paragraph>
          </Box>

          <FlexBox>
            <Select
              disabled={loadingTable}
              value={pageSize}
              onChange={e => handlePageSize(e.target.value)}
              sx={{ height: 20, '& > fieldset': { border: 'none' } }}
            >
              {[25, 50, 100].map(pageSize => (
                <MenuItem key={pageSize} value={pageSize}>
                  {pageSize}
                </MenuItem>
              ))}
            </Select>
          </FlexBox>
        </FlexBox>

        <FlexBox justifyContent="space-between" alignItems="center">
          <FlexBox alignItems="center">
            <Paragraph sx={{ mr: 0.8 }}>Página: </Paragraph>
            {!loadingPage ? (
              <Paragraph>{currentPage}</Paragraph>
            ) : (
              <CircularProgress sx={{ mb: '-3px' }} size="14px" />
            )}
          </FlexBox>

          <FlexBox>
            <IconButton
              disabled={currentPage === 1 || loadingTable || loadingPage}
              onClick={() => handlePage('first')}
            >
              <FirstPageIcon />
            </IconButton>

            <IconButton
              onClick={() => handlePage('back')}
              disabled={currentPage === 1 || loadingTable || loadingPage}
            >
              <KeyboardArrowLeftIcon />
            </IconButton>

            <IconButton
              disabled={
                !data.nextPage ||
                loadingTable ||
                loadingPage ||
                maxPage[currentTab] === currentPage
              }
              onClick={() => handlePage('next')}
            >
              <KeyboardArrowRightIcon />
            </IconButton>
          </FlexBox>
        </FlexBox>
      </FlexBox>
    </Box>
  );
}
