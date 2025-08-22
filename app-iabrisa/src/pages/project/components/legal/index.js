import React, { Fragment } from 'react';

import { Box } from '@mui/material';
import Header from 'components/header';
import { Paragraph, Span } from 'components/typography';

export default function Legal() {
  return (
    <Fragment>
      <Header title="Aviso Legal" />

      <Box mt={2}>
        <Box>
          <Paragraph color="text.disabled" fontSize="16px">
            Os sinais fornecidos são gerados com base em análises de
            probabilidade, cálculos computacionais e estratégias predefinidas.
          </Paragraph>

          <Paragraph color="text.disabled" sx={{ mt: 1.5 }} fontSize="16px">
            Ressaltamos que, embora nossos métodos sejam desenvolvidos com foco
            em precisão e desempenho,{' '}
            <Span color="#fff">
              {' '}
              não podemos garantir 100% de assertividade nos resultados.
            </Span>
          </Paragraph>

          <Paragraph color="text.disabled" sx={{ mt: 1.5 }} fontSize="16px">
            A utilização dos sinais fornecidos é de inteira
            <Span color="#fff"> responsabilidade do usuário</Span>, e
            recomendamos o uso consciente e moderado de qualquer ferramenta
            relacionada a essas atividades.
          </Paragraph>
        </Box>

        <Box mt={3}>
          <Paragraph color="text.disabled">
            Versão: {process.env.REACT_APP_VERSION}
          </Paragraph>
        </Box>
      </Box>
    </Fragment>
  );
}
