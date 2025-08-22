import React from 'react';

import FlexBox from 'components/flexBox';
import { Paragraph, Span } from 'components/typography';
import useApp from 'hooks/useApp';

export default function OnlineUsers() {
  const { app } = useApp();

  const getOnlineUsers = () => {
    const min = app?.resources?.onlineUsers?.min || 3500;
    const max = app?.resources?.onlineUsers?.max || 10000;

    const storageUsers = JSON.parse(localStorage.getItem('onlineUsers'));
    const value = Math.floor(Math.random() * (max - min + 1)) + min;

    const formater = Intl.NumberFormat('pt-br', {
      notation: 'compact',
      compactDisplay: 'short'
    });

    if (
      !storageUsers ||
      new Date() - new Date(storageUsers?.timestamp) > 7200000
    ) {
      localStorage.setItem(
        'onlineUsers',
        JSON.stringify({
          value: formater.format(value),
          timestamp: new Date()
        })
      );

      return formater.format(value);
    }

    return storageUsers.value;
  };

  return (
    <FlexBox justifyContent="center" textAlign="center" gap={0.5}>
      <FlexBox alignItems="center" gap={0.5}>
        <i
          className="fi fi-rr-users"
          style={{
            color: app?.theme?.primaryColor,
            fontSize: '16px',
            marginBottom: -6
          }}
        />
        <Span
          fontWeight={700}
          color={app?.theme?.primaryColor}
          sx={{ ml: 0.5 }}
        >
          {getOnlineUsers()}
        </Span>
      </FlexBox>

      <Paragraph color="#cbcbcb">usuários online.</Paragraph>
    </FlexBox>
  );
}
