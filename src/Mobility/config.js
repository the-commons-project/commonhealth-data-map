import * as _ from 'underscore';

export const loadConfig = (config) => {
  // Handle aggregation type properties
  let aggregationConfig = config['aggregations'];
  _.pairs(aggregationConfig).forEach((kv) => {
    let aggConfig = aggregationTypes[kv[0]];
    _.pairs(kv[1]).forEach((kv2) => {
      aggConfig[kv2[0]] = kv2[1];
    });
  });

  return config;
};

export const aggregationTypes = {
  'country': {
    label: 'National'
  },

  // TODO if necessary: add regions
  // 'region': {
  //     label: 'Regional',
  //     default: true
  // }
};

export const mobilityLayerConfig = {
  retail_and_recreation: {
    label: 'Retail and recreation',
    description: 'Places like restaurants, cafes, shopping centers, theme parks, museums, libraries, and movie theaters',
    color: "#2B84BB",
    colors: ["#003564","#146498","#3E96CA","#7EC9F9","#F5F5F5","#F6B07C","#BF7C4B","#884C22","#531F00"],
    order:0,
    default: true
  },
  grocery_and_pharmacy: {
    label: 'Grocery and pharmacy',
    description: 'Places like grocery markets, food warehouses, farmers markets, specialty food shops, drug stores, and pharmacies',
    color: "#33A02D",
    colors: ["#003C00","#0A6D0D","#2DA22D","#6DD760","#F5F5F5","#F6B07C","#BF7C4B","#884C22","#531F00"],
    order: 1
  },
  parks: {
    label: 'Parks',
    desription: 'Places like national parks, public beaches, marinas, dog parks, plazas, and public gardens',
    color: "#7E3CB7",
    colors: ["#450080","#7C37B6","#B36DE0","#EFA4FC","#F5F5F5","#F6B07C","#BF7C4B","#884C22","#531F00"],
    order: 2
  },
  transit_stations: {
    label: 'Transit stations',
    description: 'Places like public transport hubs such as subway, bus, and train stations',
    color: "#15BFCF",
    colors: ["#003A4A","#006A7A","#149DAD","#42D3E3","#F5F5F5","#F6B07C","#BF7C4B","#884C22","#531F00"],
    order: 3
  },
  workplaces: {
    label: 'Workplaces',
    description: 'Places of work',
    color: "#BCBD23",
    colors: ["#303300","#5C6100","#8D920F","#C5C532","#F5F5F5","#F6B07C","#BF7C4B","#884C22","#531F00"],
    order: 4
  },
  residential: {
    label: 'Residential',
    description: 'Places of residence',
    color: "#3030CE",
    colors: ["#0011A9","#4D43E4","#9378FF","#D4B1FE","#F5F5F5","#F6B07C","#BF7C4B","#884C22","#531F00"],
    order:5
  },
};
