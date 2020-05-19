const componets: { [key: string]: () => JSX.Element } = {};

const rc = require.context("./", true, /\.tsx$/);
rc.keys().forEach(key => {
  let defaultComp: () => JSX.Element = rc(key)["default"];
  if (defaultComp && defaultComp.name) {
    componets[defaultComp.name] = defaultComp;
  }
});

module.exports = {
  ...componets
};
