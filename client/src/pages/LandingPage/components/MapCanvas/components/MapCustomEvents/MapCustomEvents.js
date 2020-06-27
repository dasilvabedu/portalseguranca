import { useEffect } from 'react';
import { useLeaflet } from 'react-leaflet';

export default function MapCustomEvents({
  onZoomStart,
  onEsc
}) {
  const { map } = useLeaflet();
  
  function handleKeyDown(event) {
    let isEscape = false;
    const { originalEvent } = event;

    if (!originalEvent) { return; }

    if ('key' in originalEvent) {
      isEscape = (originalEvent.key === 'Escape' || originalEvent.key === 'Esc');
    } else {
      isEscape = (originalEvent.keyCode === 27);
    }

    if (isEscape) { onEsc(); }
  }

  useEffect(() => {
    map.on('zoomstart', onZoomStart);
    map.on('keydown', handleKeyDown);

    return () => {
      map.off('zoomstart', onZoomStart);
      map.off('keydown', handleKeyDown);
    };
  }, [map]);

  return null;
}
