import mixpanel from 'mixpanel-browser';

export const isProduction = process.env.REACT_APP_ISPROD === 'true';

if (isProduction) {
  mixpanel.init('c7c11684939aa922256e19e6e5d88f46');
} else {
  mixpanel.init('e903d602bc8eb2c652c11a05306a85fe');
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
