const FirebaseService = require("../../../config/firebase");
const adminSdk = new FirebaseService();

const { StatusProjectEnum } = require("../../../enums/StatusProjectEnum");
const { v4: uuidv4 } = require("uuid");

exports.generateProjects = async (type, format) => {
  const projectsRef = adminSdk.dbProjects();

  const countRef = projectsRef.count();
  const size = await countRef.get().then(doc => doc.data().count);

  let project;

  if (type === "igaming" && format === "app") {
    project = igamingApp(size);
  }

  if (type === "igaming" && format === "bot") {
    project = igamingBot(size);
  }

  if (type === "ob" && format === "app") {
    project = obApp(size);
  }

  if (type === "ob" && format === "bot") {
    project = obBot(size);
  }

  if (type === "sports" && format === "app") {
    project = sportsApp(size);
  }

  if (type === "sports" && format === "bot") {
    project = sportsBot(size);
  }

  if (!project) return null;

  return await projectsRef.add(project).then(doc => {
    return Object.assign(project, { id: doc.id });
  });
};

const igamingApp = size => {
  return {
    status: StatusProjectEnum.actived,
    countId: size + 1,
    name: "Novo Aplicativo",
    slug: `novo-app-${size + 1}`,
    createdAt: new Date().getTime(),
    type: "igaming",
    format: "app",
    numUsers: 0,
    games: {},
    domains: [],
    dns: {
      domain: "",
      conected: false
    },
    settings: {
      logoURL:
        "https://firebasestorage.googleapis.com/v0/b/sinalmax.firebasestorage.app/o/default_logo.png?alt=media&token=1b9ef36e-5e62-4533-8995-733ae8b6368d",
      affiliateLink: null,
      language: "pt-br",
      scripts: ""
    },
    pages: {
      login: {
        actived: true,
        field: "email",
        createAccountLink: null,
        title: "Bem vindo ao melhor App do Brasil",
        logoURL:
          "https://firebasestorage.googleapis.com/v0/b/sinalmax.firebasestorage.app/o/default_logo.png?alt=media&token=1b9ef36e-5e62-4533-8995-733ae8b6368d"
      },
      home: {
        actived: true,
        banners: []
      },
      deposit: {
        actived: true,
        url: ""
      },
      premium: {
        actived: false,
        URL: "",
        cta: "Venha ser Premium",
        description:
          "Atualize sua assinatura para o plano Premium e tenha acesso aos jogos mais lucrativos do momento",
        title: "Aumente seus lucros!"
      },
      more: []
    },
    plans: {
      free: {
        validation: "anyone",
        name: "Básico"
      },
      paid: {
        validation: "buyed",
        name: "Premium"
      }
    },
    resources: {
      onlineUsers: {
        actived: true
      },
      percentage: {
        actived: true
      },
      socialProof: {
        actived: true
      }
    },
    theme: {
      type: "lagoon",
      edited: false,
      primaryColor: "#01c46a",
      secondaryColor: "#c9fbe4",
      background: "#070b0d",
      paper: "#191f24"
    },
    token: uuidv4()
  };
};

const igamingBot = size => {
  return {
    status: StatusProjectEnum.actived,
    countId: size + 1,
    name: "Nova Sala",
    createdAt: new Date().getTime(),
    type: "igaming",
    format: "bot",
    games: {},
    removeMessages: false,
    telegram: {
      botToken: null,
      chatId: null
    },
    whatsapp: {
      endpoint: null
    },
    settings: {
      dailyResult: "08:00",
      schedules: {
        actived: false,
        list: []
      },
      limited: {
        actived: false,
        value: 4
      },
      gale: 2
    },
    token: uuidv4()
  };
};

