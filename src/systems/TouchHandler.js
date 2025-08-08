
export default function TouchHandler(entities, { touches, dispatch }) {
  const pressTouches = touches.filter(t => t.type === 'press');
  const body = entities.character?.body;

  if (body) {
    const { min, max } = body.bounds;
    pressTouches.forEach(t => {
      const { pageX: x, pageY: y } = t.event;
      if (x >= min.x && x <= max.x && y >= min.y && y <= max.y) {
        dispatch({ type: 'show-stats' });
      }
    });
  }

  return entities;
}
