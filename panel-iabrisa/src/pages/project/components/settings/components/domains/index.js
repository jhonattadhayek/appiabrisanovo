import React, { Fragment, useState } from 'react';

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  useMediaQuery
} from '@mui/material';
import MuiButton from 'components/mui/button';
import { H3, Span } from 'components/typography';

import CreateDomain from './create';
import DomainItem from './item';

export default function Domains({ project, setProject }) {
  const downMd = useMediaQuery(theme => theme.breakpoints.down('md'));

  const [open, setOpen] = useState(false);

  return (
    <Fragment>
      {open && (
        <CreateDomain
          onClose={() => setOpen(false)}
          project={project}
          setProject={setProject}
        />
      )}

      <Card>
        <CardHeader
          title={
            <H3 fontSize="16px" fontWeight={500}>
              Domínios
            </H3>
          }
          subheader={
            <Span color="text.disabled" fontSize="14px">
              Adicione domínios para seu app.
            </Span>
          }
          action={
            downMd ? (
              <IconButton onClick={() => setOpen(true)}>
                <i
                  className="fi fi-br-plus"
                  style={{ fontSize: '12px', marginBottom: -2 }}
                />
              </IconButton>
            ) : (
              <MuiButton
                size="small"
                variant="contained"
                onClick={() => setOpen(true)}
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
                    style={{ fontSize: '12px', marginBottom: -2 }}
                  />
                }
              >
                Adicionar
              </MuiButton>
            )
          }
        />
        <CardContent>
          <Box mt={-2}>
            <DomainItem
              project={project}
              lastItem={project?.domains.length === 0}
              domain={{
                url: 'app-stakbroker.web.app',
                default: true,
                actived: true
              }}
            />

            {project?.domains.map((domain, index) => {
              return (
                <Box key={index}>
                  <DomainItem
                    project={project}
                    domain={domain}
                    setProject={setProject}
                    lastItem={index === project?.domains.length - 1}
                  />
                </Box>
              );
            })}
          </Box>
        </CardContent>
      </Card>
    </Fragment>
  );
}
