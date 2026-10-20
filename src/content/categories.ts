/**
 * Categorias de fornecimento.
 * Os itens listados em "examples" descrevem tipos de material que podem ser cotados —
 * não representam estoque. Disponibilidade, especificação e prazo são confirmados pela equipe.
 */

const unsplash = (id: string) => `https://images.unsplash.com/${id}`;

export type Category = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  examples: string[];
  image: string;
  imageAlt: string;
  seoTitle: string;
};

export const categories: Category[] = [
  {
    slug: "rolamentos-e-mancais",
    title: "Rolamentos e mancais",
    summary: "Rolamentos de esferas, rolos e mancais para máquinas e equipamentos.",
    description:
      "Cotação de rolamentos e mancais para linhas de produção, motores, redutores, transportadores e equipamentos de manutenção. Informe a referência, a marca ou as dimensões e nossa equipe busca as opções de fornecimento.",
    examples: [
      "Rolamentos rígidos de esferas",
      "Rolamentos de rolos cônicos e cilíndricos",
      "Rolamentos autocompensadores",
      "Mancais de pedestal e flangeados",
      "Buchas de fixação e acessórios",
    ],
    image: unsplash("photo-1589391349202-900abe66462a"),
    imageAlt: "Rolamentos metálicos em close",
    seoTitle: "Rolamentos industriais e mancais",
  },
  {
    slug: "flanges-e-conexoes",
    title: "Flanges e conexões",
    summary: "Flanges, conexões e acessórios para linhas de processo e utilidades.",
    description:
      "Fornecimento de flanges e conexões para tubulações industriais, com cotação por norma, classe de pressão, material e diâmetro.",
    examples: [
      "Flanges de pescoço, sobrepostos e cegos",
      "Curvas, tês e reduções",
      "Luvas, niples e uniões",
      "Juntas e vedações",
      "Conexões em aço carbono, inox e galvanizado",
    ],
    image: unsplash("photo-1620203853151-496c7228306c"),
    imageAlt: "Rede de tubulações industriais com flanges e válvulas",
    seoTitle: "Flanges e conexões industriais",
  },
  {
    slug: "valvulas-e-registros",
    title: "Válvulas e registros",
    summary: "Válvulas industriais para controle, bloqueio e retenção de fluidos.",
    description:
      "Cotação de válvulas e registros para água, vapor, ar comprimido, óleo e processos industriais. Envie o tipo, a bitola, a conexão e o material desejado.",
    examples: [
      "Válvulas gaveta, globo e esfera",
      "Válvulas borboleta e de retenção",
      "Registros e válvulas de bloqueio",
      "Válvulas de alívio e segurança",
      "Atuadores e acessórios",
    ],
    image: unsplash("photo-1780034766224-04cfda73fa09"),
    imageAlt: "Válvula industrial com volante e atuador",
    seoTitle: "Válvulas industriais e registros",
  },
  {
    slug: "parafusos-porcas-e-fixadores",
    title: "Parafusos, porcas e fixadores",
    summary: "Elementos de fixação em diferentes classes, materiais e acabamentos.",
    description:
      "Fixadores para montagem, manutenção e estruturas metálicas. Informe a rosca, a classe de resistência, o material e a quantidade.",
    examples: [
      "Parafusos sextavados, Allen e estojos",
      "Porcas, arruelas e travas",
      "Chumbadores e barras roscadas",
      "Rebites e pinos",
      "Fixadores em aço carbono, inox e zincados",
    ],
    image: unsplash("photo-1605701249987-f0bb9b505d06"),
    imageAlt: "Parafusos e porcas metálicos",
    seoTitle: "Parafusos, porcas e fixadores industriais",
  },
  {
    slug: "tubos-e-conexoes-industriais",
    title: "Tubos e conexões industriais",
    summary: "Tubos e acessórios para tubulações de processo, utilidades e estruturas.",
    description:
      "Cotação de tubos industriais por material, schedule, diâmetro e comprimento, com conexões e acessórios para a montagem completa.",
    examples: [
      "Tubos de aço carbono com e sem costura",
      "Tubos de aço inoxidável",
      "Tubos galvanizados",
      "Conexões roscadas e soldáveis",
      "Abraçadeiras e suportes",
    ],
    image: unsplash("photo-1765218933298-dc55fdfb517a"),
    imageAlt: "Tubulações e máquinas em ambiente fabril",
    seoTitle: "Tubos e conexões industriais",
  },
  {
    slug: "cilindros-e-componentes-pneumaticos",
    title: "Cilindros e componentes pneumáticos",
    summary: "Cilindros, válvulas e acessórios para sistemas de ar comprimido.",
    description:
      "Componentes pneumáticos para automação e manutenção de máquinas. Envie o código do fabricante ou as especificações de curso, diâmetro e conexão.",
    examples: [
      "Cilindros pneumáticos",
      "Válvulas direcionais e solenoides",
      "Unidades de preparação de ar (FRL)",
      "Conexões e mangueiras pneumáticas",
      "Reguladores e manômetros",
    ],
    image: unsplash("photo-1753775851957-cd7f43c7a299"),
    imageAlt: "Cilindro pneumático industrial com manômetros",
    seoTitle: "Cilindros e componentes pneumáticos",
  },
  {
    slug: "materiais-eletricos",
    title: "Materiais elétricos",
    summary: "Componentes para painéis, comandos, instalações e manutenção elétrica.",
    description:
      "Materiais elétricos industriais para montagem de painéis, comandos e manutenção de instalações. Informe a marca, o modelo ou a especificação técnica.",
    examples: [
      "Disjuntores, contatores e relés",
      "Cabos e condutores",
      "Botoeiras, sinalizadores e chaves",
      "Eletrocalhas, eletrodutos e acessórios",
      "Terminais, bornes e identificação",
    ],
    image: unsplash("photo-1544724569-5f546fd6f2b5"),
    imageAlt: "Painel elétrico com disjuntores e fiação",
    seoTitle: "Materiais elétricos industriais",
  },
  {
    slug: "equipamentos-industriais",
    title: "Equipamentos industriais",
    summary: "Equipamentos para produção, utilidades e apoio à operação.",
    description:
      "Cotação de equipamentos industriais conforme a aplicação, a capacidade e as especificações informadas pela sua equipe técnica.",
    examples: [
      "Motores e motorredutores",
      "Bombas e compressores",
      "Ventiladores e exaustores",
      "Equipamentos para utilidades",
      "Instrumentos de medição",
    ],
    image: unsplash("photo-1717386255773-a456c611dc4e"),
    imageAlt: "Máquina industrial com painel de controle em uma fábrica",
    seoTitle: "Equipamentos industriais",
  },
  {
    slug: "soldagem-ferramentas-e-consumiveis",
    title: "Ferramentas e consumíveis de soldagem",
    summary: "Consumíveis, abrasivos e ferramentas para soldagem e caldeiraria.",
    description:
      "Ferramentas e consumíveis de soldagem e corte para oficinas, caldeirarias e equipes de manutenção.",
    examples: [
      "Eletrodos, arames e varetas",
      "Discos de corte e desbaste",
      "Ferramentas manuais e elétricas",
      "Acessórios para soldagem",
      "Abrasivos e consumíveis",
    ],
    image: unsplash("photo-1564182998523-6923112e7d6b"),
    imageAlt: "Profissional trabalhando com esmerilhadeira e faíscas",
    seoTitle: "Ferramentas e consumíveis de soldagem",
  },
  {
    slug: "pecas-de-reposicao-e-componentes-mecanicos",
    title: "Peças de reposição e componentes mecânicos",
    summary: "Componentes de transmissão e peças para manutenção de máquinas.",
    description:
      "Peças de reposição e componentes mecânicos identificados por código, desenho técnico ou amostra. Envie fotos e referências para agilizar a cotação.",
    examples: [
      "Engrenagens, polias e acoplamentos",
      "Correias e correntes",
      "Retentores, anéis e vedações",
      "Eixos, buchas e chavetas",
      "Peças sob especificação técnica",
    ],
    image: unsplash("photo-1759621165667-da064b86fdd0"),
    imageAlt: "Engrenagens metálicas de um mecanismo",
    seoTitle: "Peças de reposição e componentes mecânicos",
  },
  {
    slug: "movimentacao-de-cargas",
    title: "Equipamentos de movimentação de cargas",
    summary: "Equipamentos e acessórios para içamento, transporte e armazenagem.",
    description:
      "Equipamentos e acessórios para movimentação de cargas em armazéns, pátios, portos e plantas industriais.",
    examples: [
      "Talhas e guinchos",
      "Cintas, lingas e manilhas",
      "Paleteiras e carrinhos",
      "Acessórios para içamento",
      "Componentes para empilhadeiras",
    ],
    image: unsplash("photo-1620388640785-892616248ec8"),
    imageAlt: "Empilhadeira em operação em um armazém",
    seoTitle: "Equipamentos de movimentação de cargas",
  },
  {
    slug: "materiais-de-manutencao-industrial",
    title: "Materiais de manutenção industrial",
    summary: "Insumos para manutenção preventiva e corretiva da planta.",
    description:
      "Materiais de manutenção industrial para manter a operação funcionando: lubrificação, vedação, limpeza técnica e itens de uso recorrente.",
    examples: [
      "Lubrificantes e graxas",
      "Vedantes, adesivos e fitas",
      "Produtos para limpeza técnica",
      "Mangueiras e abraçadeiras",
      "Itens de consumo recorrente",
    ],
    image: unsplash("photo-1595856898575-9d187bd32fd6"),
    imageAlt: "Técnico de manutenção industrial com capacete",
    seoTitle: "Materiais de manutenção industrial",
  },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);

export const images = {
  hero: unsplash("photo-1717386255773-1e3037c81788"),
  about: unsplash("photo-1781157076377-3c17f8c365ee"),
  buyers: unsplash("photo-1553413077-190dd305871c"),
};
