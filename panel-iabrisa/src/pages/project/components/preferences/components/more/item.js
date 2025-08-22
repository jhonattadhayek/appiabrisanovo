import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { MoreHorizOutlined } from '@mui/icons-material';
import {
  Box,
  CircularProgress,
  IconButton,
  MenuItem,
  Popover,
  useMediaQuery
} from '@mui/material';
import FlexBox from 'components/flexBox';
import { Paragraph, Small } from 'components/typography';
import Api from 'config/api';
import useAuth from 'hooks/useAuth';
import Swal from 'sweetalert2';

import EditMenuComponent from './edit';

export default function MenuItemComponent(props) {
  const { item, project, setProject } = props;

  const { setUser } = useAuth();
  const anchorRef = useRef(null);

  const downMd = useMediaQuery(theme => theme.breakpoints.down('md'));

  const [openDialog, setOpenDialog] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpenMenu = () => {
    setOpenMenu(true);
  };

  const handleCloseMenu = () => {
    setOpenMenu(false);
  };

  const handleOpenDialog = () => {
    handleCloseMenu();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const action = ({ title, text, isDelete }) => {
    handleCloseMenu();

    Swal.fire({
      title,
      text,
      showCancelButton: true,
      confirmButtonColor: '#5742b9',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        remove();
      }
    });
  };

  const remove = async () => {
    setLoading(true);

    try {
      const { data } = await Api.patch(
        `/projects/menu/${project.id}?delete=true`,
        { ...item, token: project.token }
      );

      setProject(data.project);
      setUser({ project: data.project });

      toast.success('Navegação removida com sucesso');
    } catch (error) {
      toast.error(
        error?.message || 'Algo inesperado aconteceu. Tente novamente'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {openDialog && (
        <EditMenuComponent
          handleCloseDialog={handleCloseDialog}
          project={project}
          setProject={setProject}
          menu={item}
        />
      )}

      <FlexBox my={0.8} alignItems="center" justifyContent="space-between">
        <FlexBox alignItems="center" gap={1}>
          <FlexBox
            alignItems="center"
            justifyContent="center"
            width={80}
            height={45}
            sx={{
              backgroundColor: '#f3f4f6',
              borderRadius: 1
            }}
          >
            {item.image ? (
              <Box component="img" src={item.image} width={80} height={45} />
            ) : (
              <i
                className="fi fi-br-picture"
                style={{
                  fontSize: '16px',
                  marginBottom: -3,
                  color: '#9ca3af'
                }}
              />
            )}
          </FlexBox>

          <Box>
            <Paragraph
              fontWeight="bold"
              sx={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                display: 'block',
                maxWidth: downMd ? 150 : 380
              }}
            >
              {item.title}
            </Paragraph>

            <Small
              color="text.disabled"
              sx={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                display: 'block',
                maxWidth: downMd ? 150 : 380
              }}
            >
              {item.description}
            </Small>
          </Box>
        </FlexBox>

        <FlexBox alignItems="center" justifyContent="center">
          {loading ? (
            <FlexBox
              alignItems="center"
              justifyContent="center"
              height={40}
              width={40}
            >
              <CircularProgress color="secondary" size={14} />
            </FlexBox>
          ) : (
            <IconButton onClick={handleOpenMenu}>
              <MoreHorizOutlined ref={anchorRef} />
            </IconButton>
          )}

          <Popover
            sx={{ marginTop: 1, width: '280px', position: 'fixed' }}
            open={openMenu}
            onClose={handleCloseMenu}
            anchorEl={anchorRef.current}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <MenuItem onClick={handleOpenDialog}>Editar</MenuItem>
            <MenuItem
              onClick={() =>
                action({
                  title: 'Remover domínio',
                  text: 'Esta operação é irreversível. Continuar?',
                  isDelete: true
                })
              }
            >
              Remover
            </MenuItem>
          </Popover>
        </FlexBox>
      </FlexBox>
    </>
  );
}
