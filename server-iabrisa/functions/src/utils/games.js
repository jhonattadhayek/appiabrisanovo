exports.gamesObApp = () => {
  return [
    {
      actived: false,
      premium: false,
      pattern: "both",
      rule: "default",
      type: "generated",
      expirationTime: 60,
      assertiveness: 0,
      name: "Padrão Duplo",
      sequence: 1,
      gale: 2,
      image:
        "https://firebasestorage.googleapis.com/v0/b/sinalmax.firebasestorage.app/o/ob%2FsignalDefault_short.png?alt=media&token=397f5335-93ee-4024-a37f-6c4c80b2406d"
    },
    {
      actived: false,
      premium: false,
      pattern: "put",
      name: "Padrão de Compra",
      rule: "default",
      expirationTime: 60,
      assertiveness: 0,
      type: "generated",
      sequence: 2,
      gale: 2,
      image:
        "https://firebasestorage.googleapis.com/v0/b/sinalmax.firebasestorage.app/o/ob%2FsignalBull_short.png?alt=media&token=c3f52693-dc51-4a91-af4f-34168e1a18d3"
    },
    {
      actived: false,
      premium: false,
      pattern: "call",
      name: "Padrão de Venda",
      rule: "default",
      expirationTime: 60,
      assertiveness: 0,
      type: "generated",
      sequence: 3,
      gale: 2,
      image:
        "https://firebasestorage.googleapis.com/v0/b/sinalmax.firebasestorage.app/o/ob%2FsignalBear_short.png?alt=media&token=a82f263c-4fe7-4e03-86c3-9a59beda314d"
    }
  ];
};
