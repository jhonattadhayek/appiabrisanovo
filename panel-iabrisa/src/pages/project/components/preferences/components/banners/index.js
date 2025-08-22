import React from 'react';
import { toast } from 'react-toastify';

import { Box, Grid, IconButton } from '@mui/material';
import FlexBox from 'components/flexBox';
import MuiButton from 'components/mui/button';
import { H4, Paragraph } from 'components/typography';
import Api from 'config/api';
import useAuth from 'hooks/useAuth';
import Swal from 'sweetalert2';

export default function Banners({ project, setProject, setOpenDialog }) {
  const { setUser } = useAuth();

  const action = ({ title, text, image, isDelete }) => {
    Swal.fire({
      title,
      text,
      showCancelButton: true,
      confirmButtonColor: '#5742b9',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        remove(image, isDelete);
      }
    });
  };

  const remove = async (image, isDelete) => {
    try {
      const body = {
        image,
        token: project.token
      };

      const path = `/projects/banners/${project.id}?delete=${isDelete}`;
      const { data } = await Api.patch(path, body);

      setProject(data.project);
      setUser({ project: data.project });

      toast.success('Banner removido com sucesso');
    } catch (err) {
      toast.error(err.message);
      console.error(err.message || err);
    }
  };

  return (
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
              className="fi fi-sr-copy-image"
              style={{ fontSize: '14px', marginBottom: -3 }}
            />
          </FlexBox>

          <H4>Banners</H4>
        </FlexBox>

        <MuiButton
          size="small"
          variant="contained"
          onClick={() => setOpenDialog(true)}
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

      <Box mt={3}>
        {!project.pages.home.banners.length && (
          <FlexBox justifyContent="center" sx={{ my: 7 }}>
            <Box>
              <Paragraph color="text.disabled">
                Nenhum banner cadastrado.
              </Paragraph>
            </Box>
          </FlexBox>
        )}

        <Grid container spacing={2}>
          {project.pages.home.banners.map((banner, index) => {
            return (
              <Grid key={index} item xs={12} md={4}>
                <FlexBox
                  justifyContent="center"
                  alignItems="center"
                  position="relative"
                >
                  <IconButton
                    onClick={() =>
                      action({
                        title: 'Remover Banner',
                        text: 'Esta operação é irreversível. Continuar?',
                        image: banner.image,
                        isDelete: true
                      })
                    }
                    sx={{
                      position: 'absolute',
                      right: -8,
                      top: -8,
                      border: '1px solid #ffffff',
                      background: '#eb5454',
                      borderRadius: '73px !important',
                      width: '30px',
                      height: '30px',
                      color: '#fff',
                      fontSize: '14px',
                      '&:hover': {
                        background: '#eb5454',
                        color: '#fff'
                      }
                    }}
                  >
                    <i className="fi fi-rr-trash" />
                  </IconButton>
                  <img
                    src={banner.image}
                    style={{
                      border: '1px dashed #f4f4f4',
                      borderRadius: 4,
                      height: '100%',
                      width: '100%',
                      objectFit: 'cover'
                    }}
                    alt="Banner"
                  />
                </FlexBox>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
}
