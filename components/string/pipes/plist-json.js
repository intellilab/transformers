import plist from 'plist';

function parse(vertex) {
  return vertex.slice(2, -2).split(',').map(value => +value);
}

export function handle(input) {
  const results = plist.parse(input);

  const bodies = Object.keys(results.bodies).reduce((obj, key) => {
    const body = results.bodies[key];
    const anchorpoint = parse(body.anchorpoint);
    const fixtures = body.fixtures.map(fixture => ({
      ...fixture,
      polygons: fixture.polygons.map(vertexes => vertexes.map(parse)),
    }));
    obj[key] = {
      anchorpoint,
      fixtures,
    };
    return obj;
  }, {});

  return JSON.stringify({
    ...results,
    bodies,
  });
}

export const meta = {
  name: 'Plist to JSON',
  options: [],
};
