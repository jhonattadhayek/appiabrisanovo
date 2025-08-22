import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  MenuItem,
  Popover,
  useMediaQuery
} from '@mui/material';
import FlexBox from 'components/flexBox';
import { Paragraph, Span } from 'components/typography';
import Api from 'config/api';
import useAuth from 'hooks/useAuth';
import Swal from 'sweetalert2';

import ConfigureDomain from './configure';

export default function DomainItem(props) {
  const { domain, project, setProject, lastItem } = props;

  const { setUser } = useAuth();
  const anchorRef = useRef(null);

  const downMd = useMediaQuery(theme => theme.breakpoints.down('md'));

  const [openMenu, setOpenMenu] = useState(false);
  const [openConfigureDomain, setOpenConfigureDomain] = useState(false);
  const [loading, setLoading] = useState(false);

  const action = ({ title, text, isDelete }) => {
    handleClose();

    Swal.fire({
      title,
      text,
      showCancelButton: true,
      confirmButtonColor: '#5742b9',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        updateDomain(domain.url, isDelete);
      }
    });
  };

  const updateDomain = async (url, isDelete) => {
    setLoading(true);

    try {
      const body = {
        url,
        token: project.token
      };

      const path = `/projects/domains/${project.id}?delete=${isDelete}`;
      const { data } = await Api.patch(path, body);

      setProject(data.project);
      setUser({ project: data.project });

      toast.success(
        isDelete
          ? 'Domínio removido com sucesso'
          : 'Domínio definido como padrão'
      );
    } catch (err) {
      toast.error(err.message);
      console.error(err.message || err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpenMenu(false);
  };

  const openLink = () => {
    const URL =
      domain.url === 'app-ai-trader.web.app'
        ? `${domain.url}/${project?.slug}`
        : domain.url;

    return 'https://' + URL;
  };

  const handleOpenConfigureDomain = () => {
    handleClose(false);

    setOpenConfigureDomain(true);
  };

  const handleCloseConfigureDomain = () => {
    setOpenConfigureDomain(false);
  };

  return (
    <Box>
      {openConfigureDomain && (
        <ConfigureDomain domain={domain} onClose={handleCloseConfigureDomain} />
      )}

      <FlexBox my={0.8} alignItems="center" justifyContent="space-between">
        <Box color="textPrimary">
          <Link to={openLink()} target="_blank">
            <FlexBox alignItems="center" gap={0.5}>
              <Paragraph>{domain.url}</Paragraph>

              <i
                className="fi fi-rr-up-right-from-square"
                style={{ fontSize: '10px', marginBottom: -4 }}
              />

              {domain.url === project?.dns?.domain && (
                <Span
                  sx={{
                    ml: 1.5,
                    background: '#eff1f3',
                    fontSize: '12px',
                    padding: '3px 10px',
                    borderRadius: '12px'
                  }}
                >
                  Padrão
                </Span>
              )}
            </FlexBox>
          </Link>

          {downMd && !domain.actived && (
            <Chip
              label="Configuração necessária"
              color="error"
              variant="outlined"
              size="small"
              onClick={handleOpenConfigureDomain}
              sx={{ mt: 1, fontSize: '12px' }}
            />
          )}
        </Box>

        <FlexBox alignItems="center" justifyContent="center">
          {!downMd && !domain.actived && (
            <Box mr={1}>
              <Chip
                label="Configuração necessária"
                color="error"
                variant="outlined"
                size="small"
                onClick={handleOpenConfigureDomain}
                sx={{ fontSize: '12px' }}
              />
            </Box>
          )}

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
            <IconButton onClick={() => setOpenMenu(true)}>
              <MoreHorizOutlinedIcon ref={anchorRef} />
            </IconButton>
          )}

          <Popover
            sx={{ marginTop: 1, width: '280px', position: 'fixed' }}
            open={openMenu}
            onClose={handleClose}
            anchorEl={anchorRef.current}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <MenuItem
              disabled={domain.default || domain.url === project?.dns?.domain}
              onClick={() =>
                action({
                  title: 'Definir como padrão',
                  text: 'O domínio do app será alterado. Continuar?',
                  isDelete: false
                })
              }
            >
              Definir como padrão
            </MenuItem>
            <MenuItem
              disabled={domain.default || domain.url === project?.dns?.domain}
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

      {!lastItem && <Divider sx={{ my: 2 }} />}
    </Box>
  );
}