const obApp = size => {
  return {
    status: StatusProjectEnum.actived,
    countId: size + 1,
    name: "Novo Aplicativo",
    slug: `novo-app-${size + 1}`,
    createdAt: new Date().getTime(),
    type: "ob",
    format: "app",
    numUsers: 0,
    domains: [],
    dns: {
      domain: "",
      conected: false
    },
    games: {
      1: {
        showIframe: true,
        actived: false,
        premium: false,
        pattern: "both",
        rule: "default",
        type: "generated",
        expirationTime: 60,
        assertiveness: 0,
        name: "Padrão Duplo",
        sequence: 0,
        gale: 2,
        image:
          "https://firebasestorage.googleapis.com/v0/b/sinalmax.firebasestorage.app/o/ob%2FsignalDefault_short.png?alt=media&token=397f5335-93ee-4024-a37f-6c4c80b2406d"
      },
      2: {
        showIframe: true,
        actived: false,
        premium: false,
        pattern: "call",
        name: "Padrão de Compra",
        rule: "default",
        expirationTime: 60,
        assertiveness: 0,
        type: "generated",
        sequence: 0,
        gale: 2,
        image:
          "https://firebasestorage.googleapis.com/v0/b/sinalmax.firebasestorage.app/o/ob%2FsignalBull_short.png?alt=media&token=c3f52693-dc51-4a91-af4f-34168e1a18d3"
      },
      3: {
        showIframe: true,
        actived: false,
        premium: false,
        pattern: "put",
        name: "Padrão de Venda",
        rule: "default",
        expirationTime: 60,
        assertiveness: 0,
        type: "generated",
        sequence: 0,
        gale: 2,
        image:
          "https://firebasestorage.googleapis.com/v0/b/sinalmax.firebasestorage.app/o/ob%2FsignalBear_short.png?alt=media&token=a82f263c-4fe7-4e03-86c3-9a59beda314d"
      }
    },
    settings: {
      logoURL:
        "https://firebasestorage.googleapis.com/v0/b/sinalmax.firebasestorage.app/o/default_logo.png?alt=media&token=1b9ef36e-5e62-4533-8995-733ae8b6368d",
      affiliateLink: null,
      language: "pt-br",
      scripts: ""
    },
    pages: {
      login: {
        actived: true,
        field: "email",
        createAccountLink: null,
        title: "Bem vindo ao melhor App do Brasil",
        logoURL:
          "https://firebasestorage.googleapis.com/v0/b/sinalmax.firebasestorage.app/o/default_logo.png?alt=media&token=1b9ef36e-5e62-4533-8995-733ae8b6368d"
      },
      home: {
        actived: true,
        banners: []
      },
      premium: {
        actived: false,
        URL: "",
        cta: "Venha ser Premium",
        description:
          "Atualize sua assinatura para o plano Premium e tenha acesso aos jogos mais lucrativos do momento",
        title: "Aumente seus lucros!"
      },
      more: []
    },
    plans: {
      free: {
        validation: "anyone",
        name: "Básico"
      },
      paid: {
        validation: "buyed",
        name: "Premium"
      }
    },
    resources: {
      onlineUsers: {
        actived: true
      },
      percentage: {
        actived: true
      },
      socialProof: {
        actived: true
      }
    },
    theme: {
      type: "lagoon",
      edited: false,
      primaryColor: "#01c46a",
      secondaryColor: "#c9fbe4",
      background: "#070b0d",
      paper: "#191f24"
    },
    token: uuidv4()
  };
};

const obBot = size => {
  return {
    status: StatusProjectEnum.actived,
    countId: size + 1,
    name: "Nova Sala",
    createdAt: new Date().getTime(),
    type: "ob",
    format: "bot",
    games: {},
    removeMessages: false,
    telegram: {
      botToken: null,
      chatId: null
    },
    whatsapp: {
      endpoint: null
    },
    settings: {
      dailyResult: "08:00",
      schedules: {
        actived: false,
        list: []
      },
      limited: {
        actived: false,
        value: 4
      },
      gale: 2
    },
    token: uuidv4()
  };
};

const sportsApp = size => {
  return {
    status: StatusProjectEnum.actived,
    countId: size + 1,
    name: "Novo Aplicativo",
    slug: `novo-app-${size + 1}`,
    createdAt: new Date().getTime(),
    type: "sports",
    format: "app",
    numUsers: 0,
    domains: [],
    dns: {
      domain: "",
      conected: false
    },
    sports: [],
    tips: [],
    settings: {
      logoURL:
        "https://firebasestorage.googleapis.com/v0/b/sinalmax.firebasestorage.app/o/default_logo.png?alt=media&token=1b9ef36e-5e62-4533-8995-733ae8b6368d",
      affiliateLink: null,
      language: "pt-br",
      scripts: ""
    },
    pages: {
      login: {
        actived: true,
        field: "email",
        createAccountLink: null,
        title: "Bem vindo ao melhor App do Brasil",
        logoURL:
          "https://firebasestorage.googleapis.com/v0/b/sinalmax.firebasestorage.app/o/default_logo.png?alt=media&token=1b9ef36e-5e62-4533-8995-733ae8b6368d"
      },
      home: {
        actived: true,
        banners: []
      },
      deposit: {
        actived: true,
        url: ""
      },
      premium: {
        actived: false,
        URL: "",
        cta: "Venha ser Premium",
        description:
          "<p>Atualize sua assinatura para o plano Premium e tenha acesso aos jogos mais lucrativos do momento</p>",
        title: "Aumente seus lucros!"
      },
      more: []
    },
    plans: {
      free: {
        validation: "anyone",
        name: "Básico"
      },
      paid: {
        validation: "buyed",
        name: "Premium"
      }
    },
    resources: {
      onlineUsers: {
        actived: true
      },
      socialProof: {
        actived: true
      }
    },
    theme: {
      type: "lagoon",
      edited: false,
      primaryColor: "#01c46a",
      secondaryColor: "#c9fbe4",
      background: "#070b0d",
      paper: "#191f24"
    },
    token: uuidv4()
  };
};

const sportsBot = size => {
  return {
    status: StatusProjectEnum.actived,
    countId: size + 1,
    name: "Nova Sala",
    createdAt: new Date().getTime(),
    type: "sports",
    format: "bot",
    games: {},
    removeMessages: false,
    telegram: {
      botToken: null,
      chatId: null
    },
    whatsapp: {
      endpoint: null
    },
    settings: {
      dailyResult: "08:00",
      schedules: {
        actived: false,
        list: []
      },
      limited: {
        actived: false,
        value: 4
      },
      gale: 2
    },
    token: uuidv4()
  };
};
