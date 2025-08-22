import React from 'react';

export const MENU_PROJECT = [
  {
    label: 'Visão Geral',
    value: 'overview',
    icon: (
      <i
        className="fi fi-sr-chart-pie-alt"
        style={{ fontSize: '14px', marginBottom: -2 }}
      />
    )
  },
  {
    label: 'Configurações',
    value: 'settings',
    icon: (
      <i
        className="fi fi-sr-settings"
        style={{ fontSize: '14px', marginBottom: -2 }}
      />
    )
  },
  {
    label: 'Personalização',
    value: 'preferences',
    icon: (
      <i
        className="fi fi-sr-file-edit"
        style={{ fontSize: '14px', marginBottom: -2 }}
      />
    )
  },
  {
    label: 'Usuários',
    value: 'users',
    icon: (
      <i
        className="fi fi-sr-users"
        style={{ fontSize: '14px', marginBottom: -2 }}
      />
    )
  },
  {
    label: 'Meus Sinais',
    value: 'signals',
    icon: (
      <i
        className="fi fi-br-bullseye"
        style={{ fontSize: '14px', marginBottom: -2 }}
      />
    )
  }
];
