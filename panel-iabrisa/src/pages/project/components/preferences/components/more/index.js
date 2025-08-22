import React, { useState } from 'react';

import { Box, Grid } from '@mui/material';
import FlexBox from 'components/flexBox';
import MuiButton from 'components/mui/button';
import { H4, Paragraph } from 'components/typography';

import CreateMenuComponent from './create';
import EditMenuComponent from './edit';
import MenuItemComponent from './item';

export default function More(props) {
  const { project, setProject } = props;

  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [menu, setMenu] = useState(null);

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleCloseEditDialog = () => {
    setMenu(null);
    setOpenEdit(false);
  };

  return (
    <>
      {open && (
        <CreateMenuComponent
          handleCloseDialog={handleCloseDialog}
          project={project}
          setProject={setProject}
        />
      )}

      {openEdit && (
        <EditMenuComponent
          handleCloseDialog={handleCloseEditDialog}
          project={project}
          setProject={setProject}
          menu={menu}
        />
      )}

      <Box>
        <FlexBox alignItems="center" justifyContent="space-between">
          <FlexBox alignItems="center" gap={1}>
            <FlexBox
              justifyContent="center"
              alignItems="center"
              sx={{
                width: 30,
                height: 30,
                background: '#5842bc24',
                color: '#5742b9',
                borderRadius: '4px'
              }}
            >
              <i
                className="fi fi-sr-browser"
                style={{ fontSize: '14px', marginBottom: -3 }}
              />
            </FlexBox>

            <H4>Páginas externas</H4>
          </FlexBox>

          <MuiButton
            size="small"
            variant="contained"
            onClick={handleOpenDialog}
            sx={{
              height: 38,
              color: '#474747',
              background: '#f4f4f4',
              '&:hover': {
                background: '#f4f4f4'
              }
            }}
            startIcon={
              <i
                className="fi fi-br-plus"
                style={{ fontSize: '12px', marginTop: 2 }}
              />
            }
          >
            Adicionar
          </MuiButton>
        </FlexBox>

        <Box mt={2}>
          {!project.pages.more.length && (
            <FlexBox justifyContent="center" sx={{ my: 7 }}>
              <Box>
                <Paragraph color="text.disabled">
                  Nenhuma navegação cadastrada.
                </Paragraph>
              </Box>
            </FlexBox>
          )}

          <Grid container spacing={2}>
            {project.pages.more.map((item, index) => (
              <Grid item xs={12} key={index}>
                <MenuItemComponent
                  item={item}
                  project={project}
                  setProject={setProject}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </>
  );
}
