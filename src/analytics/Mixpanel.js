import mixpanel from 'mixpanel-browser';

export const isProduction = process.env.REACT_APP_ISPROD === 'true';

if (isProduction) {
  mixpanel.init('02cd2ca8a4b9369a9cc0f381d34cc2f3');
} else {
  mixpanel.init('4d316b5b0c240fd24ae4e63baa70be99');
}

let actions = {
  identify: (id) => {
    mixpanel.identify(id);
  },
  alias: (id) => {
    mixpanel.alias(id);
  },
  track: (name, props) => {
    mixpanel.track(name, props);
  },
  people: {
    set: (props) => {
      mixpanel.people.set(props);
    },
  },
};

export let Mixpanel = actions;
