import React, { Fragment, useMemo, useState } from 'react';
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
import LastPageOutlinedIcon from '@mui/icons-material/LastPageOutlined';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStatsOutlined';
import {
  Box,
  Grid,
  IconButton,
  MenuItem,
  Select,
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

export default function DefaultTable(props) {
  const { data, columnShape } = props;

  const downMd = useMediaQuery(theme => theme.breakpoints.down('md'));

  const [pageSize, setPageSize] = useState(25);
  const [actualPage, setActualPage] = useState(0);

  const tableData = useMemo(() => data, [data]);
  const columns = useMemo(() => columnShape, [columnShape]);

  const tableSettings = useTable(
    {
      columns,
      data: tableData,
      initialState: { pageIndex: actualPage, pageSize }
    },
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    pageCount,
    gotoPage,
    setPageSize: setTablePageSize
  } = tableSettings;

  const selectPageSize = e => {
    setActualPage(0);
    setPageSize(Number(e.target.value));
    setTablePageSize(Number(e.target.value));
  };

  const goToPage = pageIndex => {
    setActualPage(pageIndex);
    gotoPage(pageIndex);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <ScrollBar>
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map(headerGroup => {
              const { key, ...rest } = headerGroup.getHeaderGroupProps();

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
                          mb: 5,
                          fontSize: 13,
                          fontWeight: 600,
                          color: 'text.disabled',
                          width: column.width,
                          minWidth: column.minWidth,
                          maxWidth: column.maxWidth,
                          paddingTop: '5px',
                          paddingBottom: '5px'
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

          {page.length === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <EmptyData
                    label="Sem dados encontrados."
                    icon={QueryStatsOutlinedIcon}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody {...getTableBodyProps()}>
              {page.map((row, index) => {
                prepareRow(row);
                return (
                  <TableRow
                    key={index}
                    {...row.getRowProps()}
                    sx={{
                      backgroundColor: 'background.paper'
                    }}
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
                          p: '16px'
                        }}
                      >
                        {cell.render('Cell')}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          )}
        </Table>

        <Grid container spacing={2} sx={{ mt: 2 }} alignItems="baseline">
          <Grid item xs={12} md={6}>
            <FlexBox alignItems="center">
              <Paragraph>Linhas por página:</Paragraph>
              <Box mt="-1px" ml={1}>
                <Select
                  value={pageSize}
                  onChange={selectPageSize}
                  sx={{ height: 24, '& > fieldset': { border: 'none' } }}
                >
                  {[25, 50, 100].map(pageSize => (
                    <MenuItem key={pageSize} value={pageSize}>
                      {pageSize}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </FlexBox>
          </Grid>

          <Grid item xs={12} md={6}>
            <FlexBox
              alignItems="center"
              justifyContent={downMd ? 'start' : 'end'}
            >
              <Fragment>
                <FlexBox>
                  <Paragraph>Página: {actualPage + 1}</Paragraph>
                </FlexBox>
                <FlexBox sx={{ ml: 3 }}>
                  <IconButton
                    disabled={actualPage === 0}
                    onClick={() => goToPage(0)}
                  >
                    <FirstPageIcon />
                  </IconButton>

                  <IconButton
                    onClick={() => {
                      if (actualPage > 0) {
                        goToPage(actualPage - 1);
                      }
                    }}
                    disabled={actualPage === 0}
                  >
                    <KeyboardArrowLeftIcon />
                  </IconButton>

                  <IconButton
                    disabled={actualPage >= pageCount - 1}
                    onClick={() => {
                      if (actualPage < pageCount - 1) {
                        goToPage(actualPage + 1);
                      }
                    }}
                  >
                    <KeyboardArrowRightIcon />
                  </IconButton>

                  <IconButton
                    disabled={actualPage >= pageCount - 1}
                    onClick={() => goToPage(pageCount - 1)}
                  >
                    <LastPageOutlinedIcon />
                  </IconButton>
                </FlexBox>
              </Fragment>
            </FlexBox>
          </Grid>
        </Grid>
      </ScrollBar>
    </Box>
  );
}
